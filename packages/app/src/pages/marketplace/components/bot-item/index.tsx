import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { Bot } from '~/state/bots/types';

const StyledLink = styled(Link)`
  display: flex;
  align-items: end;
  color: ${(props) => props.theme.colors.primaryText};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const RightGroup = styled.div`
  width: 75%;
`;

const Name = styled.p`
  margin-bottom: ${(props) => props.theme.space[1]}px;
  font-size: ${(props) => props.theme.fontSizes.lg};
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.thin};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-bottom: ${(props) => props.theme.space[1]}px;
`;
const Price = styled.p`
  color: ${(props) => props.theme.colors.green};
  font-size: ${(props) => props.theme.fontSizes.lg};
`;

const Avatar = styled(IpfsContent)`
  border-radius: ${(props) => props.theme.radii.large}px;
  width: 62px;
  height: 62px;
  margin-right: ${(props) => props.theme.space[3]}px;
  object-fit: cover;
`;

interface Props {
  bot: Bot;
}

export const BotItem: React.FC<Props> = memo(function BotItem({ bot }) {
  return (
    <>
      <StyledLink to={`/bots/${bot.keyValAddress}/${bot.id}`}>
        <Avatar cid={bot.avatar} />
        <RightGroup>
          <Name>{bot.name}</Name>
          <Description>{bot.description}</Description>
          <Price>0 ETH</Price>
        </RightGroup>
      </StyledLink>
    </>
  );
});
