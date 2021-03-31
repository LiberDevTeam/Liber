// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract LiberMarket {
  mapping(uint256=>uint256) private marketItems; // token_id to price struct
  
  function sellSticker(uint256 id, uint256 price) public {
    marketItems[id] = price;
  }

  function getPriceByToken(uint256 id) public view returns(uint256) {
    return marketItems[id];
  }
}