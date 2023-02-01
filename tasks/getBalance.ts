import { task } from "hardhat/config";

task("itx-getBalance", "Prints balance using itx", async (_, { ethers }) => {
  const INFURA_KEY = process.env.INFURA_API_KEY;
  const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;

  const itx = new ethers.providers.InfuraProvider(ETHEREUM_NETWORK, INFURA_KEY);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_2 || "", itx);
  const response = await itx.send("relay_getBalance", [signer.address]);
  console.log(`Your current ITX balance is ${response.balance}`);
});
