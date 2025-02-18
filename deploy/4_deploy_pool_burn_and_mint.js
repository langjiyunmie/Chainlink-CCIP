const {getNamedAccounts,deployments, ethers, network} = require("hardhat");
const {developmentChains,networkConfig} = require("../helper-hardhat-config.js")


module.exports = async({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;


    let destChainRouter;
    let linkTokenAddr;

    if(developmentChains.includes(network.name)){
        // 1. 获取部署信息
        const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
        // 2. 获取合约实例
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator",ccipSimulatorDeployment.address);
        // 3. 获取router,link,wnft的地址
        const ccipConfig = await ccipSimulator.configuration();
        destChainRouter = ccipConfig.destinationRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    }
    else{
        destChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }
    log("Deploying NFTPoolBurnAndMint contract...");
    const wnftAddrDeployment = await deployments.get("WrappedNFT");
    const wnftAddr = wnftAddrDeployment.address;
    // 4. 部署NFTPoolBurnAndMint合约
    await deploy("NFTPoolBurnAndMint",{
        contract:"NFTPoolBurnAndMint",
        from:firstAccount,
        log:true,
        args:[destChainRouter,linkTokenAddr,wnftAddr]
    })

}

module.exports.tags = ["destChain","all"];