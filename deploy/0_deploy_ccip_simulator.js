const {getNamedAccounts,deployments, network} = require("hardhat");
const {ethers} = require("hardhat");
const {developmentChains} = require("../helper-hardhat-config.js")


module.exports = async({getNamedAccounts,deployments}) => {
    if(developmentChains.includes(network.name)){
        const {firstAccount} = await getNamedAccounts();
        const {deploy,log} = deployments;
    
        log("Deploying CCIP Simulator...");
    
        const ccipSimulator = await deploy("CCIPLocalSimulator",{
            contract: "CCIPLocalSimulator",
            from: firstAccount,
            log:true,
            args:[]
        });
    }
}

module.exports.tags = ["testlocal","all"];