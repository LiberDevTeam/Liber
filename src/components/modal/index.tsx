import React from 'react';
import ReactModal from 'react-modal';
import styled, { useTheme } from 'styled-components';
import { CloseButton } from '../close-button';

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const theme = useTheme();
  return (
    <ReactModal
      isOpen={open}
      style={{
        overlay: {
          backgroundColor: theme.colors.modalBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: theme.zIndex.front,
        },
        content: {
          position: 'initial',
          borderRadius: theme.radii.medium,
          inset: 'initial',
          padding: theme.space[3],
          maxWidth: '90%',
        },
      }}
      onRequestClose={onClose}
    >
      <Header>
        <CloseButton onClick={onClose} />
      </Header>
      {children}
    </ReactModal>
  );
};
