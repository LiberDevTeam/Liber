import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSearchPlaceResult,
  selectSearchPlaceResult,
} from '~/state/ducks/search/searchSlice';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from 'styled-components';
import { FixedSizeList } from 'react-window';
import { PlaceInfo } from '~/state/ducks/places/placesSlice';

const ItemContainer = styled.div`
  display: flex;
  border-bottom: ${(props) => props.theme.border.grayLighter.thin};
  padding: ${(props) => props.theme.space[6]}px 0;
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
          <FixedSizeList
            height={height}
            itemCount={result.length}
            itemSize={50}
            width={width}
          >
            {({ index, style }) => (
              <ItemContainer key={result[index].id} style={style}>
                <SearchPlaceResultItem item={result[index]} />
              </ItemContainer>
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    );
  }
);

interface SearchPlaceResultItemProps {
  item: PlaceInfo;
}

const SearchPlaceResultItem: React.FC<SearchPlaceResultItemProps> = ({
  item,
}) => {
  return <>hoge</>;
};
