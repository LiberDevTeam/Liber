import React, { memo } from 'react';
import styled from 'styled-components';
import { SvgClose as CloseIcon } from '~/icons/Close';

const StyledButton = styled.button`
  width: 26px;
  height: 26px;
  border: none;
  border-radius: ${(props) => props.theme.radii.round};
  background-color: ${(props) => props.theme.colors.bgGray};
  padding: ${(props) => props.theme.space[1]}px;
  color: ${(props) => props.theme.colors.secondaryText};
`;

interface Props {
  onClick: () => void;
  className?: string;
}

export const CloseButton: React.FC<Props> = memo(function CloseButton({
  onClick,
  className,
}) {
  return (
    <StyledButton className={className} onClick={onClick} type="button">
      <CloseIcon width={18} height={18} />
    </StyledButton>
  );
});
