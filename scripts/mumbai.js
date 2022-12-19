const { ethers } = require("hardhat");
const hre = require("hardhat");
const { bech32 } = require("bech32");
const { hexToBytes, bytesToHex } = require("web3-utils");

const junoAddr = "0x9b5e092a8cDb77b7633B3cC6F27F2F710cBc99a3";

const nymphContract = "0x7f47470535f36ef7465b2733f755bc5b90070651";
async function main() {
  const Contract = await hre.ethers.getContractFactory("Juno");
  const juno = await Contract.attach(junoAddr);
  // console.log(await juno.Meetings());
  const NymphContract = await hre.ethers.getContractFactory("Nymph");
  const nymph = await NymphContract.attach(nymphContract);
  // holdMeeting(juno);
  // const uri = await nymph.tokenURI(1);
  // console.log(uri);
  // addUser(juno);
  // sign(nymph);
  batchMint(nymph);
  console.log((await nymph.HoldTime()).toNumber()); // console.log(juno.owner);
  // console.log(
  //   "Meetings",
  //   await juno.Meetings("0x67da691311d666322290e3c1323a75270eccc0cf")
  // );
  // console.log(
  //   "Holds",
  //   await juno.Holds("0xd5c8a05d1cda1caa4956d4aaae94c6632fc19fc0")
  // );
  // console.log(
  //   "Balance",
  //   await nymph.balanceOf("0x67da691311d666322290e3c1323a75270eccc0cf")
  // );
  console.log(
    "IsSign",
    await nymph.IsSign("0x67da691311d666322290e3c1323a75270eccc0cf")
  );
  // const tx = await nymph.AddSignMan(
  //   "0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e"
  // );
  // await tx.wait();
  // console.log(await nymph.owner());
  // transferOwner(nymph);
  console.log(plugchainToHex("gx1e8vhv2nq65vjj6fkvuahhhzp4x5strnvykhwgu"));
}

async function transferOwner(nymph) {
  const tx = await nymph.transferOwnership(
    "0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e"
  );
  const holdResult = await tx.wait();
}

function plugchainToHex(address) {
  return bytesToHex(bech32.fromWords(bech32.decode(address, 1023).words));
}

async function batchMint(nymph) {
  const tx = await nymph._batchMint([
    // "0xdec93a4074d2b8a324379ACcB0fe144dE93284cb",
    // "0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e", // 阿布
    // "0x5254D72BB5604D0Ddc916ed7A45306ca88f9DeCB", // 维涛
    // "0x67da691311d666322290e3c1323a75270eccc0cf", // 维涛plugchain
    // "0xec6c8a6ebb6d162b20480ec05a0c3794b4c51be5", // 啊布 plugchain
    // "0x719acb178aea74756933dd8ce56a65551bff629f", //jason plugchain
    // "0xc83482a4cdf445f03f93ba792d34edf0d9928166", // afra plugchain
    "0xc9d9762a60d519296936673b7bdc41a9a9058e6c", // 维涛2 plugchain
  ]);
  const holdResult = await tx.wait();
  const event = holdResult.events.find((event) => event.event === "Transfer");
  const [from, to, id] = event.args;
  console.log(from, to, id);
}

async function sign(nymph) {
  const tx = await nymph.Sign(
    // "0x6ef65663943FC60885E683F6f0061b3A505cB83C" // monica
    // "0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e" // 阿布
    "0x67da691311d666322290e3c1323a75270eccc0cf" // 维涛
  );
  console.log(await tx.wait());
}

async function metaData(nymph) {
  const uri = await nymph.tokenURI(0);
  console.log("meta data", uri);
  console.log("juno", await nymph.juno());
  console.log("owner ", await nymph.owner());
}

async function holdMeeting(juno) {
  const name = "2022元宇宙音乐节";
  const symbol = "MVM";
  const metaInfoURL =
    "https://bafkreiadoven5if7d4w4avu75oclnrzkb5td6p2arjhseqnimjsnat52zm.ipfs.nftstorage.link/";
  const holdTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const tx = await juno.HoldMeeting(
    name,
    symbol,
    metaInfoURL,
    holdTime,
    10, // 限制3人
    2, // 无限邀请会议
    0 // 票价0元
  );
  const holdResult = await tx.wait();
  const event = holdResult.events.find((event) => event.event === "NewMeeting");
  const [from, ticketAddress] = event.args;
  console.log(from, ticketAddress);
}

async function addUser(juno) {
  const tx = await juno._addTestUser(
    // "0x6ef65663943FC60885E683F6f0061b3A505cB83C" // monica
    // "0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e" // 阿布
    // "0x5254D72BB5604D0Ddc916ed7A45306ca88f9DeCB" // 维涛
    // "0x99ED0E5c3168Ec9F11E8cACD67D14bf3ddD24282" // Jason
    //"0x2071d02554C87F30778A21c48b58B78dEec20092",
    "0x67da691311d666322290e3c1323a75270eccc0cf" // 维涛plugchain
  );
  console.log(await tx.wait());
}

// 运行脚本
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
