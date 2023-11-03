import React, { useEffect, useState } from 'react';
import styles from './Marketplace.module.css';
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

export const Marketplace: React.FC = () => {
    const [sets, setSets] = useState<Set[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/pokemon/sets');
                setSets(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const groupedSets = sets.reduce<{ [key: string]: Set[] }>((acc, set) => {
        if (!acc[set.series]) {
            acc[set.series] = [];
        }
        acc[set.series].push(set);
        return acc;
    }, {});

    return (
        <div className={styles.marketplace}>
            {Object.entries(groupedSets).map(([series, setsInSeries]) => (
                <div key={series} className={styles.series}>
                    <h2>{series}</h2>
                    <div className={styles.sets}>
                        {setsInSeries.map(set => (
                            <div key={set.id} className={styles.set}>
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
            ))}
        </div>
    );
}
