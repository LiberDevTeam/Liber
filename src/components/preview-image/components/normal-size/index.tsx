import React from 'react';
import styled from 'styled-components';
import { IconButton } from '~/components/icon-button';
import { SvgClose as CancelIcon } from '~/icons/Close';

const Root = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: ${(props) => props.theme.radii.medium}px;
  object-fit: cover;
`;

const Button = styled(IconButton)`
  position: absolute;
  top: -9px;
  right: -9px;
  padding: 0;
  border: 0;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.red};
`;

export interface Props {
  src: string;
  onRemove: () => void;
  className?: string;
}

export const NormalSize: React.FC<Props> = React.memo(function NormalSize({
  src,
  onRemove,
  className,
}) {
  return (
    <Root className={className}>
      <Image src={src} />
      <Button
        type="button"
        icon={<CancelIcon width={18} height={18} />}
        onClick={onRemove}
      />
    </Root>
  );
});
