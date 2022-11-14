import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
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
    
    const ballotContractFactory = new MyToken__factory(signer);
    const ballotContract = ballotContractFactory.attach(
        contractAdress);
    const mintTx = await ballotContract.mint(targetAddress, MINT_VALUE);
    await mintTx.wait();
    console.log(`Minted ${
        MINT_VALUE.toString()} decimal units to account  ${
            targetAddress} \n`
            );
    console.log(`Done! Transaction hash: ${mintTx.hash}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
