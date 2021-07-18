// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract LiberSticker is ERC1155PresetMinterPauser {
    bytes32 public constant BANNED_ROLE = keccak256("banned");
    string private constant SALT = "liberstickertoken";
    uint256 private _newTokenId = 0;
    address private marketAddress;

    // token publish event
    event PublishToken(address indexed owner, uint256 indexed tokenId, uint256 amount);
    // token buying request event
    event TokenPurdchaseRequest(address indexed buyer, uint256 indexed tokenId);

    modifier notBanned() {
        address operator = msg.sender;
        require(
            !hasRole(BANNED_ROLE, operator),
            "Operater is banned"
        );
        _;
    }

    // todo: change template uri to production
    constructor(address market) ERC1155PresetMinterPauser("https://jsonplaceholder.typicode.com/posts/{id}"){
        marketAddress = market;
        _setupRole(DEFAULT_ADMIN_ROLE, marketAddress);
        _setupRole(PAUSER_ROLE, marketAddress);
    }

    // get sticker publisher
    function getPublisher(uint256 id) public view returns (address) {
        bytes32 role = _generateRoleName(id);
        uint256 roleMemberCount = getRoleMemberCount(role);
        return getRoleMember(role, roleMemberCount);
    }

    // publish sticker Token up to amount of 2**255
    function publishSticker(uint256 id) public notBanned {
        address operator = msg.sender;
        uint256 amount = 2**255 - balanceOf(operator, id);

        require(
            operator != address(0),
            "Operater is zero address"
        );
        require(
            hasRole(_generateRoleName(id), operator),
            "You are not this token publisher"
        );
        require(
            0 < amount,
            "Token have been published max of amount"
        );

        _mint(operator, id, amount, "");
        emit PublishToken(operator, id, amount);
    }

    // publish new sticker Token
    function publishNewSticker() public notBanned {
        address operator = msg.sender;
        uint256 id = _newTokenId; // numbering tokenId
        bytes32 role = _generateRoleName(id);
        require(
            getRoleMemberCount(role) <= 0,
            "Only grant token publish role for non published token"
        );
        grantRole(MINTER_ROLE, operator);
        grantRole(role, operator);
        publishSticker(id);
        _newTokenId++; // increment tokenId
    }

    // approve for market
    function setApprovalForMarket(bool approved) public {
        setApprovalForAll(marketAddress, approved);
    }

    function _generateRoleName(uint256 id) private pure returns(bytes32) {
        bytes memory temp = new bytes(id);
        bytes memory saltBytes = bytes(SALT);
        for(uint256 i = 0; i < temp.length; i++) {
            if(i < saltBytes.length) {
                temp[i] = saltBytes[i];
            }
        }
        return keccak256(temp);
    }
}
