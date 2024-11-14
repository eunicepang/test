// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftMinter is ERC721 {
    uint256 public nextTokenId;

    struct Nft {
        address owner;
        uint256 tokenId;
        string tokenUri;
    }

    Nft[] public MintedNfts;

    constructor() ERC721("MyToken", "MTK") {
        nextTokenId = 1;
    }

    function safeMint(address _to, string memory _uri) public {
        uint256 newTokenId = nextTokenId;
        _safeMint(_to, newTokenId);
        Nft memory newNft = Nft({owner: _to, tokenId: newTokenId, tokenUri: _uri});
        MintedNfts.push(newNft);
        nextTokenId++;
    }

    function getTotalNftCount() public view returns(uint256) {
        return (nextTokenId-1);
    }

    function getNft(uint256 _id) public view returns(address, uint256, string memory) {
        require(_id < MintedNfts.length, "NFT does not exist!");
        Nft memory nft = MintedNfts[_id];
        return(nft.owner, nft.tokenId, nft.tokenUri);
    }


}