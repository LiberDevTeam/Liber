import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FeedItemDefault from '~/pages/home/components/feed-item';
import FeedItemBigImage from '~/pages/home/components/feed-item-big-image';
import { Appearance, ItemKind, FeedItem } from '~/state/ducks/feed/feedSlice';
import {
  selectSearchPostResult,
  fetchSearchPostResult,
} from '~/state/ducks/search/searchSlice';
import { theme } from '~/theme';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from 'styled-components';
import { VariableSizeList } from 'react-window';

const ItemContainer = styled.div`
  display: flex;
  border-bottom: ${(props) => props.theme.border.grayLighter.thin};
  padding: ${(props) => props.theme.space[6]}px 0;
`;

interface SearchPostResultProps {
  searchText: string;
}

const feedHeight = {
  [Appearance.DEFAULT]: {
    [ItemKind.MESSAGE]: 320 + theme.space[14],
    [ItemKind.PLACE]: 400 + theme.space[4],
  },
  [Appearance.BIG_CARD]: {
    [ItemKind.MESSAGE]: 620 + theme.space[4],
    [ItemKind.PLACE]: 800 + theme.space[4],
  },
};

export const SearchPostResult: React.FC<SearchPostResultProps> = React.memo(
  function SearchPostResult({ searchText }) {
    const dispatch = useDispatch();
    const result = useSelector(selectSearchPostResult);

    useEffect(() => {
      dispatch(
        fetchSearchPostResult({
          searchText,
          lastTimestamp: result.length && result[result.length - 1].timestamp,
        })
      );
    }, [searchText]);

    return (
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            height={height}
            itemCount={result.length}
            itemSize={(index) => {
              return feedHeight[result[index].appearance][result[index].kind];
            }}
            width={width}
          >
            {({ index, style }) => (
              <ItemContainer key={result[index].id} style={style}>
                <SearchPostResultItem item={result[index]} />
              </ItemContainer>
            )}
          </VariableSizeList>
        )}
      </AutoSizer>
    );
  }
);

interface SearchPostResultItemProps {
  item: FeedItem;
}

const SearchPostResultItem: React.FC<SearchPostResultItemProps> = ({
  item,
}) => {
  switch (item.appearance) {
    case Appearance.BIG_CARD:
      return <FeedItemBigImage item={item} />;
    case Appearance.DEFAULT:
      return <FeedItemDefault item={item} />;
  }
};
