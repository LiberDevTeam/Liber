// contracts/Liber.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract LiberMarket {
    mapping(uint256=>uint256) private marketItems; // token_id to price struct
}

contract LiberSticker is ERC1155PresetMinterPauser {
    uint256 public constant HELLO = 0;

    constructor() ERC1155PresetMinterPauser("https://jsonplaceholder.typicode.com/posts/{id}") {
        // todo: default sticker minting
        publishSticker(HELLO);
    }

    // publish sticker Token, amount of 2**255
    function publishSticker(uint256 id) public {
        _mint(msg.sender, id, 2**255, "");
    }
}