import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

async function main() {
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    const contractAdress = process.argv[2];
    const targetAddress = process.argv[3];
    
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC_ACCT1 ?? "");
    //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ENCODE_BC ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);
    const balance = await signer.getBalance();
    console.log(`This address has a balance of ${balance} wei units`);
    if(balance.eq(0)) throw new Error("I'm too poor");
    
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(
        contractAdress);
        const delegateTx = await tokenContract.delegate(targetAddress);
        await delegateTx.wait();
    //check voting power again
    const votesAfter = await tokenContract.getVotes(targetAddress);
    console.log(`Account ${
        targetAddress} has ${
            votesAfter.toString()
        } units of voting power after self delegating \n`
        );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});









