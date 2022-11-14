import { ethers } from "hardhat"; 
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");
//run using yarn hardhat run ./scripts/ERC20Votes.ts
async function main() { 
    const accounts = await ethers.getSigners();
    //Deploy the contract

    const contractFactory = new MyToken__factory(accounts[0]);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`Token contract deployed at ${contract.address} \n`);

    //Mint some tokens for account 1 from account 0
    const mintTx = await contract.mint(accounts[1].address, MINT_VALUE);
    await mintTx.wait();
    console.log(`Minted ${
        MINT_VALUE.toString()} decimal units to account  ${
            accounts[1].address} \n`
            );
    const balanceBN = await contract.balanceOf(accounts[1].address);
    console.log(`Account ${
        accounts[1].address} has ${
            balanceBN.toString()} units of MyToken \n`);

    // Check the voting power
    const votes = await contract.getVotes(accounts[1].address);
    console.log(`Account ${
        accounts[1].address} has ${
            votes.toString()
        } units of voting power before self delegating \n`
        );

    //self delegate
    const delegateTx = await contract.connect(accounts[1]).delegate(accounts[1].address);
    await delegateTx.wait();

    //check voting power again
    const votesAfter = await contract.getVotes(accounts[1].address);
    console.log(`Account ${
        accounts[1].address} has ${
            votesAfter.toString()
        } units of voting power after self delegating \n`
        );
    
    //Transfer tokens
    const transferTx = await contract.connect(accounts[1]).transfer(accounts[2].address, MINT_VALUE.div(2));
    await transferTx.wait();

    //Check the voting power again
    const votes1AfterTransfer = await contract.getVotes(accounts[1].address);
    console.log(`Account 1 ${
        accounts[1].address} has ${
            votes1AfterTransfer.toString()
        } units of voting power after transferring \n`
        );
    const votes2AfterTransfer = await contract.getVotes(accounts[1].address);

    console.log(`Account 2 ${
        accounts[2].address} has ${
            votes2AfterTransfer.toString()
        } units of voting power after the transfer \n`
        );

    // Check past voting power
    const lastBlock = await ethers.provider.getBlock("latest");
    console.log(`Current block number ${lastBlock.number} \n`);
    const pastVotes = await contract.getPastVotes(accounts[1].address, lastBlock.number -1);

    console.log(`Account 1 ${
        accounts[1].address} has ${
            pastVotes.toString()
        } units of voting power at previous block \n`
        );


} 

main().catch((error) => { 
    console.error(error); 
    process.exitCode = 1; 
}); 