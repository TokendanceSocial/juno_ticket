const { ethers } = require("hardhat");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Juno Contract Test", () => {
  const deployJunoContract = async () => {
    const [owner, address1, address2] = await ethers.getSigners();
    const Juno = await ethers.getContractFactory("Juno");
    const juno = await Juno.deploy();
    return { juno, owner, address1, address2 };
  };
  describe("合约部署", () => {
    it("should have proper address", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const ContractAddress = await juno.address;
      expect(ContractAddress).to.properAddress;
    });
    it("check owner", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const addr = await juno.owner();
      expect(addr).equal(owner.address);
    });
  });
  describe("Hold Meeting", () => {
    const name = "name";
    const symbol = "symbol";
    const metaInfoURL = "ipfs://";
    const holdTime = 1668254237;
    const personLimit = 2;
    it("Hold Type 1", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const tx = await juno.HoldMeeting(
        name,
        symbol,
        metaInfoURL,
        holdTime,
        personLimit,
        1,
        0
      );
      const txResult = await tx.wait();
      const event = txResult.events.find(
        (event) => event.event === "NewMeeting"
      );
      const [from, ticketAddress] = event.args;
      console.log(from, ticketAddress);
      const tA = await juno.meetings(0);
      expect(ticketAddress).to.equal(tA);
      expect(from).to.equal(owner.address);
    });
  });
});
