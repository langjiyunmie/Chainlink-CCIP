# Chainlink CCIP NFT Cross-Chain

在 source chain 部署合约：npx hardhat deploy --tags sourcechain --network sepolia，如果你在上一步使用的不是 sepolia 和 amoy，那么请相应调整 network 名字

在 dest chain 部署合约：npx hardhat deploy --tags destchain --network amoy 如果你在上一步使用的不是 sepolia 和 amoy，那么请相应调整 network 名字

铸造 nft：npx hardhat mint-nft --network sepolia

查看 nft 状态：npx hardhat check-nft --network sepolia

锁定并且跨链 nft：npx hardhat lock-and-cross --tokenid 0 --network sepolia

查看 wrapped NFT 状态：npx hardhat check-wrapped-nft --tokenid 0 --network amoy

燃烧并且跨链 wnft：npx hardhat burn-and-cross --tokenid 0 --network amoy

再次查看 nft 状态：npx hardhat check-nft --network sepolia
