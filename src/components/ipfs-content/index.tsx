import React, {
  CSSProperties,
  memo,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

interface IpfsContentProps {
  cid: string;
  className?: string;
  style?: CSSProperties;
  fallbackComponent?: ReactElement;
}

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const IpfsContent: React.FC<IpfsContentProps> = memo(
  function IpfsContent({ className, cid, style, fallbackComponent }) {
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const url = `/view/${cid}`;

    useEffect(() => {
      if (content === null) {
        fetch(url)
          .then((res) => {
            setMimeType(res.headers.get('Content-Type'));
            return res.blob();
          })
          .then((blob) => {
            setContent(URL.createObjectURL(blob));
          });
      }
    }, [url, content]);

    if (!content) {
      return fallbackComponent ?? null;
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
        return <Image className={className} src={url} style={style} />;
    }

    if (mimeType.includes('audio/')) {
      return <audio controls src={url}></audio>;
    }

    if (mimeType.includes('video/')) {
      return (
        <video controls>
          <source src={url} type={mimeType} />
        </video>
      );
    }

    return fallbackComponent ?? <>unsupported format</>;
  }
);
