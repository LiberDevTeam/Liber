import React, { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div``;

interface Props {}

export const StickerEditPage: React.FC<Props> = memo(
  function StickerEditPage({}) {
    return <Root>StickerEditPage</Root>;
  }
);
