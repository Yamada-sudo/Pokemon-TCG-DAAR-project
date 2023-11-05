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
    function setMaxCardCount(uint256 _newMaxCardCount) external {
        require(_newMaxCardCount > cardCount, "New max card count should be greater than current card count");
        maxCardCount = _newMaxCardCount;
    }
    
    /*
        // Fonction pour retirer une carte de l'utilisateur
    function removeCard(address user, uint256 tokenId) external {
        require(cards[tokenId], "Card does not exist in collection");
        require(isCardOwnedByUser(user, tokenId), "User does not own this card");

        // Retirer la carte de l'utilisateur
        uint256 cardIndex = findCardIndex(userCards[user], tokenId);
        require(cardIndex < userCards[user].length, "Card index out of bounds");

        // Supprimer la carte en remplaçant l'élément à supprimer par le dernier élément du tableau
        userCards[user][cardIndex] = userCards[user][userCards[user].length - 1];
        userCards[user].pop();

        // Mettre à jour l'état des cartes
        cards[tokenId] = false;
        cardCount--;
    }

    // Fonction helper pour trouver l'index de la carte dans le tableau de l'utilisateur
    function findCardIndex(uint256[] storage cardArray, uint256 tokenId) private view returns (uint256) {
        for (uint256 i = 0; i < cardArray.length; i++) {
            if (cardArray[i] == tokenId) {
                return i;
            }
        }
        revert("Card not found");
    }

    // Fonction helper pour vérifier si l'utilisateur possède la carte
    function isCardOwnedByUser(address user, uint256 tokenId) private view returns (bool) {
        uint256[] memory userCardArray = userCards[user];
        for (uint256 i = 0; i < userCardArray.length; i++) {
            if (userCardArray[i] == tokenId) {
                return true;
            }
        }
        return false;
    }
    
    */
}
