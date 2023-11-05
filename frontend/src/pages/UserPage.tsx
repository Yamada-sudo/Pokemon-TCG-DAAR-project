import React, { useEffect, useState } from 'react';
import styles from './UserPage.module.css';
import { useWallet } from '../context/WalletContext';
import axios from 'axios';

interface Attack {
  name: string;
  damage: string;
}

interface PokemonCard {
  id: string;
  name: string;
  images: {
    small: string;
  };
  set: {
    name: string;
  };
  attacks: Attack[];
}

export const UserPage = () => {
  const { userAddress } = useWallet();
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);
  const [filter, setFilter] = useState('');
  const [sortedCards, setSortedCards] = useState<PokemonCard[]>([]);

  useEffect(() => {
    async function fetchUserCards() {
      try {
        const response = await axios.get(`http://localhost:3000/nfts/${userAddress}`);
        setPokemonCards(response.data);
        setSortedCards(response.data); // Initialize sorted cards with fetched data
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes :", error);
      }
    }

    fetchUserCards();
  }, [userAddress]);

  useEffect(() => {
    let sortedArray = [...pokemonCards]; // Create a copy of the pokemonCards array to sort
    if (filter === 'name') {
      sortedArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === 'set') {
      sortedArray.sort((a, b) => a.set.name.localeCompare(b.set.name));
    } else if (filter === 'force') {
      sortedArray.sort((a, b) => {
        // Check if attacks exist and is an array, otherwise set damage to 0
        let aMaxDamage = a.attacks && Array.isArray(a.attacks) 
          ? a.attacks.reduce((max, attack) => Math.max(max, parseInt(attack.damage) || 0), 0)
          : 0;
        let bMaxDamage = b.attacks && Array.isArray(b.attacks)
          ? b.attacks.reduce((max, attack) => Math.max(max, parseInt(attack.damage) || 0), 0)
          : 0;
        return bMaxDamage - aMaxDamage; // Sort from highest damage to lowest
      });
    }
    
    setSortedCards(sortedArray); // Update state with sorted array
  }, [filter, pokemonCards]);

  return (
    <div className={styles.userPageContainer}>
      <div className={styles.filterBar}>
      <p> Filtrer par :</p>
        <button onClick={() => setFilter('name')}>Nom</button>
        <button onClick={() => setFilter('set')}>Set</button>
        <button onClick={() => setFilter('force')}>Force</button>
      </div>
      <div className={styles.cardsContainer}>
        {sortedCards.length > 0 ? (
          sortedCards.map((card) => (
            <div key={card.id} className={styles.singleCard}>
              <img src={card.images.small} alt={card.name} className={styles.cardImage} />
              <p>{card.name}</p>
              <p>{card.set.name}</p>
              {/* Display damage if any */}
              {card.attacks && card.attacks.length > 0 && (
                <p>Force: {card.attacks.map(attack => attack.damage).join(', ')}</p>
              )}
            </div>
          ))
        ) : (
          <p>Oh non ! Il semble que vous n'ayez pas encore de cartes Pokémon. Allez-vous devenir le meilleur dresseur ?</p>
        )}
      </div>
    </div>
  );
};
