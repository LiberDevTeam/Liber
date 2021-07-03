const Migrations = artifacts.require('Migrations');
const LiberSticker = artifacts.require('LiberSticker');
const LiberMarket = artifacts.require('LiberMarket');

module.exports = async function (deployer: Truffle.Deployer) {
  // Use deployer to state migration tasks.
  await deployer.deploy(LiberMarket);
  await deployer.deploy(LiberSticker, LiberMarket.address);
} as Truffle.Migration;
