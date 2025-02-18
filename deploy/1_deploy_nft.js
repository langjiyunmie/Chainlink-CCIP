const {getNamedAccounts} = require("hardhat");
const {network} = require("hardhat");

module.exports = async({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    log("Deploying MyNFT contract...");

    await deploy("MyNFT",{
        from: firstAccount,
        args:["MyNFT","MT"],//传入构造函数的参数
        log:true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("MyNFT contract deployed successfully");

}

module.exports.tags = ["SourceChain","all"];