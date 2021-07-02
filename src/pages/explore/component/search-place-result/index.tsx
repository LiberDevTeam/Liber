import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid } from 'react-window';
import styled from 'styled-components';
import { NotFound } from '~/components/not-found';
import { omitText } from '~/helpers';
import { getIpfsNode } from '~/lib/ipfs';
import {
  downloadIpfsContent,
  selectIpfsContentByCid,
} from '~/state/p2p/ipfsContentsSlice';
import { Place } from '~/state/places/type';
import {
  fetchSearchPlaceResult,
  selectSearchPlaceResult,
} from '~/state/search/searchSlice';
import { theme } from '~/theme';

const ItemContainer = styled.div`
  padding: ${(props) => props.theme.space[2]}px
    ${(props) => props.theme.space[2]}px;
`;

const Root = styled.div`
  height: 500px;
`;
const ItemRoot = styled.div<{ bgImg: string }>`
  position: relative;
  height: 100%;
  width: 100%;
  background-image: ${(props) => props.theme.linearGradient[0]},
    url('${(props) => props.bgImg}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: ${(props) => props.theme.radii.medium}px;
`;

const Container = styled.div`
  bottom: 10px;
  position: absolute;
  color: ${(props) => props.theme.colors.white};
  padding: 0 ${(props) => props.theme.space[1]}px;
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;
const Description = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.thin};
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
        })
      );
    }, [searchText]);

    if (result.length === 0) {
      return <NotFound />;
    }

    return (
      <Root>
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
      </Root>
    );
  }
);

interface ItemProps {
  item: Place;
  width: number;
  height: number;
}

const Item: React.FC<ItemProps> = React.memo(function Item({
  item,
  width,
  height,
}) {
  const dispatch = useDispatch();
  const bgContent = useSelector(selectIpfsContentByCid(item.avatarCid));

  useEffect(() => {
    (async () => {
      if (!bgContent) {
        await getIpfsNode();
        dispatch(downloadIpfsContent({ cid: item.avatarCid }));
      }
    })();
  }, [dispatch, bgContent, item.avatarCid]);

  return (
    <Link to={`/places/${item.keyValAddress}/${item.id}`}>
      <ItemRoot bgImg={bgContent?.dataUrl || ''}>
        <Container>
          <Title>{omitText(item.name, 20)}</Title>
          <Description>{omitText(item.description, 15)}</Description>
        </Container>
      </ItemRoot>
    </Link>
  );
});
