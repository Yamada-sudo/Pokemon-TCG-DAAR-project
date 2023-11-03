// frontend/src/pages/HomePage.tsx
import React from 'react';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.content}>
        <h1>Bienvenue dans le monde Pokémon TCG !</h1>
        <p>Découvrez les mystères des cartes, entraînez-vous et devenez le meilleur dresseur !</p>
      </div>
    </div>
  );
};
