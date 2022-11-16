// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ICreator {
    function holdMeetingProxy(
        string memory name,
        string memory symbol,
        string memory metaInfoURL,
        uint256 holdTime,
        uint256 personLimit,
        uint8 templateType,
        uint value,
        address sender
    ) external returns (address c);
}
