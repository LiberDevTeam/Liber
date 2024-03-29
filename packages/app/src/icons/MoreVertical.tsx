import * as React from 'react';
export const SvgMoreVertical: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g data-name="Layer 2">
      <g data-name="more-vertical">
        <circle cx={12} cy={12} r={2} />
        <circle cx={12} cy={5} r={2} />
        <circle cx={12} cy={19} r={2} />
      </g>
    </g>
  </svg>
);
