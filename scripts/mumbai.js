const hre = require("hardhat");

const junoAddr = "0x3E46144dE33D87D6Bf8D716a29da1d30A7F4073c";

const nymphContract = "0x7eEC270e6ddAF482ada1453f501CB5CBE9A511Eb";
async function main() {
  const Contract = await hre.ethers.getContractFactory("Juno");
  const juno = await Contract.attach(junoAddr);

  const NymphContract = await hre.ethers.getContractFactory("Nymph");
  const nymph = await NymphContract.attach(nymphContract);
  const m = await juno.Meetings("0xd5c8a05d1cda1caa4956d4aaae94c6632fc19fc0");
  console.log(m);
  // transferOwner(nymph);
  // batchMint(nymph);
  //   const r = await nymph.CanInvite();
  //   console.log(r);
  //   await batchMint(nymph);
}

async function transferOwner(nymph) {
  const tx = await nymph.transferOwnership(
    "0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e"
  );
  const holdResult = await tx.wait();
}

async function batchMint(nymph) {
  const tx = await nymph._batchMint([
    "0xd5c8A05d1CdA1caA4956D4AAaE94C6632FC19fc0",
  ]);
  const holdResult = await tx.wait();
  const event = holdResult.events.find((event) => event.event === "Transfer");
  const [from, to, id] = event.args;
  console.log(from, to, id);
}

async function metaData(nymph) {
  const uri = await nymph.tokenURI(0);
  console.log("meta data", uri);
  console.log("juno", await nymph.juno());
  console.log("owner ", await nymph.owner());
}

async function holdMeeting(juno) {
  const name = "Test Meeting";
  const symbol = "Meeting";
  const metaInfoURL =
    "https://bafkreibgs4psfdpf37bpdlylvv2xwouzsxjtaf4dxwy6a5hrua7okgjwui.ipfs.nftstorage.link/";
  const holdTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const tx = await juno.HoldMeeting(
    name,
    symbol,
    metaInfoURL,
    holdTime,
    3, // 限制3人
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
    "0x5254D72BB5604D0Ddc916ed7A45306ca88f9DeCB"
  );
  console.log(await tx.wait());
}

// 运行脚本
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
