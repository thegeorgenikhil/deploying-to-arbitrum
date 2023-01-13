# Deploying to Arbitrum

This is a guide to deploying to Arbitrum. We are deploying to arbitrum using 4 Ethereum Development Tools

- Brownie
- Foundry
- Hardhat
- Truffle

### Points to note

- For verifying the contract get the API keys from [https://arbiscan.io/](https://arbiscan.io/)

- Before deploying add in some Arbitrum Goerli Token in your metamask from [https://bridge.arbitrum.io/](https://bridge.arbitrum.io/)

## 1. Deploying to Arbitrum using Brownie

Note: Deploying to arbitrum-goerli is not supported by default in Brownie so we have to add the configuration manually.

### Add Arbitrum Network Configuration

```bash
brownie networks add Arbitrum arbitrum-goerli host=https://goerli-rollup.arbitrum.io/rpc chainid=421613 explorer=https://api-goerli.arbiscan.io/api
```

### Deploying to Arbitrum

- Create a `brownie-config.yaml` file and add this

```
dotenv: .env
```

- Add in the variable in a `.env` file

```
ARBISCAN_TOKEN=<api-key-from-arbiscan>
```

- Run the deploy script

Note: for verification set publish_source=True when writing the scripts/deploy.py file.

```bash
brownie run scripts/deploy.py  --network arbitrum-goerli
```

## 2. Deploying (along with verification) to Arbitrum using Foundry

- Add the variable to your terminal

```
export GOERLI_TESTNET_API_KEY=
export PRIVATE_KEY=
```

- Run the deploy script

```bash
forge create --rpc-url https://goerli-rollup.arbitrum.io/rpc --private-key $PRIVATE_KEY src/Election.sol:Election --verifier-url https://api-goerli.arbiscan.io/api --etherscan-api-key $GOERLI_TESTNET_API_KEY --verify
```

## 3. Deploying to Arbitrum using Hardhat

### Add Arbitrum Network Configuration to hardhat.config.js

- Add in the variable in your .env file

```
ALCHEMY_API_KEY=
PRIVATE_KEY=
ARBISCAN_API_KEY=<api-key-from-arbiscan>
```

- Add in the arbitrum goerli network configuration in the module.exports.networks

```js
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    arbitrum: {
      url: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumGoerli: process.env.ARBISCAN_API_KEY,
    },
  },
};
```

### Deploying to Arbitrum

- Run the deploy script

```bash
npx hardhat run scripts/deploy.js --network arbitrum
```

### Verifying the contract on Arbitrum Etherscan

- Add in a `argument.js` file

```js
module.exports = ["arg1", "arg2",...];
```

```
npx hardhat verify --network arbitrum <contract-address> --constructor-args argument.js
```

## 4. Deploying to Arbitrum using Truffle

Useful Reading - [Truffle Arbitrum](https://trufflesuite.com/boxes/arbitrum/)

### Add Arbitrum Network Configuration to truffle-config.ovm.js

- Install the packages

```bash
npm i dotenv @truffle/hdwallet-provider truffle-plugin-verify
```

- Add in all the variable in a .env file

```
PRIVATE_KEY=<private-key-here>
ALCHEMY_API_KEY=<alchemy-goerli-arbitrum-endpoint>
ARBISCAN_KEY=<api-key-from-arbiscan>
```

- Create a new `truffle-config.ovm.js` file and add this

```js
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
```

- To compile the contract

```
truffle compile --config truffle-config.ovm.js
```

- To test the contract

```
truffle test --config truffle-config.ovm.js --network arbitrum_goerli
```

### Deploying to Arbitrum

```
truffle migrate --config truffle-config.arbitrum.js --network arbitrum_goerli
```

### Verifying the contract on Arbiscan

```
truffle run verify SimpleStorage  --config truffle-config.arbitrum.js  --network arbitrum_goerli
```
