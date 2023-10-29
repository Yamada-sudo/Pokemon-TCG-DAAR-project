const express = require('express');
const { ethers } = require('ethers'); // Make sure you destructured it properly.
require('dotenv').config();
console.log("DEPLOYED_MAIN_ADDRESS:", process.env.DEPLOYED_MAIN_ADDRESS);

const app = express();
const port = 3000;
const contractAddress = process.env.DEPLOYED_MAIN_ADDRESS;
if (!contractAddress) {
    throw new Error('L’adresse du contrat n’est pas définie');
}

let provider;
try {
    // Utilisez le RPC local de Hardhat à la place d'Infura
    provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
} catch (error) {
    console.error('Error initializing ethers provider:', error);
    process.exit(1); // Exit if there's an error initializing the provider.
}

let wallet;

// Encapsulation des parties asynchrones
(async function initialize() {
    try {
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




// Récupération de tous les NFT d'un utilisateur
app.get('/nfts/:address', async (req, res, next) => {
    const address = req.params.address;
    try {
        const nfts = await contract.getAllCardsOfUser(address);
        res.json(nfts);
    } catch (error) {
        next(error);
    }
});

// Récupération de tous les NFT d'une collection pour un utilisateur
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

// Récupération de tous les identifiants des collections
app.get('/collections', async (req, res, next) => {
    try {
        const collectionIds = await contract.getAllCollectionIds();
        res.json(collectionIds);
    } catch (error) {
        next(error);
    }
});

// Récupération d'une collection par son ID
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