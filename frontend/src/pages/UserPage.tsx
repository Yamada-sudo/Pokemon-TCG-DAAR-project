import React from 'react';
import styles from './UserPage.module.css';
import { useWallet } from '../context/WalletContext';
import { Link } from 'react-router-dom'; 

export const UserPage = () => {
  const { userAddress } = useWallet();

  return (
    <div className={styles.userPageContainer}>
      <Link to="/" className={styles.homeLink}>Accueil</Link>  

      <div className={styles.welcomeMessageContainer}>
        <h1>Bienvenue !</h1>
        <p>Adresse: {userAddress}</p>
      </div>

      <div className={styles.pokemonCardDisplay}>
        {/* Contenu de l'affichage des cartes Pokémon ici */}
      </div>
    </div>
  );
};
