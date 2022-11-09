// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TicketContract is ERC721URIStorage {
    uint256 public tokenCounter;
    uint256 public MAX_TOKENS_1g = 100;
    address public owner;
    // NFT对应所有者
    mapping(uint256 => address) private _owners;
    // 一代用户 和 二代用户之间的授权映射
    // require condition: 数组长度小于3
    mapping(address => address[]) public _invitepeople;
    // 用户合约调用情况，记录1g的人，数组长度不限
    mapping(address => bool) public _1gpeople;
    // 用户合约调用情况，记录调用过合约的人，数组长度不限
    mapping(address => mapping(address => bool)) public _calledpeople;

    // simple token name and symbol, it will change later
    constructor() ERC721("Tokendance Ticket", "TDT") {
        tokenCounter = 0;
        owner = msg.sender;
    }

    // 给用户直接空投
    function mint_1g(address address1, string memory tokenURI)
        public
        returns (uint256)
    {
        // 限制只有owner才能给一代用户mint
        require(msg.sender == owner, "Not owner");
        require(tokenCounter < MAX_TOKENS_1g, "ERC721: Max supply");
        // _tokenIds.increment();
        // uint256 newItemId = _tokenIds.current();
        require(_1gpeople[address1] != true, "1g people already have tickets");
        _safeMint(address1, tokenCounter);
        _setTokenURI(tokenCounter, tokenURI);
        _1gpeople[address1] = true;
        tokenCounter = tokenCounter + 1;
        return tokenCounter;
    }

    // 二代用户mint函数
    function mint_2g(
        address address1,
        address address2,
        string memory tokenURI
    ) public returns (uint256) {
        // _tokenIds.increment();
        // uint256 newItemId = _tokenIds.current();
        require(_1gpeople[address1], "not an 1g address");
        require(_1gpeople[address2] != true, "1g people cannot get 2g tickets");
        require(
            _calledpeople[address1][address2] != true,
            "2g address already invited by the 1st generation people"
        );
        _calledpeople[address1][address2] = true;
        require(
            _invitepeople[address1].length < 3,
            "1g address already invited two people"
        );
        _safeMint(address2, tokenCounter);
        _setTokenURI(tokenCounter, tokenURI);
        _invitepeople[address1].push(address2);
        tokenCounter = tokenCounter + 1;
        return tokenCounter;
    }

    // 查询一代用户下的二代用户映射关系
    function check_1g(address address1)
        external
        view
        returns (address[] memory)
    {
        return _invitepeople[address1];
    }
}
