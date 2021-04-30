// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract LiberSticker is ERC1155PresetMinterPauser {
    uint256 private _newTokenId = 0;
    address private marketAddress;
    mapping(uint256=>address) private _tokenPublishers; // token_id to owner address map

    // token publish event
    event PublishToken(address indexed owner, uint256 indexed tokenId, uint256 amount);
    // token buying request event
    event TokenPurdchaseRequest(address indexed buyer, uint256 indexed tokenId);

    // todo: change template uri to production
    constructor() ERC1155PresetMinterPauser("https://jsonplaceholder.typicode.com/posts/{id}") {
        //marketAddress = contractAddress;
        // todo: default sticker minting
        publishNewSticker();
    }

    // get sticker publisher
    function getPublisher(uint256 id) public view returns (address) {
        return _tokenPublishers[id];
    }

    // publish sticker Token base function
    function publishSticker(uint256 id) public {
        address operator = msg.sender;
        uint256 tokenId;
        if(id == 0) {
            tokenId = _newTokenId;
            _newTokenId++; // increment tokenId
        }
        uint256 amount = 2**255 - super.balanceOf(operator ,tokenId);

        require(
            operator != address(0),
            "Operater is zero address"
        );
        require(
            0 < amount,
            "Token have been published max of amount"
        );
        require(
            _tokenPublishers[tokenId] == address(0) || _tokenPublishers[tokenId] == operator,
            "Token has already published, and you are not this token publisher"
        );

        super._mint(operator, tokenId, amount, "");
        _tokenPublishers[tokenId] = operator;
        emit PublishToken(operator, tokenId, amount);
    }

    // publish sticker Token, amount of 2**255
    function publishNewSticker() public {
        publishSticker(0);
    }
}
