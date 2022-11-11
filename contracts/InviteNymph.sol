// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "./AbstractNymph.sol";

// 邀请会议，由发起者邀请一代用户，一代用户有两个邀请名额，可以邀请二代用户参会
contract InviteNymph is AbstractNymph {
    uint8 max_invite_people = 3;

    constructor(
        string memory name,
        string memory symbol,
        string memory metaInfo,
        uint256 hT,
        uint256 pL,
        uint256 v,
        uint8 tT
    ) AbstractNymph(name, symbol, metaInfo, holdTime, pL, v, tT) {}

    // 裂变的mint方法
    function _fissionMint(address originAddress)
        external
        payable
        override
        beforeMeetingEnd
        lessThanLimit
        shouldHaveWhite(originAddress)
    {
        require(balanceOf(msg.sender) == 0, "already have ticket");
        require(
            invite_people[originAddress].length < max_invite_people,
            "invitor reach invite limit"
        );
        _safeMint(msg.sender, counter);
        invite_people[originAddress].push(msg.sender);
        counter++;
    }

    function CanInvite() external view override returns (bool) {
        return
            whites_map[msg.sender] &&
            invite_people[msg.sender].length < max_invite_people;
    }
}
