import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SvgArrowIosBack as BackIcon } from '~/icons/ArrowIosBack';

const Root = styled.a`
  width: 26px;
  height: 26px;
  color: ${(props) => props.theme.colors.primaryText};
  display: block;
`;

interface BackLinkProps {
  backTo: string | 'previous';
  className?: string;
}

export const BackLink: React.FC<BackLinkProps> = React.memo(function BackLink({
  backTo,
  className,
}) {
  const navigate = useNavigate();
  const handleClick = () =>
    backTo === 'previous' ? navigate(-1) : navigate(backTo);
  return (
    <Root onClick={handleClick} className={className}>
      <BackIcon width={26} height={26} />
    </Root>
  );
});
