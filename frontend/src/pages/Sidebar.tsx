// frontend/src/components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'; 
import { AiFillHome, AiFillProfile, AiOutlineShop  } from 'react-icons/ai';

export const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.linkContainer}>
        <AiFillHome className={styles.icon} />
        <Link to="/Home" className={styles.linkText}>Accueil</Link>
      </div>
      <div className={styles.linkContainer}>
        <AiFillProfile className={styles.icon} />
        <Link to="/User" className={styles.linkText}>Profil</Link>
      </div>
      <div className={styles.linkContainer}>
    <AiOutlineShop className={styles.icon} />
    <Link to="/Marketplace" className={styles.linkText}>Marketplace</Link>
</div>
    </div>
  );
};
