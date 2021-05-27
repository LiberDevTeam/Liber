import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { SvgClose as CloseIcon } from '~/icons/Close';
import { theme } from '~/theme';

const CloseButton = styled.button`
  width: 26px;
  height: 26px;
  border: none;
  border-radius: ${(props) => props.theme.radii.round};
  background-color: ${(props) => props.theme.colors.bgGray};
  padding: ${(props) => props.theme.space[1]}px;
  color: ${(props) => props.theme.colors.secondaryText};
`;

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
      <CloseButton onClick={onClose} type="button">
        <CloseIcon width={18} height={18} />
      </CloseButton>
    </Header>
    {children}
  </ReactModal>
);
