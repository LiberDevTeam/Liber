import React, { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import gfm from 'remark-gfm';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { IpfsContent } from '~/components/ipfs-content';
import {
  categoryOptions,
  fetchBot,
  selectBotById,
} from '~/state/bots/botsSlice';
import { selectMe } from '~/state/me/meSlice';
import BaseLayout from '~/templates';
import { Example } from './components/example';

const HeaderContent = styled.div`
  display: flex;
  padding: ${(props) => props.theme.space[5]}px;
`;

const Avatar = styled(IpfsContent)`
  height: 124px;
  width: 124px;
  margin-right: ${(props) => props.theme.space[5]}px;
  border-radius: ${(props) => props.theme.radii.large}px;
`;

const Group = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.md};
`;

const Name = styled.h1`
  font-size: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const Category = styled.p`
  color: ${(props) => props.theme.colors.secondaryText};
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const Stock = styled.p`
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

const Price = styled.p`
  color: ${(props) => props.theme.colors.green};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const Subtitle = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.xl};
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

const Description = styled.p`
  font-weight: ${(props) => props.theme.fontWeights.thin};
  color: ${(props) => props.theme.colors.secondaryText};
  overflow-wrap: break-word;
`;

const Readme = styled.div`
  ul {
    list-style: initial;
    padding: revert;
  }
  padding: ${(props) => props.theme.space[3]}px;
  border: ${(props) => props.theme.border.thin(props.theme.colors.gray)};
  border-radius: ${(props) => props.theme.radii.large}px;
`;

const EditButton = styled(Button)`
  width: 100%;
`;

const PurchaseButton = styled(Button)`
  width: 100%;
`;

const Section = styled.section`
  padding: ${(props) => props.theme.space[5]}px;
`;

const ExampleSection = styled(Section)`
  padding-bottom: 0;
`;

const ButtonSection = styled(Section)`
  padding-top: 0;
`;

export const BotDetailPage: React.FC = memo(function BotDetailPage() {
  const dispatch = useDispatch();
  const { botId, address } = useParams();
  const me = useSelector(selectMe);
  const bot = useSelector(selectBotById(botId));
  const { t } = useTranslation(['selectOptions']);

  useEffect(() => {
    if (!bot && botId && address) {
      dispatch(fetchBot({ botId, address }));
    }
  }, [dispatch, botId, address, bot]);

  // TODO loading;
  if (!bot || !botId || !address) {
    return null;
  }

  const purchased = me.purchasedBots.includes({ botId, address });
  const mine = bot.uid === me.id;

  return (
    <BaseLayout backTo="/bots">
      <HeaderContent>
        <Avatar cid={bot.avatar} />
        <Group>
          <Name>{bot.name}</Name>
          <Category>
            {t(
              `selectOptions:BOT_CATEGORY_${
                categoryOptions[bot.category].label
              }`
            )}
          </Category>
          <Stock>Stock: Unlimited</Stock>
          <Price>Price: 0 ETH</Price>
        </Group>
      </HeaderContent>

      <Section>
        <Subtitle>Description</Subtitle>
        <Description>{bot.description}</Description>
      </Section>

      <Section>
        <Subtitle>Readme</Subtitle>
        <Readme className="markdown-body">
          <ReactMarkdown remarkPlugins={[gfm]}>{bot.readme}</ReactMarkdown>
        </Readme>
      </Section>

      <ExampleSection>
        <Subtitle>Examples</Subtitle>
        {bot.examples.map((e, i) => (
          <Example key={i} botId={bot.id} index={i} />
        ))}
      </ExampleSection>

      <ButtonSection>
        {mine && (
          <Link to={`/bots/${bot.keyValAddress}/${bot.id}/edit`}>
            <EditButton text="EDIT" />
          </Link>
        )}
        {!mine && !purchased && (
          <Link to={`/bots/${bot.keyValAddress}/${bot.id}/purchase`}>
            <PurchaseButton text="PURCHASE" />
          </Link>
        )}
      </ButtonSection>
    </BaseLayout>
  );
});
