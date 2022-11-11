// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./INymph.sol";
import "./PrivateNymph.sol";
import "./FissionNymph.sol";
import "./InviteNymph.sol";

contract Juno is Ownable {
    INymph[] public meetings;
    mapping(address => address[]) public meetingHolds;
    address[] white;

    modifier inWhite(address holder) {
        for (uint i = 0; i < white.length; i++) {
            if (holder == white[i]) {
                _;
            }
        }
        require(false, "must in white");
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
    ) external inWhite(msg.sender) returns (address) {
        INymph c;
        if (templateType == 1 || templateType == 3) {
            c = new PrivateNymph(
                name,
                symbol,
                metaInfoURL,
                holdTime,
                personLimit,
                value,
                templateType
            );
        } else if (templateType == 2) {
            c = new FissionNymph(
                name,
                symbol,
                metaInfoURL,
                holdTime,
                personLimit,
                value,
                templateType
            );
        } else if (templateType == 4) {
            c = new InviteNymph(
                name,
                symbol,
                metaInfoURL,
                holdTime,
                personLimit,
                value,
                templateType
            );
        }
        meetings.push(c);
        meetingHolds[msg.sender].push(address(c));
        return address(c);
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
