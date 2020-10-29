const Color = artifacts.require("Color");
const ColorExchange = artifacts.require("ColorExchange");

const { expect, assert } = require("chai");

contract("contract", async (accounts) => {
  [alice, bob] = accounts;
  let contract;
  let exchange;

  before(async () => {
    contract = await Color.new();
    exchange = await ColorExchange.new(contract.address);
  })

  describe("deployment", async () => {

    it("has a name and symbol", async () => {
      let result;
      result = await contract.name();
      expect(result).to.be.equal("Color");
      result = await contract.symbol();
      expect(result).to.be.equal("COLOR");
    })
  })

  describe("minting", async () => {

    it("minting a new token", async () => {
      const result = await contract.mint("#EC058E");
      const totalSupply = await contract.totalSupply();
      expect(totalSupply.toString()).to.be.equal("1");
      const event = result.logs[0].args;
      expect(event.tokenId.toString()).to.be.equal("0");
      expect(event.from).to.be.equal("0x0000000000000000000000000000000000000000");
      expect(event.to).to.be.equal(alice);
      // 同じColorは発行不可
      try {
        await contract.mint("#EC058E");
        assert(true);
      } catch (error) {
        return;
      }
      assert(false, "The Contract did not throw");
    })
  })

  describe("indexing", async () => {
    
    it("lists colors", async () => {
      await contract.mint("#5386E4");
      await contract.mint("#FFFFFF");
      await contract.mint("#000000");
      const totalSupply = await contract.totalSupply();
      
      let color;
      let result = [];

      for (let i = 0; i < totalSupply; i++) {
        color = await contract.colors(i);
        result.push(color);
      }

      let expected = ["#EC058E", "#5386E4", "#FFFFFF", "#000000"];
      expect(result.join(".")).to.be.equal(expected.join("."));
    })
  })

  describe("transfer", async () => {

    it("transfer tokens", async () => {
      let result;

      await contract.setApprovalForAll(exchange.address, true);
      await exchange.buyTokens(0, { from: bob });
      // ownerがaliceからbobに変わっているかチェック
      result = await contract.ownerOf(0);
      expect(result).to.be.equal(bob);
    })
  })

})