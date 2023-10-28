import 'dotenv/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

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

  // À ce stade, CardNFT est déjà déployé par Main, et vous pouvez interagir avec lui via Main.
};

export default func;
func.tags = ['DeployAll'];
