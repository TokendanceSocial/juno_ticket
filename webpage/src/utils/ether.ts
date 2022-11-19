import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import config from '../config/app'
// 会议abi
// export const IJunoabi = [
//   `function HoldMeeting(
//     string calldata name,
//     string calldata symbol,
//     string calldata metaInfoURL,
//     uint8 templateType,
//     uint value
// ) external returns (address)`, // 举办会议
//   "function Holds(address host) external view returns (address[] memory);", // 某人举办的会议
//   "function Meetings(address host) external view returns (address[] memory)", // 某人参加的会议
//   "function HoldingMeetings() external view returns (address[] memory)", // 正在举办的会议
//   "function _addTestUser(address) external" // 添加白名单用户
// ];

export const IJunoabi = [
  "function HoldMeeting(string,string,string,uint256,uint256,uint8,uint256) returns (address)",
  "function HoldingMeetings() view returns (address[])",
  "function Holds(address) view returns (address[])",
  "function Meetings(address) view returns (address[])",
  "function _addTestUser(address)"
];


export const INymphabi = [
  "event Approval(address indexed,address indexed,uint256 indexed)",
  "event ApprovalForAll(address indexed,address indexed,bool)",
  "event Transfer(address indexed,address indexed,uint256 indexed)",
  "function CanInvite() view returns (bool)",
  "function CanSign(address) view returns (bool)",
  "function GetValue() view returns (uint256)",
  "function HoldTime() view returns (uint256)",
  "function InvitedPeople() view returns (address[])",
  "function IsSign(address) view returns (bool)",
  "function Sign(address)",
  "function TemplateType() view returns (uint8)",
  "function _batchMint(address[]) payable",
  "function _fissionMint(address) payable",
  "function approve(address,uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function getApproved(uint256) view returns (address)",
  "function isApprovedForAll(address,address) view returns (bool)",
  "function ownerOf(uint256) view returns (address)",
  "function owner() view returns (address)",
  "function safeTransferFrom(address,address,uint256)",
  "function safeTransferFrom(address,address,uint256,bytes)",
  "function setApprovalForAll(address,bool)",
  "function tokenURI(uint256) view returns (string)",
  "function supportsInterface(bytes4) view returns (bool)",
  "function transferFrom(address,address,uint256)"
]


export const initProvide = async () => {
  // 初始化合约
  const provider = await detectEthereumProvider();
  if (provider) {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(config.CONTRACT_ADRESS, IJunoabi, web3Provider);
    return { contract, web3Provider };
  } else {
    console.log('Please install MetaMask!');
    return Promise.reject('Please install MetaMask!');
  }
}

export const handleAddress = (address: string) => {
  let s = address.slice(0, 6);
  let e = address.slice(address.length - 5);
  return (s + "....." + e);
}

