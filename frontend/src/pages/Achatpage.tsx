import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import styles from './Achat.module.css';

export const Achat: React.FC = () => {
  const { state } = useLocation();
  const { priceInEuros, cardId, setId } = state as { priceInEuros: string, cardId: string, setId: string };
  const [card, setCard] = useState<any>(null);
  const navigate = useNavigate();
  const { userAddress, getBalance } = useWallet();
  const [balance, setBalance] = useState<string>('');

  useEffect(() => {
    fetch(`http://localhost:3000/pokemon/sets/${setId}/cards/${cardId}`)
      .then((response) => response.json())
      .then((data) => setCard(data));

    if (userAddress) {
      getBalance().then((balance) => setBalance(balance || '0'));
    }
  }, [cardId, setId, getBalance, userAddress]);

  const handleConfirmClick = async () => {
    if (parseFloat(balance) < parseFloat(priceInEuros)) {
      console.log("Balance too low.");
      return;
    }

    try {
      console.log('user : ', userAddress);
      console.log('id card : ', cardId);
      console.log('id set  : ', setId);
      const response = await fetch(`http://localhost:3000/mint-nft/${userAddress}/${setId}/${cardId}`);
      if (response.ok) {
        alert("Sacré coup de Pokéball ! Ton NFT a rejoint ton équipe sans résister. C'est le début d'une aventure épique dans ton portefeuille numérique !");
        setTimeout(() => navigate('/User'), 3000);
      }
    } catch (error) {
      console.error("There was an error minting the NFT", error);
    }
  };

  const handleCloseClick = () => {
    navigate('/User'); 
  };

  if (!card) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.achatOverlay}>
      <div className={styles.achatContainer}>
        <button className={styles.closeButton} onClick={handleCloseClick}>X</button>
        <div className={styles.cardContainer}>
          <img src={card.images.small} alt={card.name} />
          <div className={styles.cardDetails}>
            <p>Price: €{priceInEuros}</p>
            <p>Balance: Ξ{balance}</p>
            <button onClick={handleConfirmClick} className={styles.confirmButton}>
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
