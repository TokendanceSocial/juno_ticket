// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Juno.sol";

// The real ticket nft contract
contract Nymph is ERC721, Ownable {
    uint8 max_invite_people = 3;
    string metaInfoURL;
    uint8 templateType;
    uint256 holdTime;
    uint256 counter;
    uint256 personLimit;
    uint256 value;
    address public juno;
    mapping(address => uint256) public token_id_map;
    mapping(address => address[]) public invite_people;
    mapping(address => bool) public whites_map;
    mapping(address => bool) public sign_map;
    address[] cache;

    modifier shouldHaveWhite(address origin) {
        require(whites_map[origin] == true, "investor not in white list");
        _;
    }

    modifier beforeMeetingEnd() {
        require(
            block.timestamp < (holdTime + 24 * 60 * 60),
            "conference has over"
        );
        _;
    }

    modifier lessThanLimit() {
        require(counter < personLimit, "hit invite person limit");
        _;
    }

    modifier shouldJuno() {
        require(msg.sender == juno, "only can call by juno");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        string memory metaInfo,
        uint256 hT,
        uint256 pL,
        uint256 v,
        uint8 tT,
        address owner,
        address j
    ) ERC721(name, symbol) {
        metaInfoURL = metaInfo;
        templateType = tT;
        holdTime = hT;
        personLimit = pL;
        value = v;
        _transferOwnership(owner);
        juno = j;
        _mint(owner);
    }

    function tokenURI(
        uint256 /*tokenId*/
    ) public view virtual override returns (string memory) {
        return metaInfoURL;
    }

    // 签到
    function Sign(address ownerAddress) external onlyOwner beforeMeetingEnd {
        if (ownerAddress == address(0)) {
            ownerAddress = msg.sender;
        }
        sign_map[ownerAddress] = true;
    }

    // 是否签到
    function IsSign(address ownerAddress) external view returns (bool) {
        if (ownerAddress == address(0)) {
            ownerAddress = msg.sender;
        }
        return sign_map[ownerAddress];
    }

    // 开会时间
    function HoldTime() external view returns (uint256) {
        return holdTime;
    }

    // 主办方批量给白名单用户mint
    function _batchMint(address[] calldata whites)
        external
        payable
        beforeMeetingEnd
        lessThanLimit
        onlyOwner
    {
        for (uint i = 0; i < whites.length; i++) {
            require(balanceOf(whites[i]) == 0, "already have ticket");
            whites_map[whites[i]] = true;
            _mint(whites[i]);
        }
    }

    // 裂变的mint方法
    function _fissionMint(address originAddress)
        external
        payable
        beforeMeetingEnd
        lessThanLimit
        shouldHaveWhite(originAddress)
    {
        if (templateType == 1 || templateType == 3) {
            require(false, "not allowed");
        } else if (templateType == 4) {
            require(
                invite_people[originAddress].length < max_invite_people,
                "invitor reach invite limit"
            );
        }
        require(balanceOf(msg.sender) == 0, "already have ticket");
        _mint(msg.sender);
        invite_people[originAddress].push(msg.sender);
    }

    function _mint(address d) internal {
        _safeMint(d, counter);
        token_id_map[d] = counter;
        counter++;
        cache.push(d);
    }

    function burnAll() external shouldJuno {
        require(templateType == 3, "not secret meeting");
        for (uint i = 0; i < counter; i++) {
            _burn(i);
        }
    }

    function clearCache() external shouldJuno {
        delete cache;
    }

    function getCache() external view returns (address[] memory) {
        return cache;
    }

    // 模版类型
    function TemplateType() external view returns (uint8) {
        return templateType;
    }

    function InvitedPeople() external view returns (address[] memory) {
        return invite_people[msg.sender];
    }

    function CanInvite() external view returns (bool) {
        if (templateType == 1 || templateType == 3) {
            return false;
        } else if (templateType == 2) {
            return true;
        } else if (templateType == 4) {
            return
                whites_map[msg.sender] &&
                invite_people[msg.sender].length < max_invite_people;
        }
        require(false, "wrong template type");
        return false;
    }

    function CanSign(address ownerAddress) external view returns (bool) {
        return balanceOf(ownerAddress) > 0 && !this.IsSign(ownerAddress);
    }

    function GetValue() external view returns (uint256) {
        return value;
    }
}
