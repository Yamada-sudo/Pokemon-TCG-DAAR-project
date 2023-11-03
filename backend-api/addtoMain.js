const { ethers } = require('ethers');
require('dotenv').config({ path: '../.env' });
console.log("DEPLOYED_MAIN_ADDRESS:", process.env.DEPLOYED_MAIN_ADDRESS);
console.log("API KEY:", process.env.API_KEY);
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration dotenv
require('dotenv').config();

// URL de votre API
const YOUR_API_BASE_URL = "http://localhost:3000";

// Configuration du fournisseur Ethereum
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

// Remplacez ceci par votre clé privée et l'adresse du contrat
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const contractAddress = process.env.DEPLOYED_MAIN_ADDRESS;
if (!contractAddress) {
    throw new Error('L’adresse du contrat n’est pas définie');
}

const wallet = new ethers.Wallet(privateKey, provider);

const contractJSON = require('../contracts/artifacts/src/Main.sol/Main.json');
const contractABI = contractJSON.abi;

const mainContract = new ethers.Contract(contractAddress, contractABI, wallet);

function createCollectionFile(collectionId,collectionName, cardCount) {
    const filePath = path.join(__dirname, './Collection', `${collectionName}.json`);
    const data = {
        id: collectionId,
        name: collectionName,
        cardCount: 0,
        maxCardCount: cardCount,
        cards: []
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
// Étape 4: Attribuer une adresse spécifique pour les 10 premières cartes de chaque set
const SPECIAL_ADDRESS = "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97";

// Étape 5: Mettre à jour le fichier .json de la collection
function updateCollectionFile(collectionName, card) {
    console.log('etape 5')
    const filePath = path.join(__dirname, './Collection', `${collectionName}.json`);
    const data = JSON.parse(fs.readFileSync(filePath));
    data.cards.push(card);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function main() {
    try {
        console.log('on commence');
        // Étape 1: Récupérer les informations des sets via VOTRE API
        const response = await axios.get(`${YOUR_API_BASE_URL}/select-sets`);
        const sets = response.data;
        console.log('Etape 1 Done');

        for (let set of sets) {
            const cardsResponse = await axios.get(`${YOUR_API_BASE_URL}/pokemon/sets/${set.id}`);
            const cards = cardsResponse.data;
    
            // Étape 2: Créer une collection pour chaque set
            await mainContract.createCollection(set.name, set.total); 
            console.log('Etape 2 Done');
            // Étape 3: Créer un fichier .json pour chaque collection
            createCollectionFile(set.id, set.name, set.total);
            console.log('Etape 3 Done');
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                console.log('card',card.name);
                // Étape 2 et 3: Ajouter la carte à votre contrat et assurer son ajout
                const userAddress = i < 10 ? '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f' : '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
                let collectionId = await mainContract.getCollectionIdByName(set.name);
                console.log('Etape 4 collection = ',collectionId," user ",userAddress,' image ',card.images.small);
                await mainContract.mintAndAssignCard(collectionId, userAddress, card.id ,card.images.small);
                console.log('Card Ajouté',card.name);
                // Étape 5: Mettre à jour le fichier .json de la collection
                updateCollectionFile(set.name, { name: card.name, image: card.images.small });
           }
        }
        console.log('recuperation des card de account 4')
        let cardIds = await mainContract.getCardIdsOfUser('0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f');
        console.log(cardIds);
        
        console.log("Toutes les collections ont été créées et les fichiers .json correspondants ont été générés.");

    } catch (error) {
        console.error("Une erreur s'est produite:", error);
    }
}

main();
