import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: inline-flex;
  width: 54px;
  height: 54px;
  justify-content: center;
  align-items: center;
  border-radius: ${(props) => props.theme.radii.round};
  background: transparent;
  border: ${(props) => props.theme.border.gray.thin};
`;

interface IconButtonCircle {
  icon: React.ReactNode;
  onClick: MouseEventHandler;
}

export const IconButtonCircle: React.FC<IconButtonCircle> = React.memo(
  function IconButtonCircle({ icon, onClick }) {
    return <Button onClick={onClick}>{icon}</Button>;
  }
);
