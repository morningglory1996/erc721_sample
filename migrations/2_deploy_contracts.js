const Color = artifacts.require("Color");
const ColorExchange = artifacts.require("ColorExchange");

module.exports = async function (deployer) {
  await deployer.deploy(Color);
  const color = await Color.deployed();

  await deployer.deploy(ColorExchange, color.address);
};