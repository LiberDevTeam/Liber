import React from 'react';
import { FeedItem } from "~/state/ducks/feed/feedSlice";

type FeedItemBigImageProps = {
  item: FeedItem;
}

const FeedItemBigImage: React.FC<FeedItemBigImageProps> = () => {
  return (
    <>
      BigImage
    </>
  )
}

export default FeedItemBigImage;