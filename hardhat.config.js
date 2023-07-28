require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_HTTP_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// arbi
const ALTRPCNODE1_HTTP_URL = process.env.RPC1_URL;
const ALTSCAN1_API_KEY = process.env.ALTSCAN1_API_KEY;
// ftm
const ALTRPCNODE2_HTTP_URL = process.env.RPC2_URL;
const ALTSCAN2_API_KEY = process.env.ALTSCAN2_API_KEY;
// eth
const ALTRPCNODE3_HTTP_URL = process.env.RPC3_URL;
const ALTSCAN3_API_KEY = process.env.ALTSCAN3_API_KEY;
// bsc
const ALTRPCNODE4_HTTP_URL = process.env.RPC4_URL;
const ALTSCAN4_API_KEY = process.env.ALTSCAN4_API_KEY;

// const SCAN_API_KEY = ETHERSCAN_API_KEY // 0
// const SCAN_API_KEY = ALTSCAN1_API_KEY // 1
// const SCAN_API_KEY = ALTSCAN2_API_KEY // 2
// const SCAN_API_KEY = ALTSCAN3_API_KEY // 3
const SCAN_API_KEY = ALTSCAN4_API_KEY // 4

module.exports = {
  solidity: "0.8.19",
  networks: {
    // sepolia: {
    //   url: QUICKNODE_HTTP_URL,
    //   accounts: [PRIVATE_KEY],
    // },
    polygon: {
      url: QUICKNODE_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
    arbi: {
      url: ALTRPCNODE1_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
    fantom: {
      url: ALTRPCNODE2_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
    eth: {
      url: ALTRPCNODE3_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
    bsc: {
      url: ALTRPCNODE4_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: SCAN_API_KEY,
  },
};

