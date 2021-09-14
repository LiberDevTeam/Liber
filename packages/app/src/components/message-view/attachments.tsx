import React from 'react';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { Loading } from '~/icons/loading';

const Attachment = styled(IpfsContent)`
  max-height: 100px;
`;

const Root = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const AttachmentLoadingWrapper = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  attachments?: string[];
}

export const Attachments: React.FC<Props> = React.memo(function Attachments({
  attachments,
}) {
  if (!attachments) {
    return null;
  }

  if (attachments.length === 0) {
    return null;
  }

  return (
    <Root>
      {attachments.map((cid) => (
        <Attachment
          key={`${cid}`}
          cid={cid}
          fallbackComponent={
            <AttachmentLoadingWrapper>
              <Loading width={56} height={56} />
            </AttachmentLoadingWrapper>
          }
        />
      ))}
    </Root>
  );
});
