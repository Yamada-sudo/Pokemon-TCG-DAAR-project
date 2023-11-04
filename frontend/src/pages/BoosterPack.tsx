import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './BoosterPack.module.css';

interface Card {
  setId: string;
  cardId: string;
}

interface Attack {
  name: string;
  text: string;
  damage: string;
}

interface CardDetail {
  id: string;
  name: string;
  rarity: string;
  set: {
    name: string;
  };
  images: {
    small: string;
    large: string;
  };
  attacks: Attack[];
  tcgplayer: {
    prices: {
      holofoil: {
        mid: number;
      };
    };
  };
}

interface DetailedCardProps {
  card: CardDetail;
  onClose: () => void;
}

const DetailedCard: React.FC<DetailedCardProps> = ({ card, onClose }) => {
  const price = (card.tcgplayer.prices.holofoil.mid * 10).toFixed(2);

  return (
    <div className={styles.cardDetailsContainer}>
      <div className={styles.detailedCard}>
        <div className={styles.cardImage}>
          <img src={card.images.large} alt={card.name} />
        </div>
        <div className={styles.cardDetails}>
          <h1>{`${card.name} Boosted Card`}</h1>
          <h2 style={{ fontStyle: 'italic' }}>{card.set.name}</h2>
          <div className={styles.cardDescription}>
            {card.attacks.map((attack, index) => (
              <div key={index}>
                <strong>Attack type:</strong> {attack.name}
                <div><strong>Damage:</strong> {attack.damage}</div>
                <div>{attack.text}</div>
              </div>
            ))}
            <p><strong>Rareté:</strong> {card.rarity}</p>
          </div>
          <p className={styles.cardPrice}>${price}</p>
          <button className={styles.buyButton}>Acheter</button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>X</button>
      </div>
    </div>
  );
};

// ... (les imports, les interfaces, et le reste du composant restent identiques)

export const BoosterPack: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardDetails, setCardDetails] = useState<CardDetail[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomCards = async () => {
      try {
        const { data: randomCards } = await axios.get('http://localhost:3000/pokemon/boosters/random-cards');
        setCards(randomCards);
      } catch (error) {
        setError('Error fetching random cards');
      }
    };

    fetchRandomCards();
  }, []);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const details: CardDetail[] = [];
        for (const card of cards) {
          const { data: cardDetail } = await axios.get(`http://localhost:3000/pokemon/sets/${card.setId}/cards/${card.cardId}`);
          details.push(cardDetail);
        }
        setCardDetails(details);
      } catch (error) {
        setError('Error fetching card details');
      }
    };

    if (cards.length > 0) {
      fetchCardDetails();
    }
  }, [cards]);

  return (
    <div className={styles.boosterCardsContainer}>
      {error && <p className={styles.error}>{error}</p>}
      {selectedCard ? (
        <DetailedCard card={selectedCard} onClose={() => setSelectedCard(null)} />
      ) : (
        <div className={styles.cardsGrid}>
          {cardDetails.map((card) => (
            <div key={card.id} className={styles.card} onClick={() => setSelectedCard(card)}>
              <img src={card.images.small} alt={card.name} />
              <p>{card.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
