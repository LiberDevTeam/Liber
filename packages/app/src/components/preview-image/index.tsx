import React from 'react';
import { LgSize } from './components/lg-size';
import { NormalSize } from './components/normal-size';

export interface PreviewImageProps {
  size?: 'lg' | 'normal';
  src: string;
  onRemove: () => void;
  className?: string;
}

export const PreviewImage: React.FC<PreviewImageProps> = React.memo(
  function PreviewImage({ size = 'normal', ...props }) {
    if (size === 'lg') {
      return <LgSize {...props} />;
    } else {
      return <NormalSize {...props} />;
    }
  }
);
