import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import styles from './styles.module.css';
import { LoginPage } from './pages/LoginPage';
import { WalletProvider } from './context/WalletContext';
import { useWallet } from './context/WalletContext';
import { UserPage } from './pages/UserPage';
import { Sidebar } from './pages/Sidebar';
import { HomePage } from './pages/HomePage';
import { Marketplace } from './pages/Marketplace';
import { BoosterPack } from './pages/BoosterPack';
import { Achat } from './pages/Achatpage';


export const App = () => {
  return (
    <WalletProvider>
      <Router>
        <div className={styles.body}>
          <Sidebar />  
          <Routes>
            <Route path="/" element={<ProtectedComponent />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/User" element={<UserPage />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/Marketplace" element={<Marketplace />} />
            <Route path="/Boosters" element={<BoosterPack />} />
            <Route path="/Achat" element={<Achat />} />
            <Route path="*" element={<Navigate to="/Login" />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
};

const ProtectedComponent: React.FC = () => {
  const { isConnected } = useWallet();
  return isConnected ? <Navigate to="/Home" replace /> : <Navigate to="/Login" replace />;
};
