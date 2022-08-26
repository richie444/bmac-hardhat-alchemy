const hre = require("hardhat");

// Helper Functions
// Returns Eth balance for an address
async function getEthBalance(address) {
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

// Logs Eth balance for a list of addresses
async function printEthBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    const balance = await getEthBalance(address);
    console.log(`${idx}:  ${address} has ${balance} ETH`);
    idx++;
  }
}

// Logs Memos stored on-chain
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const sender = memo.name;
    const senderAddress = memo.from;
    const message = memo.message;

    console.log(
      `At ${timestamp}: ${sender}(${senderAddress}) sent:"${message}"`
    );
  }
}

// Main Function
async function main() {
  // Get signer address to test with
  const [owner, sender1, sender2, sender3] = await hre.ethers.getSigners();
  // Deploy Contract
  const BMAC = await hre.ethers.getContractFactory("BMAC");
  const contract = await BMAC.deploy();

  await contract.deployed();
  console.log(`BMAC deployed to ${contract.address}`);

  // Check and Log initial balances
  console.log(`Owner balance: ${await getEthBalance(owner.address)}`);
  console.log(`BMAC balance: ${await getEthBalance(contract.address)}`);

  console.log("\n Checking initial balances.. \n");
  const addresses = [
    owner.address,
    sender1.address,
    sender2.address,
    sender3.address,
    contract.address,
  ];
  await printEthBalances(addresses);

  // Send some coffee
  const amount = { value: hre.ethers.utils.parseEther("100") };
  await contract.connect(sender1).buyCoffee("sender1", "Lorem", amount);
  await contract.connect(sender2).buyCoffee("sender2", "Ipsum", amount);
  await contract.connect(sender3).buyCoffee("sender3", "IDK", amount);

  // Check and Log balances after sending coffee
  console.log("\nChecking balances after sending coffee...\n");
  await printEthBalances(addresses);

  // Withdraw  funds from contract
  await contract.connect(owner).withdraw();

  // Check and Log final balances
  console.log("\nChecking final balances...\n");
  console.log(`Owner balance: ${await getEthBalance(owner.address)}`);
  console.log(`BMAC balance: ${await getEthBalance(contract.address)}`);

  // Check and Log memos
  console.log("\nChecking memos...\n");
  const memos = await contract.getMemos();
  await printMemos(memos);

  console.log(
    "\n --------------------------- The End --------------------------- \n"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
