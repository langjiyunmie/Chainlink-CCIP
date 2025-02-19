const {task} = require("hardhat/config")


task("mint-nft").setAction(async(taskArgs,hre)=>{
    try {
        // 1. 检查网络
        const network = await hre.ethers.provider.getNetwork();
        console.log("Current network:", network.name, network.chainId);

        // 2. 检查账户
        const {firstAccount} = await hre.getNamedAccounts();
        console.log("Account:", firstAccount);

        // 3. 检查部署
        const deployments = await hre.deployments.all();
        console.log("Available deployments:", Object.keys(deployments));
        
        // 4. 获取合约
        console.log("Getting contract...");
        const MyNFT = await hre.deployments.get("MyNFT");
        console.log("Contract address:", MyNFT.address);
        
        // 5. 创建合约实例
        const nft = await hre.ethers.getContractAt(
            "MyNFT",
            MyNFT.address,
            await hre.ethers.getSigner(firstAccount)
        );
        
        // 6. 铸造 NFT
        console.log("Minting NFT...");
        const mintTx = await nft.safeMint(firstAccount);
        console.log("Waiting for confirmation...");
        await mintTx.wait(6);

        const tokenAmount = await nft.totalSupply();
        const tokenId = tokenAmount - 1n;
        
        console.log(`Mint successful! TokenId:${tokenId}, Amount:${tokenAmount}, Owner:${firstAccount}`);
        
    } catch (error) {
        console.error("Detailed error:");
        console.error(error);
        
        // 检查特定错误
        if (error.code === 'INVALID_ARGUMENT') {
            console.error("Contract deployment not found. Please ensure the contract is deployed to Sepolia.");
        }
    }
})

module.exports = {}