import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import styled from 'styled-components';
import { NotFound } from '~/components/not-found';
import { FeedItemMessageDefault } from '~/pages/home/components/feed-item';
import { FeedItemMessageBigImage } from '~/pages/home/components/feed-item-big-image';
import { Appearance } from '~/state/feed/feedSlice';
import { Message } from '~/state/places/type';
import {
  fetchSearchMessageResult,
  selectSearchMessageResult,
} from '~/state/search/searchSlice';
import { theme } from '~/theme';

const ItemContainer = styled.div`
  height: 100%;
  display: flex;
  border-bottom: ${(props) =>
    props.theme.border.thin(props.theme.colors.gray2)};
  padding: ${(props) => props.theme.space[6]}px 0;
`;

const Root = styled.div`
  height: 500px;
`;

interface SearchMessageResultProps {
  searchText: string;
}

const feedHeight = {
  [Appearance.DEFAULT]: 250,
  [Appearance.BIG_CARD]: 500 + theme.space[4],
};

export const SearchMessageResult: React.FC<SearchMessageResultProps> =
  React.memo(function SearchMessageResult({ searchText }) {
    const dispatch = useDispatch();
    const result = useSelector(selectSearchMessageResult);
    const [appearance, setAppearance] = useState<{ [key: string]: Appearance }>(
      {}
    );

    useEffect(() => {
      dispatch(
        fetchSearchMessageResult({
          searchText,
        })
      );
    }, [searchText]);

    useEffect(() => {
      setAppearance(
        result.reduce((prev, message) => {
          // TODO improve the decision logic
          if (
            Math.floor(Math.random() * 5) === 0 &&
            message.attachmentCidList?.length
          ) {
            return {
              ...prev,
              [message.id]: Appearance.BIG_CARD,
            };
          }
          return {
            ...prev,
            [message.id]: Appearance.DEFAULT,
          };
        }, {})
      );
    }, [result]);

    if (result.length === 0) {
      return <NotFound />;
    }

    return (
      <Root>
        <AutoSizer>
          {({ height, width }) => (
            <VariableSizeList
              height={height}
              itemCount={result.length}
              itemSize={(index) => {
                return feedHeight[appearance[result[index].id]];
              }}
              width={width}
            >
              {({ index, style }) => (
                <ItemContainer key={result[index].id} style={style}>
                  <SearchMessageResultItem
                    message={result[index]}
                    appearance={appearance[result[index].id]}
                  />
                </ItemContainer>
              )}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Root>
    );
  });

interface SearchMessageResultItemProps {
  message: Message;
  appearance: Appearance;
}

const SearchMessageResultItem: React.FC<SearchMessageResultItemProps> = ({
  message,
  appearance,
}) => {
  switch (appearance) {
    case Appearance.BIG_CARD:
      return <FeedItemMessageBigImage message={message} />;
    case Appearance.DEFAULT:
      return <FeedItemMessageDefault message={message} />;
    default:
      return <FeedItemMessageDefault message={message} />;
  }
};
