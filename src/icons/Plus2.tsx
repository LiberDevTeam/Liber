import * as React from 'react';
export const SvgPlus2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    fill="currentColor"
    {...props}
  >
    <rect width="200" height="200" rx="40" fill="#F5F8FA" />
    <rect x="95" y="47" width="10" height="107" fill="#C4C4C4" />
    <rect
      x="47"
      y="105"
      width="10"
      height="107"
      transform="rotate(-90 47 105)"
      fill="#C4C4C4"
    />
  </svg>
);
