const LiberSticker = artifacts.require('LiberSticker');
const LiberMarket = artifacts.require('LiberMarket');

module.exports = function (deployer: Truffle.Deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(LiberMarket);
  deployer.deploy(LiberSticker, LiberMarket.address);
} as Truffle.Migration;
