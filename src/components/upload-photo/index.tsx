import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { SvgImage } from '../../icons/Image';
import { PreviewImage } from '../preview-image';

const width = 124;
const height = 124;

const Root = styled.div`
  margin-bottom: ${(props) => props.theme.space[8]}px;
  width: ${width}px;
  height: ${height}px;
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  background: ${(props) => props.theme.colors.grayLighter};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.space[3]}px;
  font-size: ${(props) => props.theme.fontSizes.sm};
  border-radius: ${(props) => props.theme.radii.medium}px;
  background: url(/img/upload_image_background.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
`;

const InputFile = styled.input`
  width: ${width}px;
  height: ${height}px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
`;

const ImageIcon = styled(SvgImage)`
  color: ${(props) => props.theme.colors.primary};
  width: 44px;
  height: 44px;
  margin-bottom: ${(props) => props.theme.space[1]}px;
`;

interface UploadPhotoProps {
  onChange: (file: File | null) => void;
  name: string;
  previewSrc: string | null;
  disabled?: boolean;
}

export const UploadPhoto: React.FC<UploadPhotoProps> = React.memo(
  function UploadPhoto({ onChange, name, previewSrc, disabled }) {
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(() => {
      if (avatarInputRef.current?.files && avatarInputRef.current.files[0]) {
        onChange(avatarInputRef.current.files[0]);
      }
    }, []);

    const handleRemove = useCallback(() => {
      if (avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
      onChange(null);
    }, []);

    return (
      <Root>
        {previewSrc ? (
          <PreviewImage src={previewSrc} onRemove={handleRemove} />
        ) : (
          <Container>
            <ImageIcon />
            Upload Photo
            <InputFile
              ref={avatarInputRef}
              name={name}
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={disabled}
            />
          </Container>
        )}
      </Root>
    );
  }
);
