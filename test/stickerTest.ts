const LiberSticker = artifacts.require("LiberSticker");

const MAX_OF_UINT256 = 2**256;

contract("LiberSticker", accounts => {
  it("HELLO Sticker is published max of systems", () =>
    LiberSticker.deployed()
      .then(instance => instance.balanceOf(accounts[0], 1))
      .then(balance => {
        assert.equal(
          balance.valueOf(),
          MAX_OF_UINT256,
          "HELLO sticker published in the first account"
        );
      }));
});