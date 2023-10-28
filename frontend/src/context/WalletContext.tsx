// src/context/WalletContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface WalletContextType {
  isConnected: boolean;
  userAddress: string | null;
  connect: (address: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean>(localStorage.getItem('isConnected') === 'true');
    const [userAddress, setUserAddress] = useState<string | null>(localStorage.getItem('userAddress'));
    
    const connect = (address: string) => {
        setIsConnected(true);
        setUserAddress(address);
        localStorage.setItem('isConnected', 'true');
        localStorage.setItem('userAddress', address);
    };
    

  return (
    <WalletContext.Provider value={{ isConnected, userAddress, connect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
