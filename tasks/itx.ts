import { task } from "hardhat/config";

const INFURA_KEY = process.env.INFURA_API_KEY;
const YOUR_PRIVATE_KEY = process.env.PRIVATE_KEY_1;
task("itx-getBalance", "Prints the itx", async (_, { ethers }) => {


const itx = new ethers.providers.InfuraProvider(
  'goerli', // or 'mainnet'
  INFURA_KEY
)
const signer = new ethers.Wallet(YOUR_PRIVATE_KEY, itx)
const response = await itx.send('relay_getBalance', [signer.address])
console.log(`Your current ITX balance is ${response.balance}`)

});


