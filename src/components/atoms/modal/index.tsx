import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { theme } from '~/theme';
import { IconButton } from '~/components/atoms/icon-button';
import { Close as CloseIcon } from '@material-ui/icons';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  font-family: ${(props) => props.theme.fontFamily.heading};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  font-size: ${(props) => props.theme.fontSizes.lg};
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
        padding: theme.space[4],
      },
    }}
    onRequestClose={onClose}
  >
    <Header>
      <IconButton icon={<CloseIcon />} onClick={onClose} />
    </Header>
    {children}
  </ReactModal>
);
