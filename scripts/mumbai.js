const hre = require("hardhat");

const junoAddr = "0x38844C8e1b4B3D1510cf65A1653AD268EE7a71dd";

const nymphContract = "0x71360528ebc97afea9f348fef3d39318749ff769";
async function main() {
  const Contract = await hre.ethers.getContractFactory("Juno");
  const juno = await Contract.attach(junoAddr);

  const NymphContract = await hre.ethers.getContractFactory("Nymph");
  const nymph = await NymphContract.attach(nymphContract);
  // holdMeeting(juno);
  const c = await nymph.getCache();
  console.log(c);
  // addUser(juno);
  // batchMint(nymph);
  // console.log(
  //   "Meetings",
  //   await juno.Meetings("0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e")
  // );
  // console.log(
  //   "Holds",
  //   await juno.Holds("0x7B8dC096Ec0D870F053d1d1666b6D212A2144507")
  // );
  // console.log(
  //   "IsSign",
  //   await nymph.IsSign("0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e")
  // );
  // console.log(await nymph.owner());
  // holdMeeting(juno);
  // transferOwner(nymph);
  // batchMint(nymph);
}

async function transferOwner(nymph) {
  const tx = await nymph.transferOwnership(
    "0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e"
  );
  const holdResult = await tx.wait();
}

async function batchMint(nymph) {
  const tx = await nymph._batchMint([
    // "0xd5c8A05d1CdA1caA4956D4AAaE94C6632FC19fc0",
    "0x7e18Dd1f297C6B407feDd14B96ebe7343508E24e",
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
  const name = "Tokendance测试会议01 - Creator阿布";
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
    "0x7B8dC096Ec0D870F053d1d1666b6D212A2144507"
  );
  console.log(await tx.wait());
}

// 运行脚本
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
