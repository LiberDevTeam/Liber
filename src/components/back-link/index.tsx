import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SvgArrowIosBack as BackIcon } from '../../icons/ArrowIosBack';

const Root = styled(Link)`
  width: 26px;
  height: 26px;
  color: ${(props) => props.theme.colors.primaryText};
  display: block;
`;

interface BackLinkProps {
  backTo: string;
  className?: string;
}

export const BackLink: React.FC<BackLinkProps> = React.memo(function BackLink({
  backTo,
  className,
}) {
  return (
    <Root to={backTo} className={className}>
      <BackIcon width={26} height={26} />
    </Root>
  );
});
