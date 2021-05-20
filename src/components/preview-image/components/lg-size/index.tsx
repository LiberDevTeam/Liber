import React from 'react';
import styled from 'styled-components';
import { IconButton } from '~/components/icon-button';
import { SvgClose as CancelIcon } from '../../../../icons/Close';

const Root = styled.div`
  position: relative;
  width: 124px;
  height: 124px;
`;

const Image = styled.img`
  width: 124px;
  height: 124px;
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

export interface Props {
  src: string;
  onRemove: () => void;
  className?: string;
}

export const LgSize: React.FC<Props> = React.memo(function LgSize({
  src,
  onRemove,
  className,
}) {
  return (
    <Root className={className}>
      <Image src={src} />
      <Button
        type="button"
        icon={<CancelIcon width={20} height={20} />}
        onClick={onRemove}
      />
    </Root>
  );
});
