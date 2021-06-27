import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '~/hooks';
import { selectBotById } from '~/state/bots/botsSlice';

const Root = styled.span`
  background: ${(props) => props.theme.colors.lightPrimary};
  color: ${(props) => props.theme.colors.invertedText};
  border-radius: ${(props) => props.theme.radii.small}px;
  padding: 1px 4px;
`;

export const BotMention: React.FC<{ name: string; userId?: string }> =
  React.memo(function BotMention({ name, userId }) {
    const bot = useAppSelector(selectBotById(userId));

    if (!bot) {
      return <span>@{name}</span>;
    }

    return <Root>@{bot?.name || name}</Root>;
  });
