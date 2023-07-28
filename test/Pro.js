const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("WebPOV Protocol V0", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const JOINING_FEE = "0.0003";

    // Contracts are deployed using the first signer/account by default
    const [owner, user] = await ethers.getSigners();
    const Lock = await ethers.getContractFactory("WebPOVProV1");
    const dao = await Lock.deploy();

    return { dao, JOINING_FEE, owner, user };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { dao, JOINING_FEE, owner, user } = await loadFixture(deployOneYearLockFixture);

      expect(await dao.owner()).to.equal(owner.address);
    });
    it("Should join the DAO correctly", async function () {
      const { dao, JOINING_FEE, owner, user } = await loadFixture(deployOneYearLockFixture);
      const joiningFee = ethers.parseEther(JOINING_FEE);
      const joinTx = await dao.connect(user).joinDAO({ value: joiningFee });
  
      // Check balance after joining
      const userBalance = await dao.balances(user.address);
      expect(userBalance).to.equal(joiningFee);
    });
  
    it("Should not join the DAO with insufficient fee", async function () {
      const { dao, JOINING_FEE, owner, user } = await loadFixture(deployOneYearLockFixture);
      const wrongJoiningFee = ethers.parseEther("0.0001");
      await expect(dao.connect(user).joinDAO({ value: wrongJoiningFee })).to.be.revertedWith(
        "Please send exactly 0.0003 ether."
      );
    });
  
    it("Should leave the DAO and withdraw funds correctly", async function () {
      const { dao, JOINING_FEE, owner, user } = await loadFixture(deployOneYearLockFixture);
      const joiningFee = ethers.parseEther(JOINING_FEE);
  
      // Join the DAO first
      await dao.connect(user).joinDAO({ value: joiningFee });
  
      // Leaving the DAO
        await expect(dao.connect(user).leaveDAO()).to.changeEtherBalances(
          [user, dao],
          [joiningFee, -joiningFee]
        );
    });
  
    it("Should not leave the DAO with insufficient balance", async function () {
      const { dao, JOINING_FEE, owner, user } = await loadFixture(deployOneYearLockFixture);
      await expect(dao.connect(user).leaveDAO()).to.be.revertedWith(
        "Insufficient balance to leave."
      );
    });
  
    it("Should allow the contract owner to withdraw all funds", async function () {
      const { dao, JOINING_FEE, owner, user } = await loadFixture(deployOneYearLockFixture);
      // console.log("123 dao.address", dao.target)
      const contractBalance = await ethers.provider.getBalance(dao.target)
      expect(contractBalance).to.equal(0);
  
      // Send some funds to the contract
      const amountToSend = ethers.parseEther("1.0");
      await expect(user.sendTransaction({ to: dao.target, value: amountToSend })).to.changeEtherBalances(
        [user, dao],
        [-amountToSend, amountToSend]
      );
      
      // Withdraw all funds by the contract owner
      await expect(dao.withdrawFunds()).to.changeEtherBalances(
        [dao, owner],
        [-amountToSend, amountToSend]
      );  
    }); 
  
  });

});
