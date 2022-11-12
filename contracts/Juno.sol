// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./INymph.sol";
import "./Nymph.sol";

contract Juno is Ownable {
    INymph[] public meetings;
    mapping(address => address[]) public meetingHolds;
    address[] public white;

    event NewMeeting(address, address);

    modifier inWhite(address holder) {
        for (uint i = 0; i < white.length; i++) {
            if (holder == white[i]) {
                _;
                return;
            }
        }
        require(false, "must in white");
    }

    constructor() {
        white.push(msg.sender);
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
    ) external inWhite(msg.sender) returns (address c) {
        Nymph n = new Nymph(
            name,
            symbol,
            metaInfoURL,
            holdTime,
            personLimit,
            value,
            templateType
        );
        c = address(n);
        meetings.push(n);
        meetingHolds[msg.sender].push(c);
        emit NewMeeting(msg.sender, c);
        return c;
    }

    // 某人举办的会议
    function Holds(address host) external view returns (address[] memory) {
        return meetingHolds[host];
    }

    // 某人参加的会议
    function Meetings(address host) external view returns (address[] memory) {
        address[] memory result;
        for (uint i = 0; i < meetings.length; i++) {
            if (meetings[i].balanceOf(host) != 0) {
                address m = address(meetings[i]);
                result[result.length] = m;
            }
        }
        return result;
    }

    // 正在举办的会议
    function HoldingMeetings() external view returns (address[] memory) {
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
        white.push(n);
    }
}
