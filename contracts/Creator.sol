// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "./Nymph.sol";

contract Creator {
    address public juno;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    modifier junoOrOwner() {
        require(msg.sender == owner || msg.sender == juno, "owner or juno");
        _;
    }

    function setJunoAddress(address j) external onlyOwner {
        juno = j;
    }

    // 举办会议
    function holdMeetingProxy(
        string memory name,
        string memory symbol,
        string memory metaInfoURL,
        uint256 holdTime,
        uint256 personLimit,
        uint8 templateType,
        uint value,
        address sender
    ) external junoOrOwner returns (address c) {
        Nymph n = new Nymph(
            name,
            symbol,
            metaInfoURL,
            holdTime,
            personLimit,
            value,
            templateType,
            sender,
            juno
        );
        c = address(n);
        return c;
    }
}
