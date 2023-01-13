const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("ERC721");
  const token = await Token.deploy("My Token", "MTK");

  await token.deployed();
  console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
