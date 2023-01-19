import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { NETWORKS, Network, NetworkName } from "./config/networks";
import type {
  HttpNetworkAccountsUserConfig,
  NetworkUserConfig,
} from "hardhat/types";
import "./tasks";

const ACCOUNT_TYPE: string = process.env.ACCOUNT_TYPE || "";
const mnemonic: string = process.env.MNEMONIC || "";
if (ACCOUNT_TYPE === "MNEMONIC" && !mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}
if (
  ACCOUNT_TYPE === "PRIVATE_KEYS" &&
  typeof process.env.PRIVATE_KEY_1 === "undefined"
) {
  throw new Error("Please set at least one PRIVATE_KEY_1 in a .env file");
}
const getAccounts = (): HttpNetworkAccountsUserConfig => {
  if (ACCOUNT_TYPE === "PRIVATE_KEYS") {
    // can add as many private keys as you want
    return [
      `0x${process.env.PRIVATE_KEY_1}`,
      // `0x${process.env.PRIVATE_KEY_2}`,
      // `0x${process.env.PRIVATE_KEY_3}`,
      // `0x${process.env.PRIVATE_KEY_4}`,
      // `0x${process.env.PRIVATE_KEY_5}`,
    ];
  } else {
    return {
      mnemonic,
      count: 10,
      path: "m/44'/60'/0'/0",
    };
  }
};
// { [key in NetworkName]: { chainId, url, accounts } }
function getAllNetworkConfigs(): Record<NetworkName, NetworkUserConfig> {
  const networkConfigs = Object.entries(NETWORKS).reduce<
    Record<string, NetworkUserConfig>
  >((memo, network) => {
    const key = network[0] as NetworkName;
    const value = network[1] as Network;

    memo[key] = {
      ...value,
      accounts: getAccounts(),
    };
    return memo;
  }, {});

  return networkConfigs as Record<NetworkName, NetworkUserConfig>;
}
const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    // LOCAL
    hardhat: { chainId: 31337 },
    "truffle-dashboard": {
      url: "http://localhost:24012/rpc",
    },
    ganache: { chainId: 1337, url: "http://127.0.0.1:7545" },

    ...getAllNetworkConfigs(),
  },
};
export default config;
