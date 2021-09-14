import React, {
  CSSProperties,
  memo,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

interface IpfsContentProps {
  cid: string;
  className?: string;
  style?: CSSProperties;
  fallbackComponent?: ReactElement;
  onLoad?: () => void;
  onImageClick?: (cid: string) => void;
}

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const Video = styled.video`
  max-width: 80%;
  min-height: 200px;
  max-height: 300px;
  object-fit: cover;
`;

function resolveVideoType(mimeType: string): string {
  if (mimeType === 'video/quicktime') {
    return 'video/mp4';
  }

  return mimeType;
}

export const IpfsContent: React.FC<IpfsContentProps> = memo(
  function IpfsContent({
    className,
    cid,
    style,
    fallbackComponent,
    onLoad,
    onImageClick,
  }) {
    const ref = useRef<HTMLImageElement>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const url = `/view/${cid}`;

    useEffect(() => {
      if (mimeType === null) {
        fetch(url)
          .then((res) => {
            setMimeType(res.headers.get('Content-Type') ?? '');
          })
          .catch(console.error);
      }
    }, [url, mimeType]);

    if (mimeType === null) {
      return fallbackComponent ?? <div>loading</div>;
    }

    if (!mimeType) {
      return fallbackComponent ?? <>unsupported format</>;
    }

    switch (mimeType) {
      case 'image/apng':
      case 'image/avif':
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
      case 'image/webp':
        return (
          <Image
            className={className}
            src={url}
            style={style}
            ref={ref}
            onLoad={onLoad}
            onClick={() => onImageClick && onImageClick(cid)}
          />
        );
    }

    if (mimeType.includes('audio/')) {
      return <audio controls src={url}></audio>;
    }

    if (mimeType.includes('video/')) {
      return (
        <Video controls onLoadedMetadata={onLoad}>
          <source src={url} type={resolveVideoType(mimeType)} />
        </Video>
      );
    }

    return fallbackComponent ?? <>unsupported format</>;
  }
);
