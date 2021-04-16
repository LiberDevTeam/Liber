import React, { CSSProperties, useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import {
  addIpfsContent,
  selectIpfsContentByCid,
} from '~/state/ducks/p2p/ipfsContentsSlice';
import { IPFS as Ipfs } from 'ipfs';
import { getIpfsNode } from '../../lib/ipfs';

interface IpfsContentProps {
  cid: string;
  className?: string;
  style?: CSSProperties;
}

const Image = styled.img``;

export const IpfsContent: React.FC<IpfsContentProps> = ({
  className,
  cid,
  style,
}) => {
  const dispatch = useDispatch();
  const content = useSelector(selectIpfsContentByCid(cid));
  const [ipfsNode, setIpfsNode] = useState<Ipfs>();

  useEffect(() => {
    (async () => {
      if (!content) {
        setIpfsNode(await getIpfsNode());
        dispatch(addIpfsContent({ cid }));
      }
    })();
  }, [dispatch, cid, content]);

  if (!content) {
    return null;
  }

  switch (content.fileType.mime) {
    case 'image/apng':
    case 'image/avif':
    case 'image/gif':
    case 'image/jpeg':
    case 'image/png':
    case 'image/webp':
      return (
        <Image className={className} src={content.dataUrl} style={style} />
      );
  }

  if (content.fileType.mime.includes('audio/')) {
    return <ReactPlayer src={content.dataUrl} forceAudio />;
  }

  if (content.fileType.mime.includes('video/')) {
    return (
      <ReactPlayer
        src={''}
        forceVideo
        config={{
          file: {
            hlsOptions: {
              ipfs: ipfsNode,
              ipfsHash: cid,
            },
          },
        }}
      />
    );
  }

  return <>unsupported format</>;
};
