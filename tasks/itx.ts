import { keccak256 } from "ethers/lib/utils";
import { task } from "hardhat/config";

task("itx", "using itx to send Transactions", async (_, { ethers }) => {
  const wait = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function callContract() {
    const iface = new ethers.utils.Interface([
      "function echo2(string message)",
    ]);
    const data = iface.encodeFunctionData("echo2", ["Hello world!"]);
    const tx = {
      to: "0xcd969e6355F128B3AF1F11d0a72ac439Fb7DC044",
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
    return relayTransactionHash;
  }
  function printBump(txHash: any, price: any) {
    if (!bump[txHash]) {
      bump[txHash] = true;
      if (process.env.ETHEREUM_NETWORK != "mainnet") {
        console.log(
          `https://${
            process.env.ETHEREUM_NETWORK
          }.etherscan.io/tx/${txHash} @ ${ethers.utils.formatUnits(
            price,
            "gwei"
          )} gwei`
        );
      } else {
        console.log(
          `https://etherscan.io/tx/${txHash} @ ${ethers.utils.formatUnits(
            price,
            "gwei"
          )} gwei`
        );
      }
    }
  }
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
  async function waitTransaction(relayTransactionHash: any) {
    let mined = false;

    while (!mined) {
      const statusResponse = await itx.send("relay_getTransactionStatus", [
        relayTransactionHash,
      ]);

      if (statusResponse.broadcasts) {
        for (let i = 0; i < statusResponse.broadcasts.length; i++) {
          const bc = statusResponse.broadcasts[i];
          const receipt = await itx.getTransactionReceipt(bc.ethTxHash);
          if (receipt && receipt.confirmations && receipt.confirmations > 1) {
            mined = true;
            return receipt;
          }
        }
      }
      await wait(1000);
    }
  }

  const INFURA_KEY = process.env.INFURA_API_KEY;
  const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;

  const itx = new ethers.providers.InfuraProvider(ETHEREUM_NETWORK, INFURA_KEY);
  const bump: boolean[] = [];
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_1 || "", itx);
  const relayTransactionHash = await callContract();

  await waitTransaction(relayTransactionHash);
});
