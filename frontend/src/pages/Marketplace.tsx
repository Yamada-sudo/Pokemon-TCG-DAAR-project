import React, { useEffect, useState } from 'react';
import styles from './Marketplace.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Set {
    id: string;
    name: string;
    series: string;
    releaseDate: string;
    images: {
        symbol: string;
        logo: string;
    };
}

interface Card {
    id: string;
    name: string;
    images: {
        small: string;
    };
}

interface CardDetail {
    id: string;
    name: string;
    supertype: string;
    level: string;
    abilities: {
      name: string;
      text: string;
      type: string;
    }[];
    images: {
      small: string;
      large: string;
    };
    tcgplayer: {
      prices: {
        normal: {
            mid: number;
          };
        holofoil: {
          mid: number;
        };
      };
    };
  }

export const Marketplace: React.FC = () => {
    const [sets, setSets] = useState<Set[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedSet, setSelectedSet] = useState<Set | null>(null);
    const [selectedCard, setSelectedCard] = useState<CardDetail | null>(null);
    const [cardClickCount, setCardClickCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/pokemon/sets');
                setSets(response.data);
            } catch (error) {
                console.error('Loading ... data:', error);
            }
        };
        fetchData();
    }, []);

    const fetchCardsForSet = async (setId: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/pokemon/sets/${setId}`);
            setCards(response.data);
            const matchingSet = sets.find(s => s.id === setId);
            setSelectedSet(matchingSet || null);
        } catch (error) {
            console.error('Loading ... cards:', error);
        }
    };

    const fetchCardDetail = async (setId: string, cardId: string) => {
        try {
          const response = await axios.get(`http://localhost:3000/pokemon/sets/${setId}/cards/${cardId}`);
          setSelectedCard(response.data);
        } catch (error) {
          console.error('Loading ... card details:', error);
        }
      }

    const groupedSets = sets.reduce<{ [key: string]: Set[] }>((acc, set) => {
        if (!acc[set.series]) {
            acc[set.series] = [];
        }
        acc[set.series].push(set);
        return acc;
    }, {});
    const onClose = () => {
        setSelectedCard(null); // Pour fermer la vue de détail
    };

    const onBuy = (priceInEuros: number, cardId: string, setId: string) => {
        navigate('/Achat', { state: { priceInEuros, cardId, setId } });
    };
    return (
        <div className={styles.marketplace}>
            {selectedCard ? (
                <div>
                    <button className={styles.closeButton} onClick={onClose}>X</button>
                    <img src={selectedCard.images.small} alt={selectedCard.name} />
                    <div>
                        <h2>{selectedCard.name}</h2>
                        <p>Supertype: {selectedCard.supertype}</p>
                        <p>Level: {selectedCard.level}</p>
                        {(selectedCard?.abilities || []).map((ability, index) => (
                        <div key={index}>
                            <h3>{ability.name}</h3>
                            <p>{ability.text}</p>
                        </div>
                        ))}
                      <p>Sell Price: {(selectedCard.tcgplayer.prices.holofoil || selectedCard.tcgplayer.prices.normal)?.mid || 100.99} €</p>
                        <button
                            disabled={cardClickCount % 3 === 2}
                            onClick={() => onBuy((selectedCard.tcgplayer.prices.holofoil || selectedCard.tcgplayer.prices.normal)?.mid || 100.99, selectedCard.id, selectedSet?.id || '')}
                        >
                            {cardClickCount % 3 === 2 ? 'En rupture de stock' : 'Acheter'}
                        </button>
                    </div>
                </div>
            ) : selectedSet ? (
                <>
                    <h1>{selectedSet.name}</h1>
                    <div className={styles.cards}>
                        {cards.map(card => (
                            <div key={card.id} className={styles.card} onClick={() => fetchCardDetail(selectedSet.id, card.id)}>
                                <img src={card.images.small} alt={card.name} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                Object.entries(groupedSets).map(([series, setsInSeries]) => (
                    <div key={series} className={styles.series}>
                        <h2>{series}</h2>
                        <div className={styles.sets}>
                            {setsInSeries.map(set => (
                                <div key={set.id} className={styles.set} onClick={() => fetchCardsForSet(set.id)}>
                                    <img src={set.images.logo} alt={set.name} />
                                    <p>{set.name}</p>
                                    <p>Released {set.releaseDate}</p>
                                    <div className={styles.legals}>
                                        <span>Standard Legal</span>
                                        <span>Expanded Legal</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
    
}
