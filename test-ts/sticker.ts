const MAX_OF_UINT256 = web3.utils.toBN(2).pow(web3.utils.toBN(255));
const LiberSticker = artifacts.require("LiberSticker");

// Sticker tests
contract("LiberSticker", (accounts) => {
  const [operator, receiver] = accounts;
  const tokenId = 0;
  const txDetails: Truffle.TransactionDetails = {
    from: operator
  };
  it("should publish HELLO Sticker max of systems", async() =>{
    const instance = await LiberSticker.new(txDetails);
    const balance = await instance.balanceOf(operator, tokenId);
    assert.equal(
      balance.toString(),
      MAX_OF_UINT256.toString(),
      "HELLO sticker published in the first account"
    );
  });

  /* todo: additional publish token test
  it("should publish additionaly Sticker max of systems", async() =>{
    const instance = await LiberSticker.new(txDetails);
    const amountOfToken = 100000000;
    const publishedTokenId = (await instance.publishNewSticker())
      .logs
      .filter((log)=>log.event === "PublishToken")
      .reduce((accm, log)=>{
        if ('tokenId' in log.args) {
          return log.args.tokenId.toString();
        }
        return accm;
      }, '');
    const transferedTokenId = (await instance.safeTransferFrom(
      operator,
      receiver,
      publishedTokenId,
      amountOfToken,
      "0x"
    )).logs
      .filter((log)=>log.event === "TransferSingle")
      .reduce((accm, log)=>{
        if ('id' in log.args) {
          return log.args.id.toString();
        }
        return accm;
      }, '');

    const amountOfAdditionalToken = (await instance.publishSticker(transferedTokenId))
      .logs
      .map((log)=>{
        console.log(log.args);
        return log;
      })
      .filter((log)=>log.event === "PublishToken")
      .reduce((accm, log)=>{
        if ('amount' in log.args) {
          return log.args.amount.toString();
        }
        return accm;
      }, '');
    const balance = await instance.balanceOf(operator, transferedTokenId);
    console.log('debug', transferedTokenId, balance.toString());
    console.log('amount', amountOfToken, amountOfAdditionalToken);
  });
  */

  it("should send a sticker", async() => {
    const instance = await LiberSticker.new(txDetails);
    const transferEvent = await instance.safeTransferFrom(operator, receiver, tokenId, 1, "0x", txDetails);
    const targetEventLogs = transferEvent.logs.filter((log)=>log.event === "TransferSingle");
    const receivers = targetEventLogs.reduce((accm: string[], log) => {
      if ('to' in log.args) {
        accm.push(log.args.to);
      }
      return accm;
    }, []);
    const balances = await instance.balanceOfBatch(
      receivers,
      Array(receivers.length).fill(tokenId)
    );
    balances.forEach((balance)=>{
      assert.equal(
        balance.toString(),
        "1",
        "Receiver have a Sticker"
      );
    })
  });

  it("should be owner of first token", async() => {
    const instance = await LiberSticker.new(txDetails);
    const publisher = await instance.getPublisher(tokenId);
    assert.equal(
      publisher,
      operator,
      "Publisher is operator"
    );
  });
});