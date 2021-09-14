import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { Modal } from '~/components/modal';
import { Loading } from '~/icons/loading';

const Attachment = styled(IpfsContent)`
  max-height: 100px;
`;

const OpenedImage = styled(IpfsContent)`
  max-height: 80vh;
  max-width: 80vw;
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
  const [showImageCID, setShowImageCID] = useState<string | null>(null);
  const handleClickAttachment = useCallback((cid: string) => {
    setShowImageCID(cid);
  }, []);

  if (!attachments) {
    return null;
  }

  if (attachments.length === 0) {
    return null;
  }

  return (
    <>
      <Root>
        {attachments.map((cid) => (
          <Attachment
            key={`${cid}`}
            cid={cid}
            onImageClick={handleClickAttachment}
            fallbackComponent={
              <AttachmentLoadingWrapper>
                <Loading width={56} height={56} />
              </AttachmentLoadingWrapper>
            }
          />
        ))}
      </Root>
      <Modal open={Boolean(showImageCID)} onClose={() => setShowImageCID(null)}>
        {showImageCID ? <OpenedImage cid={showImageCID} /> : null}
      </Modal>
    </>
  );
});
