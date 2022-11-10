// SPDX-License-Identifier: MIT-LICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InviteNymph is ERC721, Ownable {
    uint8 max_invite_people = 3;
    string metaInfoURL;
    uint8 templateType;
    uint256 holdTime;
    uint256 counter;
    uint256 personLimit;
    mapping(address => address[]) public invite_people;
    mapping(address => bool) public whites_map;
    mapping(address => bool) public sign_map;

    modifier shouldHaveWhite(address origin) {
        require(whites_map[origin] == true, "investor not in white lise");
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

    constructor(
        string memory name,
        string memory symbol,
        string memory metaInfo,
        uint256 hT,
        uint256 pL
    ) ERC721(name, symbol) {
        metaInfoURL = metaInfo;
        templateType = 4;
        holdTime = hT;
        personLimit = pL;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return metaInfoURL;
    }

    // 签到
    function Sign(address ownerAddress)
        external
        beforeMeetingEnd
        returns (address)
    {
        if (ownerAddress == address(0)) {
            ownerAddress = msg.sender;
        }
        sign_map[ownerAddress] = true;
    }

    // 是否签到
    function IsSign(address ownerAddress) external returns (bool) {
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
            _safeMint(whites[i], counter);
            whites_map[whites[i]] = true;
            counter++;
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
        require(balanceOf(msg.sender) == 0, "already have ticket");
        require(
            invite_people[originAddress].length < max_invite_people,
            "invitor reach invite limit"
        );
        _safeMint(msg.sender, counter);
        invite_people[originAddress].push(msg.sender);
        counter++;
    }

    // 模版类型
    function TemplateType() external view returns (uint8) {
        return templateType;
    }

    function getInvitedPeople(address first)
        public
        view
        returns (address[] memory)
    {
        return invite_people[first];
    }
}
