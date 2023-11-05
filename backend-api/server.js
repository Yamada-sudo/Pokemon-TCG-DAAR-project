const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const cors = require('cors'); 

const POKEMON_TCG_API_BASE_URL = "https://api.pokemontcg.io/v2";
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`;

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
const port = 3000;
const contractAddress = process.env.DEPLOYED_MAIN_ADDRESS;
if (!contractAddress) {
    throw new Error('L’adresse du contrat n’est pas définie');
}

let provider;
let wallet;

// Initialize ethers provider and contract
(async function initialize() {
    try {
        provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
        const [localWalletAddress] = await provider.listAccounts();
        wallet = provider.getSigner(localWalletAddress);
        const contractJSON = require('../contracts/artifacts/src/Main.sol/Main.json');
        const contractABI = contractJSON.abi;
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);

        // Middleware pour gérer les erreurs
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something went wrong!');
        });

        // Récupérer tous les sets Pokémon
        app.get('/pokemon/sets', async (req, res, next) => {
            try {
                const response = await axios.get(`${POKEMON_TCG_API_BASE_URL}/sets`);
                res.json(response.data.data);
            } catch (error) {
                next(error);
            }
        });

        // Récupérer les cartes d'un set spécifique
        app.get('/pokemon/sets/:setId', async (req, res, next) => {
            const setId = req.params.setId;
            try {
                const response = await axios.get(`${POKEMON_TCG_API_BASE_URL}/cards`, { params: { q: `set.id:${setId}` } });
                res.json(response.data.data);
            } catch (error) {
                next(error);
            }
        });

// Route pour obtenir les détails d'un set spécifique
app.get('/sets/:setId', async (req, res) => {
    const setId = req.params.setId;
  
    try {
      // Appel API pour obtenir les détails du set
      const response = await axios.get(`${POKEMON_TCG_API_BASE_URL}/sets/${setId}`);
      
      // Envoyer la réponse de l'API au client
      res.json(response.data);
    } catch (error) {
      // Gérer les erreurs potentielles, comme un set ID non valide ou des problèmes de réseau
      console.error(error);
      res.status(500).send("Une erreur est survenue lors de la récupération des informations du set.");
    }
  });

        // Récupérer une carte spécifique d'un set
        app.get('/pokemon/sets/:setId/cards/:cardId', async (req, res, next) => {
            const { setId, cardId } = req.params;
            try {
                const response = await axios.get(`${POKEMON_TCG_API_BASE_URL}/cards/${cardId}`);
                if (response.data.data.set.id === setId) {
                    res.json(response.data.data);
                } else {
                    res.status(404).send("Card not found in the specified set");
                }
            } catch (error) {
                next(error);
            }
        });

        // Récupérer des sets sélectionnés
        app.get('/select-sets', async (req, res, next) => {
            try {
                const response = await axios.get(`${POKEMON_TCG_API_BASE_URL}/sets`);
                const sets = response.data.data;
                const selectedSets = sets.filter(set => ["base1", "sve"].includes(set.id));
                res.json(selectedSets);
            } catch (error) {
                next(error);
            }
        });

        // Récupérer le nombre de cartes d'un set spécifique
        app.get('/set-card-count/:setId', async (req, res, next) => {
            const setId = req.params.setId;
            try {
                const response = await axios.get(`${POKEMON_TCG_API_BASE_URL}/cards`, { params: { q: `set.id:${setId}` } });
                res.json({ setId: setId, count: response.data.data.length });
            } catch (error) {
                next(error);
            }
        });

        // Récupérer les informations d'un NFT spécifique
        app.get('/nft-info/:tokenId', async (req, res, next) => {
            const tokenId = req.params.tokenId;
            try {
                const uri = await cardNFT.tokenURI(tokenId);
                const response = await axios.get(`${POKEMON_TCG_API_BASE_URL}${uri}`);
                res.json(response.data.data);
            } catch (error) {
                next(error);
            }
        });

        app.get('/nfts/:address', async (req, res, next) => {
            const userAddress = req.params.address;
            try {
                // Interroger le contrat pour obtenir les cardID
                const cardIds = await contract.getCardIdsOfUser(userAddress);
                
                // Récupérez les informations détaillées de chaque carte à l'aide de l'API Pokemon TCG
                const cardDetailsPromises = cardIds.map(async (cardId) => {
                    const response = await axios.get(`${POKEMON_TCG_API_BASE_URL}/cards/${cardId}`);
                    return response.data.data;
                });
        
                let cardDetails = await Promise.all(cardDetailsPromises);
                
                // Filtrer les doublons en gardant une seule occurrence de chaque nom de carte
                const seenNames = new Set();
                cardDetails = cardDetails.filter(card => {
                    const duplicate = seenNames.has(card.name);
                    seenNames.add(card.name);
                    return !duplicate;
                });
                
                // Retournez les informations en tant que réponse JSON
                res.json(cardDetails);
            } catch (error) {
                next(error);
            }
        });
        
        
        // Helper function to check file age
function isFileFresh(filePath) {
    const stats = fs.statSync(filePath);
    const fileAgeMs = Date.now() - stats.mtimeMs;
    return fileAgeMs < 24 * 60 * 60 * 1000; // 24 hours
}

// Helper function to write to JSON file
function writeCardsToFile(cards) {
    const dataToWrite = JSON.stringify({ lastUpdated: new Date().toISOString(), cards });
    fs.writeFileSync(CARDS_FILE_PATH, dataToWrite);
}
const CARDS_FILE_PATH = '.selectedCards.json';
app.get('/pokemon/boosters/random-cards', async (req, res) => {
    // Check if the file exists and is fresh
    if (fs.existsSync(CARDS_FILE_PATH) && isFileFresh(CARDS_FILE_PATH)) {
        const fileContents = fs.readFileSync(CARDS_FILE_PATH);
        return res.json(JSON.parse(fileContents).cards);
    }

    // If no fresh file, generate new card set
    try {
        const setsResponse = await axios.get(`${POKEMON_TCG_API_BASE_URL}/sets`);
        const sets = setsResponse.data.data;
        let selectedCards = [];
        let attempts = 0;

        while (selectedCards.length < 16 && attempts < sets.length) {
            const randomSetIndex = Math.floor(Math.random() * sets.length);
            const setId = sets[randomSetIndex].id;
            const cardsResponse = await axios.get(`${POKEMON_TCG_API_BASE_URL}/cards`, { params: { q: `set.id:${setId}` } });
            const cards = cardsResponse.data.data;

            if (cards.length > 0) {
                const randomCardIndex = Math.floor(Math.random() * cards.length);
                selectedCards.push({
                    setId: setId,
                    cardId: cards[randomCardIndex].id
                });
            }

            attempts++;
        }

        // Remove duplicates
        selectedCards = [...new Map(selectedCards.map(card => [card['setId'], card])).values()];

        // Write to JSON file
        writeCardsToFile(selectedCards);

        res.json(selectedCards);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
    });


// Route pour mint une NFT basée sur l'ID de set et l'ID de carte
app.get('/mint-nft/:userAddress/:setId/:cardId', async (req, res, next) => {
    const { userAddress, setId, cardId } = req.params;

    try {
        // Récupérer les informations du set
        const setResponse = await axios.get(`${POKEMON_TCG_API_BASE_URL}/sets/${setId}`);
        const set = setResponse.data.data;
        let collectionId;
        
        // Essayer de récupérer l'ID de la collection par son nom
        collectionId = await contract.getCollectionIdByName(set.name);
        console.log('colleciton id : ',collectionId.eq(0));
        // Si la collection n'existe pas, la créer
        if (collectionId.eq(0)) {
            console.log('colleciton id 000 ', set.name,' total ',set.total);
            await contract.createCollection(set.name, set.total);
            console.log(' le set : ',set.name)
            // Attendre et vérifier si la collection a bien été créée
            let attempts = 0;
            while (collectionId.eq(0) && attempts < 10) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes avant de réessayer
                collectionId = await contract.getCollectionIdByName(set.name);
                attempts++;
            }

            if (collectionId.eq(0)) {
                return res.status(400).send("Failed to create collection after multiple attempts");
            }
        }
        console.log('creation faite')
        // Vérifier si la carte existe dans le set
        const cardResponse = await axios.get(`${POKEMON_TCG_API_BASE_URL}/cards/${cardId}`);
        const card = cardResponse.data.data;

        if (card.set.id === setId) {
            // Interagir avec le contrat intelligent pour mint la carte à l'utilisateur
            const tx = await contract.mintAndAssignCard(collectionId, userAddress, card.id, card.images.small);
            await tx.wait(); // Attendre que la transaction soit confirmée
            res.send('OK');
        } else {
            res.status(404).send("Card not found in the specified set");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing your request");
    }   
});
/*
// Route pour transférer une carte NFT d'un utilisateur à un autre
app.post('/transfer-nft/:oldOwnerAddress/:newOwnerAddress/:setId/:cardId/:setName', async (req, res) => {
    const { oldOwnerAddress, newOwnerAddress, setId, cardId, setName } = req.params;
  
    try {
      // Obtenir l'ID de la collection par le nom du set
      const collectionId = await contract.getCollectionIdByName(setName);
  
      // Supprimer la carte de la collection de l'ancien propriétaire
      await contract.removeCardFromUserCollection(collectionId, oldOwnerAddress, cardId);
  
      // Mint la carte pour le nouveau propriétaire
      await contract.mintCardToUser(newOwnerAddress, setId, cardId);
  
      res.send(`La carte avec l'ID ${cardId} a été transférée et mintée pour le nouveau propriétaire avec l'adresse ${newOwnerAddress}.`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Une erreur est survenue lors du transfert de la carte NFT.");
    }
  });*/

        // Récupérer tous les NFT d'une collection pour un utilisateur
        app.get('/nfts/:address/collection/:collectionId', async (req, res, next) => {
            const address = req.params.address;
            const collectionId = req.params.collectionId;
            try {
                const nfts = await contract.getCardsOfUserInCollection(address, collectionId);
                res.json(nfts);
            } catch (error) {
                next(error);
            }
        });

        // Récupérer un NFT particulier d'un utilisateur
        app.get('/nfts/:address/token/:tokenId', async (req, res, next) => {
            const address = req.params.address;
            const tokenId = req.params.tokenId;
            try {
                const nft = await contract.getCardOfUser(address, tokenId);
                res.json({ tokenId: nft });
            } catch (error) {
                next(error);
            }
        });

        // Récupérer tous les identifiants des collections
        app.get('/collections', async (req, res, next) => {
            try {
                const collectionIds = await contract.getAllCollectionIds();
                res.json(collectionIds);
            } catch (error) {
                next(error);
            }
        });

        // Récupérer une collection par son ID
        app.get('/collections/:collectionId', async (req, res, next) => {
            const collectionId = req.params.collectionId;
            try {
                const collectionAddress = await contract.getCollectionAddress(collectionId);
                res.json({ collectionId, address: collectionAddress });
            } catch (error) {
                next(error);
            }
        });

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error in initialize function:', error);
        process.exit(1); // Exit if there's an error in the async initialize function.
    }
})();
