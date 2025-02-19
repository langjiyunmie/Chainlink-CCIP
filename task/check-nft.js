//引入task工具
const {task} = require("hardhat/config")


task("check-nft").setAction(async(taskArgs,hre)=>{
    const {firstAccount } = (await getNamedAccounts()).firstAccount;
    const nft = await hre.ethers.getContract("MyNFT",firstAccount)

    const totalSupply = await nft.totalSupply()

    console.log("check-nft status:")
    for(let tokenId=0; tokenId< totalSupply; tokenId++){
       const owner = await nft.ownerOf(tokenId)
       console.log(`tokenId:${tokenId},owner:${owner}`)
    }
   
})

module.exports = {}