import React, { useCallback, useEffect, useState } from 'react';
import styled, { ThemeConsumer } from 'styled-components';
import copy from 'copy-to-clipboard';
import { Modal } from '../modal';
import { Input } from '../input';
import { IconButton } from '../icon-button';
import { SvgCopy as CopyIcon } from '../../icons/Copy';
import { SvgCheckmark as CheckIcon } from '../../icons/Checkmark';

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

const CheckIconContainer = styled.div`
  display: inline-flex;
  border: 2px solid transparent;
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
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
      // TODO: error handling
      setCopied(copy(url));
    }, [url]);

    useEffect(() => {
      if (copied) {
        setTimeout(() => setCopied(false), 1_000);
      }
    }, [copied]);

    return (
      <ThemeConsumer>
        {(theme) => (
          <Modal open={open} onClose={onClose}>
            <Root>
              <Image>🙋‍♂</Image>
              <Title>{title}</Title>
              <Description>{description}</Description>
              <Content>
                <Input
                  value={url}
                  readOnly
                  style={{
                    background: copied
                      ? theme.colors.bgGreen
                      : theme.colors.bgPrimary,
                  }}
                  actions={
                    copied ? (
                      <CheckIconContainer>
                        <CheckIcon
                          color={theme.colors.green}
                          width={24}
                          height={24}
                        />
                      </CheckIconContainer>
                    ) : (
                      <IconButton
                        type="button"
                        icon={<CopyIcon width={24} height={24} />}
                        onClick={handleCopy}
                        title="Copy Link"
                        color={theme.colors.primary}
                      />
                    )
                  }
                />
              </Content>
            </Root>
          </Modal>
        )}
      </ThemeConsumer>
    );
  }
);
