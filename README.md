# Résumé du Projet

## Introduction

Ce projet vise à développer un jeu de cartes à collectionner (TCG) décentralisé sur Ethereum, avec des cartes sous forme de NFTs conformes à l'ERC-721. Il se concentre sur la collection et l'échange de cartes numériques, simulant l'expérience des TCG traditionnels.

## Objectif

L'ambition est de créer un TCG décentralisé où chaque carte est un NFT unique sur la blockchain Ethereum, exploitant la rareté et l'authenticité similaires aux TCG physiques comme Magic : The Gathering ou Pokémon TCG. Ce rapport couvre la conception des NFTs, la création d'un marketplace et le développement de l'interface utilisateur pour gérer la collection.
# Contrats Onchain en Solidity

## Solidity et Smart Contracts

Solidity est le langage de prédilection pour rédiger des smart contracts sur Ethereum, permettant l'automatisation des échanges de valeurs diverses sur la blockchain avec une sécurité et fiabilité élevées.

## Smart Contract ERC-721 pour les NFT

Le smart contract ERC-721 est adopté pour créer des NFTs uniques et non interchangeables, idéals pour représenter des cartes à collectionner numériques avec une identité et propriété vérifiables.

## Gestion des NFTs

Le contrat principal `Main` orchestre la création et le minting des NFTs, assurant le suivi des collections et de leurs cartes. Le contrat `CardNFT` s'occupe de l'unicité et de la propriété des cartes NFT, tandis que le contrat `Collection` gère les ensembles de cartes NFT. L'utilisation de Hardhat pour le déploiement automatise et facilite l'interaction avec les contrats.

# Backend Offchain et API

## Serveur et API

Utilisation d'express pour des APIs web et ethers.js pour l'interaction avec Ethereum. Les requêtes HTTP sont gérées via axios, et dotenv gère les variables d'environnement.

## Middleware et Routes

Mise en place d'un middleware pour capturer les erreurs asynchrones et définition des routes API pour diverses actions, telles que la récupération de sets de cartes, le minting et le transfert de NFTs.

## Importance et Interaction

Le backend offchain optimise l'interactivité et la performance, en offrant des fonctionnalités avancées et une sécurité accrue. Il utilise ethers.js pour interagir avec la blockchain, effectuer des lectures sans frais et envoyer des transactions signées.

## Technologies

Serveur construit sur Node.js avec Express.js, et utilisation d'Ethers.js, Axios, et CORS pour le développement et la gestion des interactions blockchain.

# Backend Offchain et API Pokémon TCG

Intégration de l'API Pokémon TCG pour enrichir les données du backend offchain.
Routes Node.js utilisant axios pour des requêtes HTTP à l'API Pokémon TCG, récupérant des informations sur les cartes.
Gestion dynamique du stockage des données pour assurer l'actualité des informations.

# Développement Frontend

Conception de pages pour une expérience utilisateur immersive dans le monde des cartes Pokémon.
Utilisation de React.js pour une interface utilisateur dynamique et réactive.
Intégration avec le backend et les contrats intelligents via Axios pour la gestion de NFT.

# Conclusion du Projet

Développement réussi d'une interface interactive pour la gestion et l'affichage des cartes Pokémon TCG.
Maîtrise de React.js pour le frontend et intégration poussée avec les contrats intelligents pour la sécurité et la fluidité de l'expérience utilisateur.
Résolution de défis techniques renforçant les compétences de développement et la méthode de programmation.
Plans futurs pour élargir les fonctionnalités avec la revente de cartes, les duels, et les échanges, visant à simuler plus précisément l'expérience Pokémon TCG et à dynamiser l'engagement des utilisateurs.

## Démarrage de l'Application

Pour lancer l'application, exécutez la commande suivante :

```bash
yarn dev 
```
# Project Summary

## Introduction

This project is aimed at creating a decentralized trading card game (TCG) on Ethereum, turning each card into a unique NFT in accordance with ERC-721 standards. The focus is on the collection and trade of digital cards, emulating the experience of classic TCGs.

## Objective

The goal is to establish a decentralized TCG where each card is a unique NFT on the Ethereum blockchain, capturing the rarity and authenticity found in physical TCGs like Magic: The Gathering or Pokémon TCG. This report encompasses the design of NFTs, the implementation of a marketplace, and the development of a user interface to manage the collection.

# Onchain Contracts in Solidity

## Solidity and Smart Contracts

Solidity is the go-to programming language for writing smart contracts on Ethereum, enabling the automation of value exchange with high security and reliability on the blockchain.

## ERC-721 Smart Contract for NFTs

The ERC-721 smart contract standard is used for the creation of unique, non-fungible tokens (NFTs), perfect for the representation of digital trading cards with verifiable identity and ownership.

## NFT Management

The main `Main` contract oversees the creation and minting of NFTs, maintaining the link between collections and their respective cards. The `CardNFT` contract manages the uniqueness and ownership of the NFT cards, while the `Collection` contract handles the NFT card sets. Deployment using Hardhat streamlines the setup and interaction with the contracts.

# Offchain Backend and API

## Server and API

Leveraging express for web APIs and ethers.js for interacting with Ethereum. HTTP requests are managed via axios, and environment variables via dotenv.

## Middleware and Routes

A middleware is implemented for capturing asynchronous errors and various API routes are defined for actions like retrieving card sets, minting, and transferring NFTs.

## Importance and Interaction

The offchain backend enhances interactivity and performance, providing advanced functionalities and increased security. It connects to Ethereum using ethers.js for cost-free data reads and signed transaction submissions.

## Technologies

The server is built on Node.js with Express.js, utilizing Ethers.js, Axios, and CORS for development and managing blockchain interactions.

# Offchain Backend and Pokémon TCG API

Integration of the Pokémon TCG API to enrich the offchain backend data.
Node.js routes using axios for HTTP requests to the Pokémon TCG API, retrieving card information.
Dynamic data storage management to ensure up-to-date information.

# Frontend Development

Page design for an immersive user experience in the world of Pokémon cards.
Use of React.js for a dynamic and responsive user interface.
Integration with backend and smart contracts through Axios for NFT management.

# Project Conclusion

Successfully implemented an interactive interface for managing and displaying Pokémon TCG cards.
Advanced proficiency in React.js for the frontend and intricate integration with smart contracts for secure and seamless user experience.
Technical challenges overcome with innovative solutions, enhancing development skills and refining programming approaches.
Future plans include adding features for users to resell cards, duel, and trade, aiming to more accurately emulate the Pokémon TCG experience and boost user engagement.

## Starting the Application

To start the application, run the following command:

```bash
yarn dev 

