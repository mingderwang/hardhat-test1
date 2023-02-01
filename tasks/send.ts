import { keccak256 } from "ethers/lib/utils";
import { task } from "hardhat/config";

task("itx", "Prints balance using itx", async (_, { ethers }) => {
  const INFURA_KEY = process.env.INFURA_API_KEY;
  const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;

  const itx = new ethers.providers.InfuraProvider(ETHEREUM_NETWORK, INFURA_KEY);
  async function signRequest(tx: any) {
    const relayTransactionHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "uint", "uint", "string"],
        [tx.to, tx.data, tx.gas, 5, tx.schedule] // Goerli chainId is 5
      )
    );
    return await signer.signMessage(
      ethers.utils.arrayify(relayTransactionHash)
    );
  }
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_1 || "", itx);

  const iface = new ethers.utils.Interface(["function echo(string message)"]);
  const data = iface.encodeFunctionData("echo", ["Hello world!"]);
  const tx = {
    to: "0x6663184b3521bF1896Ba6e1E776AB94c317204B6",
    data: data,
    gas: "100000",
    schedule: "fast",
  };
  const signature = await signRequest(tx);
  const relayTransactionHash = await itx.send("relay_sendTransaction", [
    tx,
    signature,
  ]);
  console.log(`ITX relay hash: ${relayTransactionHash}`);
  await signer.signMessage(ethers.utils.arrayify(relayTransactionHash));
});
