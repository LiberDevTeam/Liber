import React from 'react';
import styled from 'styled-components';
import { IconButton } from '~/components/atoms/icon-button';
import { lighten } from 'polished';
import CancelIcon from '@material-ui/icons/Cancel';

const Root = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: ${(props) => props.theme.radii.medium}px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Button = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
  border: 0;
  color: ${(props) => props.theme.colors.secondaryText};

  &:hover {
    color: ${(props) => lighten(0.1, props.theme.colors.secondaryText)};
  }

  &:active {
    color: ${(props) => lighten(0.2, props.theme.colors.secondaryText)};
  }

  & > svg {
    border-radius: ${(props) => props.theme.radii.round};
    background-color: ${(props) => props.theme.colors.bg};
    width: 28px;
    height: 28px;
  }
`;

export interface PreviewImageProps {
  src: string;
  onRemove: () => void;
}

export const PreviewImage: React.FC<PreviewImageProps> = React.memo(
  function PreviewImage({ src, onRemove }) {
    return (
      <Root>
        <Image src={src} />
        <Button type="button" icon={<CancelIcon />} onClick={onRemove} />
      </Root>
    );
  }
);
