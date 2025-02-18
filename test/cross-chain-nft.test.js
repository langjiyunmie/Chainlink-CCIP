//变量准备
const {getNamedAccounts,deployments, ethers} = require("hardhat");
const {expect} = require("chai");

let firstAccount;
let ccipSimulator;
let nft;
let wnft;
let NFTPoolLockAndRelease;
let NFTPoolBurnAndMint;
let chainSelector;

before(async function () {
    firstAccount = (await getNamedAccounts()).firstAccount;
    // 部署所有带 "all" 标签的合约并创建快照
    await deployments.fixture(["all"]);
    ccipSimulator = await ethers.getContract("CCIPLocalSimulator",firstAccount);
    nft = await ethers.getContract("MyNFT",firstAccount);
    wnft = await ethers.getContract("WrappedNFT",firstAccount);
    NFTPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease",firstAccount);
    NFTPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint",firstAccount);
    chainSelector = (await ccipSimulator.configuration()).chainSelector_;
})

describe("source chain --> dest chain",
    async function () {
            it("mint nft and test the owner is minter",
                async function () {
                    // get nft 
                    await nft.safeMint(firstAccount);
                    const ownerOfNft = await nft.ownerOf(0);
                    expect(ownerOfNft).to.equal(firstAccount);
                    console.log("owner address is",firstAccount);
                }
            )
            
            it("transfer NFT from source chain to dest chain, check if the nft is locked",
                async function() {
                    await ccipSimulator.requestLinkFromFaucet(NFTPoolLockAndRelease.target, ethers.parseEther("10"))
    
                    
                    // lock and send with CCIP
                    await nft.approve(NFTPoolLockAndRelease.target, 0)
                    await NFTPoolLockAndRelease.lockAndSendNFT(0, firstAccount, chainSelector, NFTPoolBurnAndMint.target)
                    
                    // check if owner of nft is pool's address
                    const newOwner = await nft.ownerOf(0)
                    console.log("test")
                    expect(newOwner).to.equal(NFTPoolLockAndRelease.target)
                    // check if the nft is locked
                    const isLocked = await NFTPoolLockAndRelease.tokenLocked(0)
                    expect(isLocked).to.equal(true)
                }
            )
            it("check if the nft is minted on dest chain",
                async function() {
                    const ownerOfNft = await wnft.ownerOf(0)
                    expect(ownerOfNft).to.equal(firstAccount)
                }
            )
})

describe("dest chain --> source chain",
    async function () {
        it("burn nft and check the nft owner is firstAccount",
            async function() {
                await wnft.approve(NFTPoolBurnAndMint.target,0)
                await NFTPoolBurnAndMint.BurnAndReturn(0, firstAccount, chainSelector, NFTPoolLockAndRelease.target)
                const ownerOfNft = await nft.ownerOf(0)
                expect(ownerOfNft).to.equal(firstAccount)
            }
        )
    }
)