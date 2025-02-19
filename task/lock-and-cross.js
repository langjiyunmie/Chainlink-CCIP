const {task} = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");
const { networks } = require("../hardhat.config");

task("lock-and-cross")
    .addParam("tokenid", "tokenid to lock and cross")
    .addOptionalParam("chainselector", "chainSelector of destination chain")
    .addOptionalParam("receiver", "receiver in destination chain")
    .setAction(async(taskArgs, hre) => {
        //get tokenid
        const tokenId = taskArgs.tokenid

        //get deployer
        const {firstAccount} = await hre.getNamedAccounts();
        console.log("deployer is:", firstAccount)

        //get chainSelector
        let destChainSelector
        if(taskArgs.chainselector){
            destChainSelector = taskArgs.chainselector
        }else{
            destChainSelector = networkConfig[hre.network.config.chainId].companionChainSelector

        }
        console.log("destination chainSelector is:", destChainSelector)

        //get receiver
        let destReceiver
        if(taskArgs.receiver){
            destReceiver = taskArgs.receiver
        }else{
            const nftBurnAndMint = await hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint")
            destReceiver = nftBurnAndMint.address
        }
        console.log("destination receiver is:", destReceiver)

        //get link token
        const linkTokenAddr = networkConfig[hre.network.config.chainId].linkToken
        const linkToken = await hre.ethers.getContractAt("LinkToken", linkTokenAddr)
        console.log("link token is:", linkTokenAddr)

        //get nft pool
        const nftPoolLockAndRelease = await hre.ethers.getContract("NFTPoolLockAndRelease", firstAccount)
        console.log("nft pool is:", nftPoolLockAndRelease.target)

        //Transfer link token to nft pool
        const balanceBefore = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log("balance before is:", balanceBefore)
        const transferLinkTx = await linkToken.transfer(nftPoolLockAndRelease.target, hre.ethers.parseEther("0"))
        await transferLinkTx.wait(6)
        const balanceAfter = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log("balance after is:", balanceAfter)

        //get nft and approve
        const nft = await hre.ethers.getContract("MyNFT", firstAccount)
        await nft.approve(nftPoolLockAndRelease.target, tokenId)
        console.log("nft approved successfully")

        //lock nft
        console.log("locking nft...")
        console.log(`tokenId: ${tokenId}`, `owner: ${firstAccount}`, `destChainSelector: ${destChainSelector}`, `destReceiver: ${destReceiver}`)
        const lockAndCrossTx = await nftPoolLockAndRelease.lockAndSendNFT(tokenId, firstAccount , destChainSelector, destReceiver)
        await lockAndCrossTx.wait(6)
        console.log("nft locked and sent successfully")

         // provide the transaction hash
         console.log(`NFT locked and crossed, transaction hash is ${lockAndCrossTx.hash}`)
         //messageId
         console.log(`messageId is ${lockAndCrossTx.value}`)
        
        



    })