// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CardNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    address public mainContract;
    mapping(address => uint256[]) public tokensOfOwner;
    mapping(uint256 => string) public cardId; // Mapping pour l'ID de la carte en string.

    modifier onlyMainContract() {
        require(msg.sender == mainContract, "CardNFT: Caller is not the Main contract");
        _;
    }

    constructor(address _mainContract) ERC721("PokemonCard", "PKMN") {
        mainContract = _mainContract;
    }

    function mint(address to, string memory cardIdStr, string memory uri) external onlyMainContract returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        cardId[tokenId] = cardIdStr; // Stocker l'ID de la carte en string.
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        tokensOfOwner[to].push(tokenId);
        return tokenId;
    }

    function getTokensOf(address owner) external view returns (uint256[] memory) {
        return tokensOfOwner[owner];
    }
    function getCardIdsOf(address owner) external view returns (string[] memory) {
    uint256[] memory tokenIds = tokensOfOwner[owner];
    string[] memory cardIds = new string[](tokenIds.length);
    
    for (uint256 i = 0; i < tokenIds.length; i++) {
        cardIds[i] = cardId[tokenIds[i]];
    }

    return cardIds;
    }

    function getOwnerOfToken(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }
}
