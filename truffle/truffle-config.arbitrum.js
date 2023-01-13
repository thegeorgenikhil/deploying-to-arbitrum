// create a file at the root of your project and name it .env -- there you can set process variables
// like the mnemomic below. Note: .env is ignored by git in this project to keep your private information safe
require("dotenv").config();

//uncomment to use mainnetMnemonic, be sure to set it in the .env file
//const mainnetMnemonic = process.env["MAINNET_MNEMONIC"]

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  /**
   * contracts_build_directory tells Truffle where to store compiled contracts
   */
  contracts_build_directory: "./build/arbitrum-contracts",

  /**
   *  contracts_directory tells Truffle where to find your contracts
   */
  contracts_directory: "./contracts/arbitrum",

  networks: {
    development: {
      url: "http://127.0.0.1:9545",
      network_id: "*",
    },
    // for use with local environment -- use `npm runLocalArbitrum` to start
    // after you have installed the repo and run `npm runLocalEthereum`, which will run a test L1 chain
    // **please note, this network does not currently work; we will remove this line once the issue is fixed!
    arbitrum_local: {
      network_id: "*",
      gas: 8500000,
      provider: function () {
        return new HDWalletProvider(
          process.env.PRIVATE_KEY,
          "https://arb-goerli.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
          0,
          1
        );
      },
    },
    arbitrum_testnet: {
      network_id: 421611,
      provider: function () {
        return new HDWalletProvider(
          process.env.PRIVATE_KEY,
          "https://arb-goerli.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
          0,
          1
        );
      },
    },
    // requires a mainnet mnemonic; you can save this in .env or in whatever secure location
    // you wish to use
    arbitrum_mainnet: {
      network_id: 42161,
      chain_id: 42161,
      provider: function () {
        return new HDWalletProvider(
          process.env.PRIVATE_KEY,
          "https://arb-goerli.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
          0,
          1
        );
      },
    },
    arbitrum_goerli: {
      network_id: 421613,
      chain_id: 421613,
      provider: function () {
        return new HDWalletProvider(
          process.env.PRIVATE_KEY,
          "https://arb-goerli.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
          0,
          1
        );
      },
    },
  },

  mocha: {
    timeout: 100000,
  },
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 800,
        },
      },
    },
  },
  api_keys: {
    arbiscan: process.env.ARBISCAN_KEY,
  },
  plugins: ["truffle-plugin-verify"],
  db: {
    enabled: false,
  },
};
