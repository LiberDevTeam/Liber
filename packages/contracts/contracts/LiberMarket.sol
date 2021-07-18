// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract LiberMarket is AccessControlEnumerable, PullPayment, ReentrancyGuard, Pausable {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant BANNED_ROLE = keccak256("BANNED_ROLE");
  struct MarketItem {
    ERC1155 token;
    uint256 tokenId;
    address listedOwner;
    uint256 price;
    bool isSale;
  }
  MarketItem[] private _marketItems; // token_id to price struct
  mapping(address=>uint256[]) private itemsByPublsiher; // token_id to owner address map

  constructor() AccessControlEnumerable() PullPayment() ReentrancyGuard() Pausable() {
    address operator = msg.sender;
    _setupRole(DEFAULT_ADMIN_ROLE, operator);
    _setupRole(PAUSER_ROLE, operator);
  }

  // token publish event
  event ListItem(uint256 indexed itemId, address indexed listedOwner, uint256 price);
  event UnListItem(uint256 indexed itemId);

  modifier notBanned() {
    address operator = msg.sender;
    require(
      !hasRole(BANNED_ROLE, operator),
      "Operater is banned"
    );
    _;
  }

  modifier onlyPauser() {
    address operator = msg.sender;
    require(
      hasRole(PAUSER_ROLE, operator),
      "Operater is not allowed pause"
    );
    _;
  }

  // pause market
  function pause() public whenNotPaused onlyPauser {
    _pause();
  }

  // unpause market
  function unPause() public whenPaused onlyPauser {
    _unpause();
  }

  // list the sticker on the market
  function listToken(ERC1155 token, uint256 tokenId, uint256 price, bool isSale) public whenNotPaused notBanned {
    address listedOwner = msg.sender;
    address market = address(this);
    uint256 amount = token.balanceOf(listedOwner, tokenId);

    require(
      token.isApprovedForAll(listedOwner, market),
      "Publisher must approve that contract operate"
    );
    require(
      1 < amount,
      "Operator has not own token to list"
    );

    _marketItems.push(MarketItem(token, tokenId, listedOwner, price, isSale));
    uint256 itemId = _marketItems.length - 1;
    itemsByPublsiher[listedOwner].push(itemId);
    if(isSale) {
      emit ListItem(itemId, listedOwner, price);
    }
  }

  // unlist the sticker from the market
  function unlistToken(uint256 id) public {
    address listedOwner = msg.sender;
    MarketItem memory item = _marketItems[id];

    require(
      item.listedOwner == listedOwner,
      "This token has not listed"
    );

    _marketItems[id] = MarketItem(item.token, 0, address(0), 0, false);
    emit UnListItem(id);
  }

  // buy token
  function buyToken(uint256 id, uint256 tip) public payable whenNotPaused notBanned nonReentrant {
    address market = address(this);
    address buyer = msg.sender;
    uint256 receiveEther = msg.value;
    MarketItem memory item = _marketItems[id];
    ERC1155 token = item.token;
    uint256 price = item.price + tip;
    uint256 amount = token.balanceOf(buyer, item.tokenId);
    require(
      receiveEther == price,
      "Not enough Ether, or too much Ether"
    );
    require(
      amount <= 0,
      "Buyer can only have one token"
    );
    _asyncTransfer(item.listedOwner, price);
    item.token.safeTransferFrom(market, buyer, item.tokenId, 1, "");
  }

  // set sale flag
  function setSale(uint256 id, bool isSale) public {
    address listedOwner = msg.sender;

    require(
      _marketItems[id].listedOwner == listedOwner,
      "Operater is not listedOwner"
    );

    _marketItems[id].isSale = isSale;
  }

  // set price
  function setPrice(uint256 id, uint256 price) public {
    address listedOwner = msg.sender;

    require(
      _marketItems[id].listedOwner == listedOwner,
      "Operater is not listedOwner"
    );

    _marketItems[id].price = price;
  }

  function getDetailByItemId(uint256 id) public view returns (
    address,
    uint256,
    uint256,
    uint256,
    bool
  ) {
    ERC1155 token = _marketItems[id].token;
    address listedOwner = _marketItems[id].listedOwner;
    uint256 tokenId = _marketItems[id].tokenId;
    uint256 amount = token.balanceOf(listedOwner, tokenId);
    return (
      listedOwner,
      tokenId,
      _marketItems[id].price,
      amount,
      _marketItems[id].isSale
    );
  }
}