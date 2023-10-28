import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles.module.css';
import * as ethereum from '@/lib/ethereum';
import { useWallet } from '../context/WalletContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isConnected, connect } = useWallet();
  
  const connectToMetaMask = async () => {
    try {
      const details = await ethereum.connect('metamask');
      if (details && details.account) {
        console.log("Connecté avec succès!", details);
        connect(details.account); // Passez l'adresse ici
        navigate('/');
      } else {
        console.log("Échec de la connexion. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion à MetaMask:", error);
    }
  };
  

  useEffect(() => {
    if (isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  return (
    <div className={styles.body}>
      <div className={styles.loginContainer}>
        <h1 className={styles.welcomeMessage}>Welcome to Pokémon TCG</h1>
        <p>Rejoignez-nous et plongez dans l'univers des cartes Pokémon!</p>
        <button className={styles.loginButton} onClick={connectToMetaMask}>Connecter avec MetaMask</button>
      </div>
    </div>
  );
};
