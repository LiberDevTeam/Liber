// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract LiberSticker is ERC1155PresetMinterPauser {
    uint256 public constant YO = 0;

    constructor() ERC1155PresetMinterPauser("https://jsonplaceholder.typicode.com/posts/{id}") {
        // todo: default sticker minting
        publishSticker(YO);
    }

    // publish sticker Token, amount of 2**255
    function publishSticker(uint256 id) public {
        _mint(msg.sender, id, 2**255, "");
    }
}
