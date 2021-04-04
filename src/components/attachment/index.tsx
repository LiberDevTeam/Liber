import React from 'react';
import { Attachment as AttachmentType } from "~/state/ducks/places/messagesSlice"

interface AttachmentProps {
  attachment: AttachmentType;
}

export const Attachment: React.FC<AttachmentProps> = ({ attachment }) => {
  return (
    <>
      attachment
    </>
  );
}