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
        collection.addCard(user, tokenId);
    }

    function getCollectionAddress(uint256 collectionId) public view returns (address) {
        return address(collections[collectionId]);
    }

    function getAllCollectionIds() public view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](_collectionIdCounter.current());
        for (uint256 i = 1; i <= _collectionIdCounter.current(); i++) {
           ids[i-1] = i;
        }
        return ids;
    }

    function getCardsOfUserInCollection(address user, uint256 collectionId) public view returns (uint256[] memory) {
        Collection collection = collections[collectionId];
        return collection.getUserCards(user);
    }

    function getAllCardsOfUser(address user) public view returns (uint256[][] memory) {
        uint256[] memory collectionIds = getAllCollectionIds();
        uint256[][] memory allCards = new uint256[][](collectionIds.length);
        for (uint256 i = 0; i < collectionIds.length; i++) {
            allCards[i] = getCardsOfUserInCollection(user, collectionIds[i]);
        }
        return allCards;
    }

    function getCardOfUser(address user, uint256 tokenId) public view returns (uint256) {
        require(cardNFT.ownerOf(tokenId) == user, "This card doesn't belong to the user");
        return tokenId;
    }
}
