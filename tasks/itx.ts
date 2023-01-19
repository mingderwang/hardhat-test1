import { task } from "hardhat/config";

const INFURA_KEY = process.env.INFURA_API_KEY;
task("itx", "Prints the itx", async (_, { ethers }) => {

const itx = new ethers.providers.InfuraProvider(
  'goerli', // or 'mainnet'
  INFURA_KEY
)
  console.log(itx);
});
