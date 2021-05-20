import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1px, 150px;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 80px, 150px;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 80px, 150px;
    stroke-dashoffset: -100px;
  }
`;

const Root = styled.svg`
  animation: ${rotate} 1.4s linear infinite;
`;

const Circle = styled.circle`
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-dashoffset: 0;
  animation: ${dash} 1.4s ease-in-out infinite;
`;

export const Loading: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  width,
  height,
}) => (
  <Root
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    width={width}
    height={height}
  >
    <Circle cx="12" cy="12" r="10"></Circle>
  </Root>
);
