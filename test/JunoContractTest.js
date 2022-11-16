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
    const Creator = await ethers.getContractFactory("Creator");
    const creator = await Creator.deploy();
    const Juno = await ethers.getContractFactory("Juno");
    const juno = await Juno.deploy(creator.address);

    const set = await creator.setJunoAddress(juno.address);
    await set.wait();
    return { juno, owner, address1, address2, creator };
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
    it("creator", async () => {
      const { juno, creator } = await loadFixture(deployJunoContract);
      const addr = await juno.creator();
      expect(addr).to.equal(creator.address);
      expect(await creator.juno()).to.equal(juno.address);
    });
  });
  describe("Hold Meeting", () => {
    const name = "Test Meeting";
    const symbol = "Meeting";
    const metaInfoURL =
      "https://bafkreibgs4psfdpf37bpdlylvv2xwouzsxjtaf4dxwy6a5hrua7okgjwui.ipfs.nftstorage.link/";
    const holdTime = Math.floor(Date.now() / 1000);
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
      const holdR = await tx.wait();
      const event = holdR.events.find((event) => event.event === "NewMeeting");
      const [from, ticketAddress] = event.args;
      return ticketAddress;
    };

    const batchMint = async (nymphAddress, address) => {
      const nymph = await getNymph(nymphAddress);
      const tx = await nymph._batchMint(address);
      return tx.wait();
    };

    const getNymph = async (nymphAddress) => {
      const Nymph = await ethers.getContractFactory("Nymph");
      const nymph = await Nymph.attach(nymphAddress);
      return nymph;
    };
    it("Hold Type 1", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const ticketAddress = await holdMeeting(juno, 2, 1);
      const tA = await juno.meetings(0);
      expect(ticketAddress).to.equal(tA);

      const meetings = await juno.Holds(owner.address);
      expect(meetings.length).to.equal(1);
    });
    it("Hold Type 2 And mint", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const ticketAddress = await holdMeeting(juno, 2, 1);
      const tA = await juno.meetings(0);
      expect(ticketAddress).to.equal(tA);

      const mintResult = await batchMint(ticketAddress, [
        "0xd5c8A05d1CdA1caA4956D4AAaE94C6632FC19fc0",
      ]);
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
    it("Check cache", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const ticketAddress = await holdMeeting(juno, 2, 1);
      const nymph = await getNymph(ticketAddress);
      const cache = await nymph.getCache();
      expect(cache.length).to.equal(1);
    });
    it("clear cache", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const ticketAddress = await holdMeeting(juno, 2, 1);
      const nymph = await getNymph(ticketAddress);
      const tx = await juno.performUpkeep(
        "0x4554480000000000000000000000000000000000000000000000000000000000"
      );
      await tx.wait();
      const cache = await nymph.getCache();
      expect(cache.length).to.equal(0);
    });
    it("flush nymph cache to juno", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const ticketAddress = await holdMeeting(juno, 2, 1);
      const nymph = await getNymph(ticketAddress);
      const tx = await juno.performUpkeep(
        "0x4554480000000000000000000000000000000000000000000000000000000000"
      );
      await tx.wait();
      const cache = await nymph.getCache();
      expect(cache.length).to.equal(0);
      const meetings = await juno.meetingSomeoneJoined(owner.address);
      expect(meetings.length).to.equal(1);
      expect(meetings[0]).to.equal(ticketAddress);
    });
    it("burn secret", async () => {
      const { juno, owner, address1, address2 } = await loadFixture(
        deployJunoContract
      );
      const ticketAddress = await holdMeeting(juno, 2, 3);
      const nymph = await getNymph(ticketAddress);
      expect(await nymph.balanceOf(owner.address)).to.equal(1);

      // 过了两分钟被销毁
      await time.increase(121);
      let tx = await juno.performUpkeep(
        "0x4554480000000000000000000000000000000000000000000000000000000000"
      );
      await tx.wait();
      expect(await nymph.balanceOf(owner.address)).to.equal(0);
    });
  });
});
