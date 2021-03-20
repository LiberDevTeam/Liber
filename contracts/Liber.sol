// contracts/Sticker.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Liber is ERC1155 {
    constructor() public ERC1155("https://jsonplaceholder.typicode.com/posts/{id}") {

    }
    function publishSticker(id: uint256) {
        _mint(msg.sender, id, 10**18, "");
    }
}