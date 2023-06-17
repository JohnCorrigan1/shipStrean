import { expect } from "chai";
import { ethers } from "hardhat";
import { ShipStream } from "../typechain-types";
// import { BigNumber } from "ethers";

describe("ShipStream", function () {
  // We define a fixture to reuse the same setup in every test.

  let shipStream: ShipStream;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const shipStreamFactory = await ethers.getContractFactory("ShipStream");
    shipStream = (await shipStreamFactory.deploy(owner.address)) as ShipStream;
    await shipStream.deployed();
  });

  describe("Deployment", function () {
    it("Should have 0 streams on deploy", async function () {
      expect(await shipStream.totalStreams()).to.equal(0);
    });

    it("should have 1 stream after creating", async function () {
      await shipStream.createStream(100000, 10000, "test stream", { value: ethers.utils.parseEther("1") });
      expect(await shipStream.totalStreams()).to.equal(1);
    });

    it("owner should have 1 eth balance in stream", async function () {
      const [owner] = await ethers.getSigners();
      expect(await shipStream.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1"));
    });

    it("owner should upload string and have .9eth balance in stream", async function () {
      const [owner] = await ethers.getSigners();
      await shipStream.uploadString("test", 0);
      expect(await shipStream.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("0.9"));
    });

    it("Should not be able to upload another string", async function () {
      const [owner] = await ethers.getSigners();
      await expect(shipStream.uploadString("test", 0)).to.be.revertedWith("not ok");
      expect(await shipStream.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("0.9"));
    });

    it("Should not be able to close stream", async function () {
      const [owner] = await ethers.getSigners();
      await expect(shipStream.closeStream(owner.address, 0)).to.be.revertedWith("Stream still open");
    });

    it("Should not be able to upload after waiting for half frequency", async function () {
      await ethers.provider.send("evm_increaseTime", [5000]);
      await ethers.provider.send("evm_mine", []);
      await expect(shipStream.uploadString("test", 0)).to.be.revertedWith("not missed");
    });

    it("Should allow upload after waiting for frequency", async function () {
      // const [owner] = await ethers.getSigners();
      await ethers.provider.send("evm_increaseTime", [10000]);
      await ethers.provider.send("evm_mine", []);
      // await shipStream.uploadString("test", 0);
      // expect(await shipStream.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("0.8"));
      // expect(await shipStream.missed(owner.address, 0)).to.equal(ethers.BigNumber.from(1));
      // expect(await shipStream.getTimestamp(owner.address, 0)).to.equal(1500);
    });

    // it("Should not allow another upload after waiting for half frequency", async function () {
    //   const [owner] = await ethers.getSigners();
    //   await ethers.provider.send("evm_increaseTime", [5000]);
    //   await ethers.provider.send("evm_mine", []);
    //   await expect(shipStream.uploadString("test", 0)).to.be.revertedWith("Stream not open yet");
    //   expect(await shipStream.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("0.8"));
    // });

    // it("Should allow the stream to be closed after missing a uplaod", async function () {
    //   const [owner] = await ethers.getSigners();
    //   await ethers.provider.send("evm_increaseTime", [20000]);
    //   await ethers.provider.send("evm_mine", []);
    //   await shipStream.closeStream(owner.address, 0);
    //   expect(await shipStream.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("0"));
    // });

    // it("owner and contract should have 0 open streams", async function () {
    //   const [owner] = await ethers.getSigners();
    //   expect(await shipStream.totalStreams()).to.equal(0);
    //   expect(await shipStream.numStreams(owner.address)).to.equal(0);
    // });

    // it("Should allow owner to create another stream", async function () {
    //   const [owner] = await ethers.getSigners();
    //   await shipStream.createStream(10000, 1000, "test stream", { value: ethers.utils.parseEther("1") });
    //   expect(await shipStream.totalStreams()).to.equal(1);
    //   expect(await shipStream.numStreams(owner.address)).to.equal(1);
    // });

    // it("Should allow owner to create another stream", async function () {
    //   const [owner] = await ethers.getSigners();
    //   await shipStream.createStream(10000, 1000, "test stream", { value: ethers.utils.parseEther("1") });
    //   expect(await shipStream.totalStreams()).to.equal(2);
    //   expect(await shipStream.numStreams(owner.address)).to.equal(2);
    // });

    // it("Should allow owner to upload to 1st stream", async function () {
    //   const [owner] = await ethers.getSigners();
    //   await shipStream.uploadString("test", 0);
    //   expect(await shipStream.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1.9"));
    // });

    // it("Should allow owner to upload to 2nd stream", async function () {
    //   const [owner] = await ethers.getSigners();
    //   await shipStream.uploadString("test", 1);
    //   expect(await shipStream.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1.8"));
    //   expect(await shipStream.streamedOf(owner.address, 1)).to.equal(1);
    // });
  });
});
