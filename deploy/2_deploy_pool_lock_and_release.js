const {getNamedAccounts,deployments, ethers, network} = require("hardhat");
const {developmentChains,networkConfig} = require("../helper-hardhat-config.js")


module.exports = async({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    let sourceChainRouter
    let linkTokenAddr
    if(developmentChains.includes(network.name)){
        //  1. 先获取部署信息
        const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
        // 2. 获取合约实例
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator",ccipSimulatorDeployment.address);
        // 3. 调用configuration函数
        const ccipConfig = await ccipSimulator.configuration();
        // 4. 获取router,link的地址,nft的地址
        sourceChainRouter = ccipConfig.sourceRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    }
    else{
        //network.config 是 Hardhat 提供的，用来获取当前运行网络的配置
        //network.config 从 hardhat.config.js 获取网络配置（比如 chainId）
        //用这个 chainId 去 helper-hardhat-config.js 中查找对应的合约配置
        sourceChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }
    log("Deploying NFTPoolLockAndRelease contract...");
    const nftAddrDeployment = await deployments.get("MyNFT");
    const nftAddr = await nftAddrDeployment.address;
    // 5. 部署NFTPoolLockAndRelease合约
    await deploy("NFTPoolLockAndRelease",{
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        log:true,
        //需要传入的参数: address _router, address _link, address nftAddr
        args:[sourceChainRouter,linkTokenAddr,nftAddr]
    });

    log("NFTPoolLockAndRelease contract deployed successfully");

}

module.exports.tags = ["SourceChain","all"];