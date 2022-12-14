require("@nomicfoundation/hardhat-toolbox");
require("hardhat-abi-exporter");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
// GANACHE_PRIVATE_KEY, it will change but I'm trying to fix this.
const GANACHE_PRIVATE_KEY =
  "0xbaad800eec5fecae0740eb708e648a2a521619ab89c28fe25c4e0880a1129976";

module.exports = {
  solidity: "0.8.17",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    ganache: {
      url: `http://127.0.0.1:8545/`,
      accounts: [GANACHE_PRIVATE_KEY],
    },

    polygon: {
      url: process.env.INFURA_URL,
      accounts: [process.env.TEST_PRIVATE_KEY],
    },
    plugchain: {
      url: `http://124.248.67.122:8545`,
      accounts: [process.env.PLUG_PRIVATE_KEY],
    },
    // Make sure you have start ganache before deploy.
  },
  abiExporter: [
    {
      path: "./abi/pretty",
      pretty: true,
    },
  ],
  etherscan: { apiKey: process.env.ETHERSCAN_KEY },
};
