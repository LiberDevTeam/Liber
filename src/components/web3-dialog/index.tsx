import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { Button } from '~/components/button';
import { Modal } from '~/components/modal';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.space[2]}px;

  & > * {
    margin-top: ${(props) => props.theme.space[4]}px;
  }
`;

const PlaceName = styled.div`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const PlaceDescription = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const ContinueButton = styled(Button)`
  width: 100%;
`;

export interface Web3DialogProps {
  onClose: () => void;
}

export const Web3Dialog: React.FC<Web3DialogProps> = React.memo(
  function Web3Dialog({ onClose }) {
    const { t, i18n } = useTranslation(['web3Dialog']);
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [connectingState, setConnectingState] =
      useState<'disconnect' | 'connecting' | 'connected' | 'error'>(
        'disconnect'
      );
    i18n.changeLanguage('ja');

    const handleJoin = useCallback(() => {
      setConnectingState('connecting');
      const providerOptions = {
        /* See Provider Options Section */
      };

      const web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });
      web3Modal
        .connect()
        .then((provider) => {
          // setProvider(provider);
          setWeb3(new Web3(provider));
          setConnectingState('connected');
        })
        .catch((e) => {
          setConnectingState('error');
          console.error('Web3Modal aborted', e);
        });
    }, []);
    // const { web3 } = useWeb3();

    return (
      <Modal open onClose={onClose}>
        <Body>
          <PlaceName>{t('Web3 connect')}</PlaceName>
          <PlaceDescription>{t('Description')}</PlaceDescription>
          <ContinueButton text={t('Continue')} onClick={handleJoin} />
        </Body>
      </Modal>
    );
  }
);
