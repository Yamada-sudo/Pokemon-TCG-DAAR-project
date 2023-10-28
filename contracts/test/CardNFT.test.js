require('dotenv').config({ path: '../.env' });
const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
//npx hardhat test --config hardhat.config.ts --network localhost test/CardNFT.test.js
describe("NFT and Collection", function () {
  let main;
  let owner, user;
  console.log("MAIN_CONTRACT_ADDRESS:", process.env.DEPLOYED_MAIN_ADDRESS);

  before(async function () {
    // Récupérer les comptes
    [owner, user] = await ethers.getSigners();

    // Récupérer l'instance du contrat Main déployé
    const Main = await ethers.getContractFactory("Main");
    main = await Main.attach(process.env.DEPLOYED_MAIN_ADDRESS);
  });

  it("Should create a collection and NFTs", async function () {
    // Créer une collection
    const tx = await main.connect(owner).createCollection("My Collection", 10);
    await tx.wait();

    // Mint et assigner des NFTs
    const tx2 = await main.connect(owner).mintAndAssignCard(1, user.address, "uri://mycard1");
    await tx2.wait();

    const tx3 = await main.connect(owner).mintAndAssignCard(1, user.address, "uri://mycard2");
    await tx3.wait();

    // Récupérer les adresses des contrats
    const cardNFTAddress = await main.cardNFT();
    const collectionAddress = await main.collections(1);

    // Récupérer les instances des contrats
    const CardNFT = await ethers.getContractFactory("CardNFT");
    const cardNFT = await CardNFT.attach(cardNFTAddress);

    const Collection = await ethers.getContractFactory("Collection");
    const collection = await Collection.attach(collectionAddress);

    // Récupérer les données de la collection
    const collectionData = {
      name: await collection.name(),
      cardCount: (await collection.cardCount()).toNumber(),
      cards: {}
    };

    for (let i = 1; i <= collectionData.cardCount; i++) {
      const uri = await cardNFT.tokenURI(i);
      collectionData.cards[i] = uri;
    }

    // Sauvegarder les données dans un fichier JSON
    fs.writeFileSync("test/collection.json", JSON.stringify(collectionData, null, 2));

    // Assertions
    expect(collectionData.name).to.equal("My Collection");
    expect(collectionData.cardCount).to.equal(4);
  });
});
