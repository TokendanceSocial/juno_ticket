const hre = require("hardhat");

async function main() {
  const signer = hre.ethers.Signer;
  const Contract = await hre.ethers.getContractFactory("Nymph");
  const nymph = await Contract.attach(
    "0x8C59CA0e0c3C54033a17eEFBb2344F81A277F23A"
  );

  console.log(nymph.address);
  console.log(await nymph.GetValue());
}

// 运行脚本
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
