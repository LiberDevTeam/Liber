import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Modal } from '~/components/atoms/modal';
import { Input } from '~/components/atoms/input';
import { Button } from '~/components/atoms/button';
import copy from 'copy-to-clipboard';

const Root = styled.div`
  width: 572px;
  font-family: ${(props) => props.theme.fontFamily.body};
  padding-top: ${(props) => props.theme.space[6]}px;
  padding-bottom: ${(props) => props.theme.space[4]}px;
`;

const Description = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.lg};
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
      // TODO: Show Toast to notice user that url copied.
      copy(url);
    }, [url]);

    return (
      <Modal open={open} title={title} onClose={onClose}>
        <Root>
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
