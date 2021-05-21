import { push } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { IpfsContent } from '~/components/ipfs-content';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { useQuery } from '~/lib/queryParams';
import {
  selectPurchasedStickers,
  selectStickersListingOn,
} from '~/state/ducks/mypage/stickersSlice';
import BaseLayout from '~/templates';
import { Pagination } from '../../../components/pagination';

const Root = styled.div`
  padding-bottom: ${(props) => props.theme.space[6]}px;
`;

const List = styled.ul`
  margin-top: ${(props) => props.theme.space[6]}px;
`;

const ListItem = styled.li`
  width: 100%;
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[5]}px`};
  border-bottom: ${(props) => props.theme.border.grayLight.light};
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

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledButtonLink = styled(Link)`
  margin: 0 ${(props) => props.theme.space[4]}px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const StyledPagination = styled(Pagination)`
  padding-bottom: ${(props) => props.theme.space[4]}px;
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

interface Props {}

const TAB_LISTING_ON = 'listing';
const TAB_PURCHASED = 'purchased';
const TAB_LIST = [TAB_LISTING_ON, TAB_PURCHASED];
const TAB_TITLE = {
  [TAB_LISTING_ON]: 'Listing on',
  [TAB_PURCHASED]: 'Purchased',
};

export const StickersPage: React.FC<Props> = React.memo(
  function StickersPage({}) {
    const { tab } = useQuery<{ tab: string }>();
    const dispatch = useDispatch();

    const handleSelect = useCallback((index: number) => {
      dispatch(push(`/stickers?tab=${TAB_LIST[index]}`));
    }, []);

    return (
      <BaseLayout
        title="Stickers"
        description="Manage your Stickers settings"
        backTo="/profile"
      >
        <StyledButtonLink to="/stickers/new">
          <StyledButton shape="rounded" text="SELL YOUR ORIGINAL STICKER!" />
        </StyledButtonLink>
        <Tabs
          tabList={TAB_LIST}
          tabTitle={TAB_TITLE}
          selectedTab={tab}
          onSelect={handleSelect}
        >
          <TabPanels>
            <TabPanel hide={tab !== TAB_LISTING_ON}>
              <ListingOn />
            </TabPanel>
            <TabPanel hide={tab !== TAB_PURCHASED}>
              <Purchased />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </BaseLayout>
    );
  }
);

interface PurchacedProps {}

const limit = 10;

const Purchased: React.FC<PurchacedProps> = React.memo(function Purchased() {
  const [page, setPage] = useState(1);
  const stickers = useSelector(selectPurchasedStickers);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const offset = (page - 1) * limit;

  return (
    <>
      <List>
        {stickers.slice(offset, offset + limit).map((sticker) => (
          <ListItem key={sticker.id}>
            <StyledLink to={`/stickers/${sticker.id}`}>
              <Avatar cid={sticker.avatar} />
              <RightGroup>
                <Name>{sticker.name}</Name>
                <Description>{sticker.description}</Description>
                <Price>{sticker.price} ETH</Price>
              </RightGroup>
            </StyledLink>
          </ListItem>
        ))}
      </List>
      <StyledPagination current={page} onChange={handleChangePage} />
    </>
  );
});

interface PurchacedProps {}

const ListingOn: React.FC<PurchacedProps> = React.memo(function ListingOn() {
  const [page, setPage] = useState(1);
  const stickers = useSelector(selectStickersListingOn);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const offset = (page - 1) * limit;

  return (
    <Root>
      <List>
        {stickers.slice(offset, offset + limit).map((sticker) => (
          <ListItem key={sticker.id}>
            <StyledLink to={`/stickers/${sticker.id}`}>
              <Avatar cid={sticker.avatar} />
              <RightGroup>
                <Name>{sticker.name}</Name>
                <Description>{sticker.description}</Description>
                <Price>{sticker.price} ETH</Price>
              </RightGroup>
            </StyledLink>
          </ListItem>
        ))}
      </List>
      <StyledPagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
