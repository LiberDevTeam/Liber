import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { theme } from '~/theme';
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

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => (
  <ReactModal
    isOpen={open}
    style={{
      overlay: {
        backgroundColor: theme.colors.modalBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
