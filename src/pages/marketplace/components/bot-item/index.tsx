import React, { memo } from 'react';
import { Bot } from '~/state/ducks/bots/botsSlice';

interface Props {
  bot: Bot;
}

export const BotItem: React.FC<Props> = memo(function BotItem({}) {
  return <>bot item</>;
});
