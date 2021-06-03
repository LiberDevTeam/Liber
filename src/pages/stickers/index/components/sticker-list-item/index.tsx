import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { Sticker } from '~/state/stickers/stickersSlice';

const ListItem = styled.li`
  width: 100%;
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[5]}px`};
  border-bottom: ${(props) =>
    props.theme.border.bold(props.theme.colors.gray3)};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: end;
  color: ${(props) => props.theme.colors.primaryText};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const Avatar = styled(IpfsContent)`
  border-radius: ${(props) => props.theme.radii.large}px;
  width: 62px;
  height: 62px;
  margin-right: ${(props) => props.theme.space[3]}px;
  object-fit: cover;
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

interface StickerListItemProps {
  sticker: Sticker;
}

export const StickerListItem: React.FC<StickerListItemProps> = React.memo(
  function StickerListItem({ sticker }) {
    return (
      <ListItem>
        <StyledLink to={`/stickers/${sticker.keyValAddress}/${sticker.id}`}>
          <Avatar cid={sticker.contents[0].cid} />
          <RightGroup>
            <Name>{sticker.name}</Name>
            <Description>{sticker.description}</Description>
            <Price>{sticker.price} ETH</Price>
          </RightGroup>
        </StyledLink>
      </ListItem>
    );
  }
);
