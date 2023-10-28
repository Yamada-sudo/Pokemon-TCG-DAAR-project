// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CardNFT.sol";
import "./Collection.sol";

contract Main is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _collectionIdCounter;
    CardNFT public cardNFT;
    mapping(uint256 => Collection) public collections;

    event CollectionCreated(uint256 collectionId, address collectionAddress);


    constructor() {
        cardNFT = new CardNFT(address(this));
    }

    // Fonction pour créer une collection
    function createCollection(string calldata _name, uint256 _maxCardCount) external onlyOwner {
        _collectionIdCounter.increment();
        uint256 collectionId = _collectionIdCounter.current();
        Collection newCollection = new Collection(_name, _maxCardCount);
        collections[collectionId] = newCollection;
        emit CollectionCreated(collectionId, address(newCollection));
    }

    function mintAndAssignCard(uint256 collectionId, address user, string calldata uri) external onlyOwner {
        Collection collection = collections[collectionId];
        require(address(collection) != address(0), "Collection does not exist");

        uint256 tokenId = cardNFT.mint(user, uri);
        collection.addCard(tokenId);
    }

    function getCollectionAddress(uint256 collectionId) public view returns (address) {
    return address(collections[collectionId]);
    }

}
