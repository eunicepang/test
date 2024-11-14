const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");


  describe("NftMinter", function () {
    
    async function deploy() {
        const LONDON_NFT = "https://arweave.net/nCyS_voplJ1_B5R8AW78BkFimDPgCOpIrzQIgdb_wDY";
        const DUBAI_NFT = "https://arweave.net/K6Q3pDsc-QaOsUD49dnyh5ECvEMvN8Oz2motfU9-w-0";
        const LA_NFT = 'https://arweave.net/IXM_CMPJ9U4GUj_nBND_2nyevId-BjNz4GUWcuw3nU0';
  
        const nextTokenId = 1;
  
      const [owner, otherAccount] = await ethers.getSigners();
  
      const NftMinter = await ethers.getContractFactory("NftMinter");
      const nftMinter = await NftMinter.deploy();
  
      return { nftMinter, owner, otherAccount, nextTokenId, LONDON_NFT, DUBAI_NFT, LA_NFT };
    }
  
    describe("Deployment", function () {
      it("Variables are correctly set", async function () {
        const { nftMinter, nextTokenId } = await loadFixture(deploy);
  
        expect(await nftMinter.nextTokenId()).to.equal(nextTokenId);
      });

    });
  
    describe("SafeMint", function () {
        it("Should create an NFT struct and add to the MintedNfts array", async function () {
          const { nftMinter, otherAccount, LONDON_NFT } = await loadFixture(deploy);
  
          await nftMinter.safeMint(otherAccount, LONDON_NFT);

          const nft = await nftMinter.getNft(0);
  
          expect(nft[0]).to.equal(otherAccount.address);
          expect(nft[1]).to.equal(1);
          expect(nft[2]).to.equal(LONDON_NFT);
        });

    });

    describe("getTotalNftCount", function () {
        it("Should return the total nft count", async function () {
          const { nftMinter, otherAccount, LONDON_NFT } = await loadFixture(deploy);
  
          await nftMinter.safeMint(otherAccount, LONDON_NFT);
  
          expect(await nftMinter.getTotalNftCount()).to.equal(1);
        
        });

    });

    /*
    describe("getNft", function () {
      it("Should return nft details given nft id", async function () {
        const { nftMinter, otherAccount, LONDON_NFT } = await loadFixture(deploy);

        await nftMinter.safeMint(otherAccount, LONDON_NFT);

        const nft = await nftMinter.getNft(0);

        expect(nft[0]).to.equal(otherAccount.address);
      
        });

    });
    */
  });
  