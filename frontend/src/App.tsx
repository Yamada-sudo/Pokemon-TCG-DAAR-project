import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styles from './styles.module.css';
import { LoginPage } from './pages/LoginPage';
import { WalletProvider } from './context/WalletContext';
import { useWallet } from './context/WalletContext';
import { UserPage } from './pages/UserPage';

export const App = () => {
  return (
    <WalletProvider>
      <Router>
        <div className={styles.body}>
          <Routes>
            <Route path="/" element={<ProtectedComponent />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/User" element={<UserPage />} />
            <Route path="*" element={<Navigate to="/Login" />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
};
const ProtectedComponent: React.FC = () => {
  const { isConnected } = useWallet();
  return isConnected ? <Navigate to="/User" replace /> : <Navigate to="/Login" replace />;
};
