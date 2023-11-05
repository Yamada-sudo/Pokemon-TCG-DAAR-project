// frontend/src/components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { AiFillHome, AiFillProfile, AiOutlineShop, AiOutlineGift } from 'react-icons/ai'; 

export const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.linkContainer}>
        <Link to="/Home" className={styles.linkText}><AiFillHome className={styles.icon}/> Accueil</Link>
      </div>
      <div className={styles.linkContainer}>
        <Link to="/User" className={styles.linkText}><AiFillProfile className={styles.icon}/> Profil</Link>
      </div>
      <div className={styles.linkContainer}>
        <Link to="/Marketplace" className={styles.linkText}><AiOutlineShop className={styles.icon}/> Marketplace</Link>
      </div>
      <div className={styles.linkContainer}>
        <Link to="/Boosters" className={styles.linkText}><AiOutlineGift className={styles.icon}/> Boosters</Link>
      </div>
    </div>
  );
};
