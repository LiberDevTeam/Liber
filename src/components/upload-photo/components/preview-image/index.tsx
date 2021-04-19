import React from 'react';
import styled from 'styled-components';
import { IconButton } from '~/components/icon-button';
import { SvgClose as CancelIcon } from '../../../../icons/Close';

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: ${(props) => props.theme.radii.large}px;
  object-fit: cover;
`;

const Button = styled(IconButton)`
  position: absolute;
  top: -9px;
  right: -9px;
  padding: 1px;
  border: ${(props) => props.theme.border.white.light};
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.red};
  border-radius: ${(props) => props.theme.radii.round};
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
        <Button
          type="button"
          icon={<CancelIcon width={20} height={20} />}
          onClick={onRemove}
        />
      </Root>
    );
  }
);
