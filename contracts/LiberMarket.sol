// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract LiberMarket is Ownable, Pausable, PullPayment {
  struct MarketItem {
    ERC1155 token;
    uint256 tokenId;
    address publisher;
    uint256 price;
    bool isSale;
  }
  MarketItem[] private _marketItems; // token_id to price struct
  mapping(address=>uint256[]) private itemsByPublsiher; // token_id to owner address map

  constructor() Ownable(){
    emit Test(address(this));
  }

  // token publish event
  event ListToken(address indexed owner, uint256 indexed itemId);
  event Test(address adrs);

  // list the sticker on the market
  function listToken(ERC1155 token, uint256 tokenId, uint256 price, bool isSale) public {
    address publisher = msg.sender;
    address market = address(this);
    uint256 amount = token.balanceOf(publisher, tokenId);

    require(
      token.isApprovedForAll(publisher, market),
      "Publisher must approve that contract operate"
    );
    require(
      1 < amount,
      "Operator has not own token to list"
    );

    _marketItems.push(MarketItem(token, tokenId, publisher, price, isSale));
    uint256 itemId = _marketItems.length - 1;
    itemsByPublsiher[publisher].push(itemId);
    if(isSale) {
      emit ListToken(publisher, itemId);
    }
  }

/*
  // unlist the sticker from the market
  function unlistToken(uint256 id) public {
    address publisher = msg.sender;
    address market = address(this);
    uint256 amount = _tokenContract.balanceOf(market, id);

    require(
      _tokenContract.isApprovedForAll(market, publisher),
      "Market must approve that contract operate"
    );
    require(
      _tokenContract.getPublisher(id) == publisher,
      "Operator is not publisher"
    );
    require(
      marketItems[id].publisher == publisher,
      "This token has not listed"
    );

    _tokenContract.safeTransferFrom(market, publisher, id, amount, "");
    marketItems[id] = MarketItem(address(0), 0, false);
  }
  */

  // set sale flag
  function setSale(uint256 id, bool isSale) public {
    address publisher = msg.sender;

    require(
      _marketItems[id].publisher == publisher,
      "Operater is not publisher"
    );

    _marketItems[id].isSale = isSale;
  }

  // set price
  function setPrice(uint256 id, uint256 price) public {
    address publisher = msg.sender;

    require(
      _marketItems[id].publisher == publisher,
      "Operater is not publisher"
    );

    _marketItems[id].price = price;
  }

  function getPriceByToken(uint256 id) public view returns(uint256) {
    return _marketItems[id].price;
  }
}