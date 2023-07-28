const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const [owner, user] = await ethers.getSigners();
  console.log("owner", owner.address)
  /*
    DeployContract in ethers.js is an abstraction used to deploy new smart contracts,
    so WebPOVProtocolContract here is a factory for instances of our Waitlist contract.
    */
  // here we deploy the contract
  const WebPOVProtocolContract = await hre.ethers.deployContract("WebPOVProV0", []);
  // 10 is the Maximum number of waitlisted addresses allowed

  // wait for the contract to deploy
  await WebPOVProtocolContract.waitForDeployment();

  // print the address of the deployed contract
  console.log("Waitlist Contract Address:", WebPOVProtocolContract.target);

  // Sleep for 30 seconds while Etherscan indexes the new contract deployment
  await sleep(30 * 1000); // 30s = 30 * 1000 milliseconds

  // Verify the contract on etherscan
  await hre.run("verify:verify", {
    address: WebPOVProtocolContract.target,
    constructorArguments: [],
  });
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });