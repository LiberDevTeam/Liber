const MAX_OF_UINT256 = web3.utils.toBN(2).pow(web3.utils.toBN(255)).toString();
const LiberSticker = artifacts.require("LiberSticker");

contract("LiberSticker", accounts => {
  it("HELLO Sticker is published max of systems", () =>
    LiberSticker.deployed()
      .then(instance => instance.balanceOf(accounts[0], 0))
      .then(balance => {
        assert.equal(
          balance.toString(),
          MAX_OF_UINT256,
          "HELLO sticker published in the first account"
        );
      }));
});