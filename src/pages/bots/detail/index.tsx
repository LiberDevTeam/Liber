import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { IpfsContent } from '~/components/ipfs-content';
import { fetchBot, selectBotById } from '~/state/ducks/bots/botsSlice';
import { selectMe } from '~/state/ducks/me/meSlice';
import { selectPurchasedBotById } from '~/state/ducks/mypage/botsSlice';
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
`;

const Docs = styled.p``;

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

interface Props {}

export const BotDetailPage: React.FC<Props> = memo(function BotDetailPage({}) {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const me = useSelector(selectMe);
  const bot = useSelector(selectBotById(id));
  const purchased = useSelector(selectPurchasedBotById(id));

  useEffect(() => {
    if (!bot) {
      dispatch(fetchBot({ id }));
    }
  }, [id]);

  // TODO loading;
  if (!bot) return null;

  const mine = bot.uid === me.id;

  return (
    <BaseLayout backTo="previous">
      <HeaderContent>
        <Avatar cid={bot.avatar} />
        <Group>
          <Name>{bot.name}</Name>
          <Category>{bot.category}</Category>
          <Stock>Stock: Unlimited</Stock>
          <Price>Price: {bot.price} ETH</Price>
        </Group>
      </HeaderContent>

      <Section>
        <Subtitle>Description</Subtitle>
        <Description>{bot.description}</Description>
      </Section>

      <Section>
        <Subtitle>Docs</Subtitle>
        <Docs>{bot.docs}</Docs>
      </Section>

      <ExampleSection>
        <Subtitle>Examples</Subtitle>
        {bot.examples.map((e, i) => (
          <Example key={i} botId={bot.id} index={i} />
        ))}
      </ExampleSection>

      <ButtonSection>
        <Link to={`/bots/${bot.id}/edit`}>
          <EditButton text="EDIT" />
        </Link>
        {mine && (
          <Link to={`/bots/${bot.id}/edit`}>
            <EditButton text="EDIT" />
          </Link>
        )}
        {!mine && !purchased && (
          <Link to={`/bots/${bot.id}/purchase`}>
            <PurchaseButton text="PURCHASE" />
          </Link>
        )}
      </ButtonSection>
    </BaseLayout>
  );
});
