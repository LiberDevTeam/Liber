import React from 'react';
import { FeedItem } from "~/state/ducks/feed/feedSlice";

type FeedItemDefaultProps = {
  item: FeedItem;
}

const FeedItemDefault: React.FC<FeedItemDefaultProps> = () => {
  return (
    <>
      Default
    </>
  )
}

export default FeedItemDefault;