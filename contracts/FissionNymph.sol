// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "./AbstractNymph.sol";

// 裂变会议，可以无限邀请，每邀请成功一人，可以获得10%返佣
contract FissionNymph is AbstractNymph {
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
        _safeMint(msg.sender, counter);
        invite_people[originAddress].push(msg.sender);
        counter++;
    }

    function CanInvite() external view override returns (bool) {
        return true;
    }
}
