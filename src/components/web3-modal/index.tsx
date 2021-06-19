import { useWeb3React } from '@web3-react/core';
import React, { useCallback, useState } from 'react';
import styled, { ThemeConsumer } from 'styled-components';
import { injectedConnecter } from '~/lib/web3Provider';
import { Button } from '../button';
import { Modal } from '../modal';

const Root = styled.div`
  width: 320px;
  padding-top: ${(props) => props.theme.space[3]}px;
  padding-bottom: ${(props) => props.theme.space[4]}px;
  display: flex;
  flex-direction: column;
`;

const Image = styled.span`
  font-size: 4rem;
  text-align: center;
`;

const PlaceTitle = styled.div`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const PlaceDescription = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const ConnecterList = styled.div`
  display: flex;
  padding-top: ${(props) => props.theme.space[8]}px;
`;

export interface Web3ModalProps {
  open: boolean;
  onClose: () => void;
}

const title = 'Wallet connect';

export const Web3Modal: React.FC<Web3ModalProps> = React.memo(
  function Web3Modal({ open, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const {
      account, // optional
      activate,
      active,
      chainId, // optional
      connector, // optional
      deactivate,
      error, // optional
      library, // optional
      setError,
    } = useWeb3React();

    const handleConnect = useCallback(async (connecterName: string) => {
      await setIsLoading(true);
      switch (connecterName) {
        case 'injected':
          await activate(injectedConnecter);
          break;
        default:
          console.log('no connecter match');
      }
      await setIsLoading(false);
    }, []);

    const handleDisconnect = useCallback(() => {
      deactivate();
    }, [deactivate]);

    return (
      <ThemeConsumer>
        {(theme) => (
          <Modal open={open} onClose={onClose}>
            {active ? (
              <Root>
                <Image>🔗</Image>
                <PlaceTitle>Wallet connected</PlaceTitle>
                <PlaceDescription>
                  You can use Stickers and Bots!
                </PlaceDescription>
                <Button
                  onClick={() => handleDisconnect()}
                  text="Disconnect"
                  color={theme.colors.red}
                  disabled={isLoading}
                />
              </Root>
            ) : (
              <Root>
                <Image>E</Image>
                <PlaceTitle>{title}</PlaceTitle>
                <PlaceDescription>
                  You need to integrate with Ethereum Wallet to purchase, sell
                  or use your content sticker and bot.
                </PlaceDescription>
                <ConnecterList>
                  <Button
                    onClick={() => handleConnect('injected')}
                    text="Injected Web3"
                    color={theme.colors.primary}
                    icon="M"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleConnect('wallet')}
                    text="Wallet connect"
                    color={theme.colors.primary}
                    icon="W"
                    disabled={isLoading}
                  />
                </ConnecterList>
              </Root>
            )}
          </Modal>
        )}
      </ThemeConsumer>
    );
  }
);
