// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CardNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    address public mainContract;

    modifier onlyMainContract() {
        require(msg.sender == mainContract, "CardNFT: Caller is not the Main contract");
        _;
    }

    constructor(address _mainContract) ERC721("PokemonCard", "PKMN") {
        mainContract = _mainContract;
    }

    function mint(address to, string memory uri) external onlyMainContract returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }
}
