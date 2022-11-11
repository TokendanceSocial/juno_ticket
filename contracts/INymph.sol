// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INymph is IERC721 {
    // 签到
    function Sign(address ownerAddress) external;

    // 是否签到
    function IsSign(address ownerAddress) external view returns (bool);

    // 开会时间
    function HoldTime() external view returns (uint256);

    // 主办方批量给白名单用户mint
    function _batchMint(address[] calldata whites) external payable;

    // 裂变的mint方法
    function _fissionMint(address originAddress) external payable;

    // 模版类型
    function TemplateType() external view returns (uint8);

    // 邀请的人
    function InvitedPeople() external view returns (address[] memory);

    // 能否邀请
    function CanInvite() external view returns (bool);

    // 能否签到
    function CanSign(address ownerAddress) external view returns (bool);
}
