import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const mockMUSD = await ethers.deployContract("MockMUSD");
  await mockMUSD.waitForDeployment();
  console.log("MockMUSD deployed to:", await mockMUSD.getAddress());

  const mockMEZO = await ethers.deployContract("MockMEZO");
  await mockMEZO.waitForDeployment();
  console.log("MockMEZO deployed to:", await mockMEZO.getAddress());

  const mockOracle = await ethers.deployContract("MockOracle", [65000]); // $65,000 BTC
  await mockOracle.waitForDeployment();
  console.log("MockOracle deployed to:", await mockOracle.getAddress());

  const mezoTreasury = await ethers.deployContract("MezoTreasury", [await mockMUSD.getAddress(), await mockOracle.getAddress()]);
  await mezoTreasury.waitForDeployment();
  console.log("MezoTreasury deployed to:", await mezoTreasury.getAddress());

  const invoiceManager = await ethers.deployContract("InvoiceManager", [await mockMUSD.getAddress()]);
  await invoiceManager.waitForDeployment();
  console.log("InvoiceManager deployed to:", await invoiceManager.getAddress());

  const recurringPayments = await ethers.deployContract("RecurringPayments", [await mockMUSD.getAddress()]);
  await recurringPayments.waitForDeployment();
  console.log("RecurringPayments deployed to:", await recurringPayments.getAddress());

  const mezoUtilityTier = await ethers.deployContract("MezoUtilityTier", [await mockMEZO.getAddress()]);
  await mezoUtilityTier.waitForDeployment();
  console.log("MezoUtilityTier deployed to:", await mezoUtilityTier.getAddress());

  // Transfer ownership of MockMUSD to Treasury so it can mint
  await mockMUSD.transferOwnership(await mezoTreasury.getAddress());
  console.log("Transferred MockMUSD ownership to MezoTreasury");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
