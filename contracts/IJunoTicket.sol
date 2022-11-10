// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

interface IJuno {
    // 举办会议
    function HoldMeeting(
        string calldata name,
        string calldata symbol,
        string calldata metaInfoURL,
        uint8 templateType,
        uint value
    ) external returns (address);

    // 某人举办的会议
    function Holds(address host) external view returns (address[] memory);

    // 某人参加的会议
    function Meetings(address host) external view returns (address[] memory);

    // 正在举办的会议
    function HoldingMeetings() external view returns (address[] memory);

    // 添加白名单用户
    function _addTestUser(address) external;
}
