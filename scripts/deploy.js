const hre = require("hardhat");
async function main() {

  const NftMinter = await hre.ethers.getContractFactory("NftMinter");
  const nftMinter = await NftMinter.deploy();
  await nftMinter.waitForDeployment();

  console.log("NFT minting contract deployed: ", await nftMinter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});