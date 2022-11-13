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
    const name = "Test Meeting";
    const symbol = "Meeting";
    const metaInfoURL =
      "https://bafkreibgs4psfdpf37bpdlylvv2xwouzsxjtaf4dxwy6a5hrua7okgjwui.ipfs.nftstorage.link/";
    const holdTime = 1668254237;
    const holdMeeting = async (contract, personLimit, templateType) => {
      const tx = await contract.HoldMeeting(
        name,
        symbol,
        metaInfoURL,
        holdTime,
        personLimit,
        templateType,
        0
      );
      return tx.wait();
    };
    it("Hold Type 1", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const holdResult = await holdMeeting(juno, 1, 1);
      const event = holdResult.events.find(
        (event) => event.event === "NewMeeting"
      );
      const [from, ticketAddress] = event.args;
      console.log(from, ticketAddress);
      const tA = await juno.meetings(0);
      expect(ticketAddress).to.equal(tA);
      expect(from).to.equal(owner.address);

      const meetings = await juno.Holds(owner.address);
      expect(meetings.length).to.equal(1);
    });
    it("Hold Type 2 And mint", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const holdResult = await holdMeeting(juno, 1, 2);
      const event = holdResult.events.find(
        (event) => event.event === "NewMeeting"
      );
      const [from, ticketAddress] = event.args;
      const tA = await juno.meetings(0);
      expect(ticketAddress).to.equal(tA);

      const Nymph = await ethers.getContractFactory("Nymph");
      const nymph = await Nymph.attach(ticketAddress);
      const tx = await nymph._batchMint([
        "0xd5c8A05d1CdA1caA4956D4AAaE94C6632FC19fc0",
      ]);
      const mintResult = await tx.wait();
      const mintEvent = mintResult.events.find(
        (event) => event.event === "Transfer"
      );
      // console.log("Mint event args", mintEvent.args);

      const m = await juno.Meetings(
        "0xd5c8A05d1CdA1caA4956D4AAaE94C6632FC19fc0"
      );
      expect(m.length).to.equal(1);
      expect(m[0]).to.equal(ticketAddress);
    });
  });
});
