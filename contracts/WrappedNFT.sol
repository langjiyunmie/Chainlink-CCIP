// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyNFT.sol";

contract WrappedNFT is MyNFT {
    constructor(string memory name, string memory symbol) 
        MyNFT(name, symbol)
    {}

    function ResetTokenId(address to, uint256 tokenId) public {
      _safeMint(to, tokenId);
    }
}
