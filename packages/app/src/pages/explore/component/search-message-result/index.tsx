import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import styled from 'styled-components';
import { NotFound } from '~/components/not-found';
import { FeedItemMessageDefault } from '~/pages/home/components/feed-item';
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

export const SearchMessageResult: React.FC<SearchMessageResultProps> =
  React.memo(function SearchMessageResult({ searchText }) {
    const dispatch = useDispatch();
    const result = useSelector(selectSearchMessageResult);
    const listRef = useRef<VariableSizeList<any>>(null);
    const itemHeights = useRef<{ [index: number]: number }>({});

    useEffect(() => {
      dispatch(
        fetchSearchMessageResult({
          searchText,
        })
      );
    }, [dispatch, searchText]);

    const handleRenderRow = useCallback(
      (index: number, clientHeight: number) => {
        if (
          itemHeights.current[index] === undefined ||
          // Update only if the new height is greater than the current height.
          itemHeights.current[index] < clientHeight
        ) {
          itemHeights.current[index] = clientHeight;
          listRef.current?.resetAfterIndex(index);
        }
      },
      [listRef]
    );

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
              itemSize={(index) =>
                itemHeights.current[index] + theme.space[8] || theme.space[8]
              }
              width={width}
              ref={listRef}
            >
              {({ index, style }) => (
                <ItemContainer key={result[index].id} style={style}>
                  <FeedItemMessageDefault
                    message={result[index]}
                    onRender={(clientHeight) => {
                      handleRenderRow(index, clientHeight);
                    }}
                  />
                </ItemContainer>
              )}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Root>
    );
  });
