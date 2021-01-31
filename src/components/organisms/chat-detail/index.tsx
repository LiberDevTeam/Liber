import React from 'react';
import styled from 'styled-components';
import { Input } from '~/components/atoms/input';

export type ChatDetailProps = {
  cid: string;
};

const Root = styled.div`
  display: grid;
  grid-template-rows: 160px 1fr 40px;
`;

const Header = styled.div``;
const ChatTitle = styled.h2`
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;
const Description = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  word-break: break-all;
  margin-top: ${(props) => props.theme.space[4]}px;
`;

const Body = styled.div``;

const Footer = styled.div`
  display: flex;
`;

export const ChatDetail: React.FC<ChatDetailProps> = React.memo(
  function ChatPage({ cid }) {
    return (
      <Root>
        <Header>
          <ChatTitle>{`We Love FC Barcelona!! id: ${cid}`}</ChatTitle>
          <Description>
            DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescion
          </Description>
        </Header>

        <Body>body</Body>

        <Footer>
          <Input placeholder="Message..." />
        </Footer>
      </Root>
    );
  }
);
