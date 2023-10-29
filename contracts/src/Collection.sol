// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Collection {
    string public name;
    uint256 public cardCount;
    uint256 public maxCardCount;
    mapping(uint256 => bool) public cards;
    mapping(address => uint256[]) public userCards;
    constructor(string memory _name, uint256 _maxCardCount) {
        name = _name;
        maxCardCount = _maxCardCount;
        cardCount = 0;
    }



function addCard(address user, uint256 tokenId) external {
    require(cardCount < maxCardCount, "Collection is full");
    userCards[user].push(tokenId);
    cards[tokenId] = true;
    cardCount++;
}

function getUserCards(address user) public view returns (uint256[] memory) {
    return userCards[user];
}

    
}
