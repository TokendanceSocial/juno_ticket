const { ethers } = require("hardhat");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, assert } = require("chai");
const { deployJunoContract } = require("./JunoContractTest");

const deployNymphContract = async () => {
  const { juno } = await deployJunoContract();
  const holdParam = {
    name: "Test Meeting",
    symbol: "Meeting",
    metaInfoURL:
      "https://bafyreidjucml2ktmyuswyunr5qgvh26yxwelphwqthgmlr7os3rwuutpde.ipfs.nftstorage.link/metadata.json",
    holdTime: Math.floor(Date.now() / 1000),
    personLimit: 5,
    templateType: 1,
    value: 0,
  };
  const tx = await juno.HoldMeeting(
    holdParam.name,
    holdParam.symbol,
    holdParam.metaInfoURL,
    holdParam.holdTime,
    holdParam.personLimit,
    holdParam.templateType,
    holdParam.value
  );
  const holdR = await tx.wait();
  const event = holdR.events.find((event) => event.event === "NewMeeting");
  const [from, ticketAddress] = event.args;
  const nymph = await ethers.getContractAt("Nymph", ticketAddress);
  return { nymph };
};

describe("Nymph Contract Test", () => {
  describe("合约部署", () => {
    it("should have address", async () => {
      const { nymph } = await deployNymphContract();
      expect(nymph.address).to.not.empty;
    });
    it("should have meta uri", async () => {
      const { nymph } = await deployNymphContract();
      expect(await nymph.tokenURI(1)).to.not.empty;
    });
  });
  describe("空投", () => {
    it("should have ticken", async () => {
      const [owner, addr1, addr2] = await ethers.getSigners();
      const { nymph } = await deployNymphContract();
      const tx = await nymph._batchMint([addr1.address]);
      await tx.wait();
      expect(await nymph.balanceOf(addr1.address)).to.equal(1);
    });
    it("can sign by owner", async () => {
      const [owner, addr1] = await ethers.getSigners();
      const { nymph } = await deployNymphContract();
      let tx = await nymph._batchMint([addr1.address]);
      await tx.wait();
      tx = await nymph.Sign(addr1.address);
      const result = await tx.wait();
      expect(result.events.length).to.greaterThan(0);
    });
    it("cannot sign by owner itself", async () => {
      const [owner, addr1] = await ethers.getSigners();
      const { nymph } = await deployNymphContract();
      let tx = await nymph._batchMint([addr1.address]);
      await tx.wait();

      let hasError = false;
      await nymph
        .connect(addr1)
        .Sign(addr1.address)
        .then((tx) => {
          console.log("transaction", tx);
        })
        .catch((error) => {
          //   console.log("error", error);
          hasError = true;
        });
      expect(hasError).to.be.true;
    });
  });
});
