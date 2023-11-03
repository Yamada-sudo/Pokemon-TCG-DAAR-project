import React, { useEffect, useState } from 'react';
import styles from './UserPage.module.css';
import { useWallet } from '../context/WalletContext';
import axios from 'axios'; // Import axios

interface PokemonCard {
  id: string;
  name: string;
  images: {
    small: string;
  };
  set: {
    name: string;
  };
}

export const UserPage = () => {
  const { userAddress } = useWallet();
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);

  useEffect(() => {
    // Récupérer les cartes Pokémon de l'utilisateur connecté
    async function fetchUserCards() {
      try {
        const response = await axios.get(`http://localhost:3000/nfts/${userAddress}`);
        setPokemonCards(response.data); // Use data from the response directly
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes :", error);
      }
    }

    fetchUserCards();
  }, [userAddress]);

  return (
    <div className={styles.userPageContainer}>
      <div className={styles.cardsContainer}>
        {pokemonCards.length > 0 ? (
          pokemonCards.map((card) => (
            <div key={card.id} className={styles.singleCard}>
              <img src={card.images.small} alt={card.name} className={styles.cardImage} />
              <p>{card.name}</p>
              <p>{card.set.name}</p>
            </div>
          ))
        ) : (
          <p>
            Oh non ! Il semble que vous n'ayez pas encore de cartes Pokémon. Allez-vous devenir le meilleur dresseur ?
          </p>
        )}
      </div>
    </div>
  );
};
