import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Modal } from '~/components/modal';
import { Input } from '~/components/input';
import { Button } from '~/components/button';
import copy from 'copy-to-clipboard';

const Root = styled.div`
  width: 320px;
  height: 320px;
  padding-top: ${(props) => props.theme.space[3]}px;
  display: flex;
  flex-direction: column;
`;

const Image = styled.span`
  font-size: 64px;
  text-align: center;
`;

const Title = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.bold};
  font-size: ${(props) => props.theme.fontSizes.xl};
  text-align: center;
  margin-top: ${(props) => props.theme.space[5]}px;
`;

const Description = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-top: ${(props) => props.theme.space[3]}px;
  padding: ${(props) => `0px ${props.theme.space[7]}px`};
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  padding-top: ${(props) => props.theme.space[8]}px;
`;

const CopyButton = styled(Button)`
  min-width: 120px;
  margin-left: ${(props) => props.theme.space[2]}px;
`;

export interface SharePlaceDialogProps {
  open: boolean;
  url: string;
  onClose: () => void;
}

const title = 'Invite People';
const description = 'Share the link below to people you want to invite.';

export const SharePlaceDialog: React.FC<SharePlaceDialogProps> = React.memo(
  function SharePlaceDialog({ open, url, onClose }) {
    const handleCopy = useCallback(() => {
      copy(url);
    }, [url]);

    return (
      <Modal open={open} onClose={onClose}>
        <Root>
          <Image>🙋‍♂</Image>
          <Title>{title}</Title>
          <Description>{description}</Description>
          <Content>
            <Input value={url} readOnly />
            <CopyButton onClick={handleCopy} text="Copy Link" shape="rounded" />
          </Content>
        </Root>
      </Modal>
    );
  }
);
