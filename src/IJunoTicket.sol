// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

interface IJuno is Ownable{
    // 举办会议
    HoldMeeting(name string,symbol string,metaInfo string,inviteNumber int,totalNumber int,fissionLimit int,holdTimestampInSecord uint256) public returns(address) 
    // 签到
    Sign(ticketAddress address,ownerAddress address) public returns(address);
    // 某人举办的会议
    Holds(host address) public view returns(address[]);
    // 某人参加的会议
    Meetings(host address) public view returns(address[]);
    // 能否邀请
    CanMint(ticketAddress address,invitorAddress address,inviteeAddress address) public view returns(bool);
    // 能否签到
    CanSign(ticketAddress address,ownerAddress address) public view returns(bool);
    // 正在举办的会议
    HoldingMeetings() public view returns(address[]);

    // 添加白名单用户
    _addTestUser(address) public onlyOwner;
}