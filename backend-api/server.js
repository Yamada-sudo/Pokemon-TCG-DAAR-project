const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();
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
        
                const cardDetails = await Promise.all(cardDetailsPromises);
        
                // Retournez les informations en tant que réponse JSON
                res.json(cardDetails);
            } catch (error) {
                next(error);
            }
        });
        

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
