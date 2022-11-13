import { ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()


async function main() {
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    const contractAdress = process.argv[2];
    const votedOnProposal = process.argv[3];
    const amount = process.argv[4];
    
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
//    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ACC1 ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);
    const balance = await signer.getBalance();
    console.log(`This address has a balance of ${balance} wei units`);
    if(balance.eq(0)) throw new Error("I'm too poor");
    // No longer need the below hardhat function as we are directly gettting accounts from ethers instead of hardhat
    // const accounts = await ethers.getSigners();
    const ballotContractFactory = new TokenizedBallot__factory(signer);
    const ballotContract = ballotContractFactory.attach(
        contractAdress);

    const tx = await ballotContract.vote(votedOnProposal, amount);
    await tx.wait();
    console.log(`Done! Transaction hash: ${tx.hash}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});