import { task } from "hardhat/config";

task("itx-deposit", "Prints balance using itx", async (_, { ethers }) => {
  const INFURA_KEY = process.env.INFURA_API_KEY;
  const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;

  const itx = new ethers.providers.InfuraProvider(ETHEREUM_NETWORK, INFURA_KEY);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_1 || "", itx);
  const response = await itx.send("relay_getBalance", [signer.address]);
  console.log(`Your current ITX balance is ${response.balance}`);

  const tx = await signer.sendTransaction({
    // ITX deposit contract (same address for all public Ethereum networks)
    to: "0x015C7C7A7D65bbdb117C573007219107BD7486f9",
    // Choose how much ether you want to deposit to your ITX gas tank
    value: ethers.utils.parseUnits("0.1", "ether"),
  });
  // Waiting for the transaction to be mined
  await tx.wait();
});
