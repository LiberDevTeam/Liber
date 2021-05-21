import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { IpfsContent } from '~/components/ipfs-content';
import { selectMe } from '~/state/ducks/me/meSlice';
import { selectPurchasedStickerById } from '~/state/ducks/mypage/stickersSlice';
import {
  fetchSticker,
  selectStickerById,
} from '~/state/ducks/stickers/stickersSlice';
import BaseLayout from '~/templates';

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

const EditButton = styled(Button)`
  width: 100%;
`;

const PurchaseButton = styled(Button)`
  width: 100%;
`;

const Section = styled.section`
  padding: ${(props) => props.theme.space[5]}px;
`;

const ButtonSection = styled(Section)`
  padding-top: 0;
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const GalleryImage = styled(IpfsContent)`
  width: 124px;
  height: 124px;
  margin: ${(props) =>
    `0 ${props.theme.space[4]}px ${props.theme.space[4]}px 0`};
  object-fit: cover;
  border-radius: ${(props) => props.theme.radii.large}px;
`;

interface Props {}

export const StickerDetailPage: React.FC<Props> = memo(
  function StickerDetailPage({}) {
    const dispatch = useDispatch();
    const { stickerId, address } = useParams<{
      stickerId: string;
      address: string;
    }>();
    const me = useSelector(selectMe);
    const sticker = useSelector(selectStickerById(stickerId));
    const purchased = useSelector(selectPurchasedStickerById(stickerId));

    useEffect(() => {
      if (!sticker) {
        dispatch(fetchSticker({ stickerId, address }));
      }
    }, [stickerId, address]);

    // TODO loading;
    if (!sticker) return null;

    const mine = sticker.uid === me.id;

    return (
      <BaseLayout backTo="previous">
        <HeaderContent>
          <Avatar cid={sticker.contents[0].cid} />
          <Group>
            <Name>{sticker.name}</Name>
            <Category>{sticker.category}</Category>
            <Stock>Stock: Unlimited</Stock>
            <Price>Price: {sticker.price} ETH</Price>
          </Group>
        </HeaderContent>

        <Section>
          <Subtitle>Description</Subtitle>
          <Description>{sticker.description}</Description>
        </Section>

        <Section>
          <Subtitle>Contents</Subtitle>
          <Gallery>
            {sticker.contents.map((c, i) => (
              <GalleryImage key={i} cid={c.cid} />
            ))}
          </Gallery>
        </Section>

        <ButtonSection>
          {mine && (
            <Link to={`/stickers/${sticker.keyValAddress}/${sticker.id}/edit`}>
              <EditButton text="EDIT" />
            </Link>
          )}
          {!mine && !purchased && (
            <Link
              to={`/stickers/${sticker.keyValAddress}/${sticker.id}/purchase`}
            >
              <PurchaseButton text="PURCHASE" />
            </Link>
          )}
        </ButtonSection>
      </BaseLayout>
    );
  }
);
