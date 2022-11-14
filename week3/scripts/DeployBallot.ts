import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()//to run: yarn run ts-node --files ./scripts/Deployment.ts arg1 arg 2



function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
    console.log("Deploying ERC20Votes and TokenizedBallot contract");
    console.log("Proposals: ");
    const proposals = ["Chocolate", "Vanilla", "Cookie Dough"];
    const tokenAddress = "0x007d4680437174ccA622C3Ae230Df5b7A0a31779";

    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC_ACCT1 ?? "");
    //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);
    const balance = await signer.getBalance();
    console.log(`This address has a balance of ${balance} wei units`);
    if(balance.eq(0)) throw new Error("I'm too poor");

    //deploy tokenized ballot contract
    // Get the latest block on the chain
    const lastBlock = await provider.getBlock("latest");
    console.log(`Last block number is ${lastBlock.number}\n`);

    const ballotContractFactory = new TokenizedBallot__factory(signer);
    const ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(proposals), tokenAddress, lastBlock.number - 1);
    await ballotContract.deployed();
    console.log(`The ballot smart contract was deployed at ${ballotContract.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});