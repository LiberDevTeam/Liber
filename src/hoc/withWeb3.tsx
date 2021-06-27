import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { Web3Modal } from '~/components/web3-modal';

export const WithWeb3: React.FC = ({ children }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { active } = useWeb3React();

  useEffect(() => {
    if (!active) {
      setIsAuthOpen(true);
    }
  }, [active]);
  return (
    <>
      <Web3Modal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      {children}
    </>
  );
};
