const LiberSticker = artifacts.require('LiberSticker');

module.exports = function (deployer: Truffle.Deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(LiberSticker);
} as Truffle.Migration;
