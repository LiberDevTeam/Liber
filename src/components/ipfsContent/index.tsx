import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getIpfsNode } from '~/state/ducks/p2p/p2pSlice';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import {
  addIpfsContent,
  selectIpfsContentByCID,
} from '~/state/ducks/p2p/ipfsContentsSlice';
import { IPFS as Ipfs } from 'ipfs';

interface IpfsContentProps {
  cid: string;
  className?: string;
}

const Image = styled.img``;

export const IpfsContent: React.FC<IpfsContentProps> = ({ className, cid }) => {
  const dispatch = useDispatch();
  const content = useSelector(selectIpfsContentByCID(cid));
  const [ipfsNode, setIpfsNode] = useState<Ipfs>();

  useEffect(() => {
    (async () => {
      if (!content) {
        setIpfsNode(await getIpfsNode());
        dispatch(addIpfsContent({ cid }));
      }
    })();
  }, [dispatch, cid]);

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
      return <Image className={className} src={content.dataUrl} />;
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
