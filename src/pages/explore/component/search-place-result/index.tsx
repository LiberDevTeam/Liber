import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSearchPlaceResult,
  selectSearchPlaceResult,
} from '~/state/ducks/search/searchSlice';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from 'styled-components';
import { FixedSizeGrid } from 'react-window';
import { PlaceInfo } from '~/state/ducks/places/placesSlice';
import { IpfsContent } from '~/components/ipfs-content';
import { theme } from '~/theme';

const ItemContainer = styled.div`
  padding: ${(props) => props.theme.space[2]}px
    ${(props) => props.theme.space[2]}px;
`;

const ItemRoot = styled.div``;

const BackgroundImg = styled(IpfsContent)<{ width: number; height: number }>`
  object-fit: cover;

  position: absolute;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  overflow: hidden;
  border-radius: ${(props) => props.theme.radii.medium}px;
`;

interface SearchPlaceResultProps {
  searchText: string;
}

export const SearchPlaceResult: React.FC<SearchPlaceResultProps> = React.memo(
  function SearchPlaceResult({ searchText }) {
    const dispatch = useDispatch();
    const result = useSelector(selectSearchPlaceResult);

    useEffect(() => {
      dispatch(
        fetchSearchPlaceResult({
          searchText,
          offset: result.length,
        })
      );
    }, [searchText]);

    return (
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeGrid
            height={height}
            columnCount={2}
            columnWidth={width / 2}
            rowCount={result.length / 2}
            rowHeight={200}
            width={width}
          >
            {({ rowIndex, columnIndex, style }) => {
              const index = rowIndex * 2 + columnIndex;
              return (
                <ItemContainer key={`${result[index].id}`} style={style}>
                  <Item
                    item={result[index]}
                    width={width / 2 - theme.space[2] * 2}
                    height={200 - theme.space[2] * 2}
                  />
                </ItemContainer>
              );
            }}
          </FixedSizeGrid>
        )}
      </AutoSizer>
    );
  }
);

interface ItemProps {
  item: PlaceInfo;
  width: number;
  height: number;
}

const Item: React.FC<ItemProps> = React.memo(function Item({
  item,
  width,
  height,
}) {
  return (
    <ItemRoot>
      <BackgroundImg cid={item.avatarCid} width={width} height={height} />
    </ItemRoot>
  );
});
