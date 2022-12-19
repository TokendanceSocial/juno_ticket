// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "./INymph.sol";
import "./ICreator.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

contract Juno {
    INymph[] public meetings;
    mapping(address => address[]) public meetingHolds;
    mapping(address => bool) public white;
    mapping(address => address[]) peopleJoins;
    address public owner;
    ICreator public creator;

    event NewMeeting(address, address);
    modifier inWhite(address holder) {
        require(white[holder], "must in white");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor(address nymphCreator) {
        white[msg.sender] = true;
        owner = msg.sender;
        creator = ICreator(nymphCreator);
    }

    // 举办会议
    function HoldMeeting(
        string calldata name,
        string calldata symbol,
        string calldata metaInfoURL,
        uint256 holdTime,
        uint256 personLimit,
        uint8 templateType,
        uint value
    ) external returns (address c) {
        require(
            templateType >= 1 && templateType <= 4,
            "template type invalid"
        );

        c = creator.holdMeetingProxy(
            name,
            symbol,
            metaInfoURL,
            holdTime,
            personLimit,
            templateType,
            value,
            msg.sender
        );
        meetings.push(INymph(c));
        meetingHolds[msg.sender].push(c);
        emit NewMeeting(msg.sender, c);
        return c;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = false;
        for (uint i = 0; i < meetings.length; i++) {
            if (meetings[i].getCache().length != 0) {
                return (true, "");
            }
            if (
                meetings[i].TemplateType() == 3 &&
                block.timestamp > (meetings[i].HoldTime() + 2 * 60)
            ) {
                return (true, "");
            }
        }
        return (false, "");
    }

    // @dev this method is called by the Automation Nodes. it increases all elements which balances are lower than the LIMIT
    function performUpkeep(bytes calldata /* performData */) external {
        for (uint i = 0; i < meetings.length; i++) {
            if (
                meetings[i].TemplateType() == 3 &&
                // 一分钟后销毁
                block.timestamp > (meetings[i].HoldTime() + 60)
            ) {
                meetings[i].burnAll();
            }
            address[] memory cacheI = meetings[i].getCache();
            if (meetings[i].getCache().length != 0) {
                // 不对秘密会议进行记录
                if (meetings[i].TemplateType() == 3) {
                    continue;
                }
                for (uint j = 0; j < cacheI.length; j++) {
                    peopleJoins[meetings[i].getCache()[j]].push(
                        address(meetings[i])
                    );
                    // flushJoin()
                }
                meetings[i].clearCache();
            }
        }
    }

    function isInWhite(address host) external view returns (bool) {
        return white[host];
    }

    // 某人举办的会议
    function Holds(address host) external view returns (address[] memory) {
        return meetingHolds[host];
    }

    // 某人参加的会议
    function Meetings(address host) external view returns (address[] memory) {
        uint counter = 0;
        for (uint i = 0; i < meetings.length; i++) {
            if (meetings[i].balanceOf(host) > 0) {
                counter++;
            }
        }
        uint index = 0;
        address[] memory result = new address[](counter);
        for (uint i = 0; i < meetings.length; i++) {
            if (meetings[i].balanceOf(host) > 0) {
                address m = address(meetings[i]);
                result[index] = m;
                index++;
            }
        }
        return result;
    }

    // 正在举办的会议
    function HoldingMeetings() internal view returns (address[] memory) {
        address[] memory result;
        for (uint i = 0; i < meetings.length; i++) {
            if ((meetings[i].HoldTime() + 24 * 60 * 60) < block.timestamp) {
                address m = address(meetings[i]);
                result[result.length] = m;
            }
        }
        return result;
    }

    // 添加白名单用户
    function _addTestUser(address n) external onlyOwner {
        white[n] = true;
    }

    function meetingSomeoneJoined(
        address n
    ) external view returns (address[] memory) {
        return peopleJoins[n];
    }
}
