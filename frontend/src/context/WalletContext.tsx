// src/context/WalletContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  userAddress: string | null;
  connect: (address: string) => void;
  getBalance: () => Promise<string | null>;
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

  const getBalance = async (): Promise<string | null> => {
    if (!userAddress) return null;
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const balance = await provider.getBalance(userAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Impossible de récupérer le solde", error);
      return null;
    }
  };

  return (
    <WalletContext.Provider value={{ isConnected, userAddress, connect, getBalance }}>
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
