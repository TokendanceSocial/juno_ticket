// 我们可以通过 npx hardhat run <script> 来运行想要的脚本
// 这里你可以使用 npx hardhat run deploy.js 来运行
const hre = require("hardhat");

async function main() {
  const Creator = await ethers.getContractFactory("Creator");
  const creator = await Creator.deploy();
  await creator.deployed();
  console.log("Creator deploy success:", creator.address);

  const Juno = await hre.ethers.getContractFactory("Juno");
  const juno = await Juno.deploy(creator.address);
  await juno.deployed();

  console.log("Juno deploy success:", juno.address);

  const tx = await creator.setJunoAddress(juno.address);
  await tx.wait();
  console.log("set creator juno address success");
}

// 运行脚本
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
