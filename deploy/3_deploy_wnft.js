const {getNamedAccounts,deployments} = require("hardhat");

module.exports = async({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    log("Deploying WNFT contract...");

    await deploy("WrappedNFT",{
        contract:"WrappedNFT",
        from:firstAccount,
        log:true,
        args:["WrappedNFT","WMT"]
    })

    log("WrappedNFT contract deployed successfully");


}

module.exports.tags = ["destChain","all"];