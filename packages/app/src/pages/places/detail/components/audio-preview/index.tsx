import React, { memo } from 'react';
import styled from 'styled-components';
import { IconButton } from '~/components/icon-button';
import { SvgClose as CancelIcon } from '~/icons/Close';
import { SvgSoundBars as SoundBarsIcon } from '~/icons/SoundBars';

const Root = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  color: ${(props) => props.theme.colors.primaryText};
  padding: ${(props) => props.theme.space[4]}px;
  border: ${(props) => props.theme.border.thin(props.theme.colors.gray4)};
  border-radius: ${(props) => props.theme.radii.medium}px;
`;

const Button = styled(IconButton)`
  position: absolute;
  top: -9px;
  right: -9px;
  padding: 0;
  border: 0;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.red};
`;

interface AudioPreviewProps {
  onRemove: () => void;
}

export const AudioPreview: React.FC<AudioPreviewProps> = memo(
  function AudioPreview({ onRemove }) {
    return (
      <Root>
        <SoundBarsIcon onClick={onRemove} />
        <Button
          type="button"
          icon={<CancelIcon width={18} height={18} />}
          onClick={onRemove}
        />
      </Root>
    );
  }
);
