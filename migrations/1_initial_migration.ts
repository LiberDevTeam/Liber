const Migrations = artifacts.require("Migrations");

module.exports = (deployer: Truffle.Deployer) => {
  deployer.deploy(Migrations);
};
