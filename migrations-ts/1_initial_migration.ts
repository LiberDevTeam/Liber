const Migrations = artifacts.require('Migrations');

module.exports = function (deployer: Truffle.Deployer) {
  deployer.deploy(Migrations);
} as Truffle.Migration;

export {};
