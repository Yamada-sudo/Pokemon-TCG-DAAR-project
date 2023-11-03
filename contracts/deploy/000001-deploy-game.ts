import 'dotenv/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Déployez Main, qui créera également CardNFT
  const main = await deploy('Main', {
    from: deployer,
    args: [], // Main n'a pas de paramètres pour son constructeur
    log: true,
  });
 
  const mainContract = await ethers.getContractAt('Main', main.address); // Utilisez ethers pour obtenir le contrat
  const mainOwner = await mainContract.owner(); // Appellez la fonction owner directement
  console.log(`L'adresse du propriétaire de Main est: ${mainOwner}`);


  // À ce stade, CardNFT est déjà déployé par Main, et vous pouvez interagir avec lui via Main.
};

export default func;
func.tags = ['DeployAll'];
