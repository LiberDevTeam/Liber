import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SvgArrowIosBack as BackIcon } from '../../icons/ArrowIosBack';

const Root = styled(Link)`
  width: 26px;
  height: 26px;
`;

interface BackLinkProps {
  backTo: string;
}

export const BackLink: React.FC<BackLinkProps> = React.memo(function BackLink({
  backTo,
}) {
  return (
    <Root to={backTo}>
      <BackIcon />
    </Root>
  );
});
