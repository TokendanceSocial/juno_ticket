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
  });
});
