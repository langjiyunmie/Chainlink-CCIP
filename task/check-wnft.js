const { task } = require("hardhat/config")

task("check-wrapped-nft")
    .addParam("tokenid", "tokenid to check")
    .setAction(async(taskArgs, hre) => {
    const tokenId = taskArgs.tokenid
    const {firstAccount} = await getNamedAccounts()
    const wnft = await ethers.getContract("WrappedNFT", firstAccount)

    console.log("checking status of ERC-721")
    const totalSupply = await wnft.totalSupply()
    console.log(`there are ${totalSupply} tokens under the collection`)
    const owner = await wnft.ownerOf(tokenId)
    console.log(`TokenId: ${tokenId}, Owner is ${owner}`)

})

module.exports = {}