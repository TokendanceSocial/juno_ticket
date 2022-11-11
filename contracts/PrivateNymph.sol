// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "./AbstractNymph.sol";

// 普通/私密会议，只有发起者邀请才可以参加会议
// 如果是私密会议，则需要在会议结束后24小时Burn掉
contract PrivateNymph is AbstractNymph {
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
        require(false, "not allowed");
    }

    function CanInvite() external view override returns (bool) {
        return false;
    }
}
