import * as React from 'react';
export const SvgCheckboxUnchecked: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg
    viewBox="0 0 70 70"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <rect
      x="4"
      y="4"
      width="62"
      height="62"
      rx="16"
      fill="white"
      stroke="#8FA7B3"
      stroke-width="8"
    />
  </svg>
);
