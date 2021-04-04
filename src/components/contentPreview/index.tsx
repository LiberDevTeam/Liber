import React, { useEffect, useState } from 'react';
import FileType from 'file-type/browser';


type ContentPreviewProps = {
  file: File;
}

const Image = styled.img`
`

export const ContentPreviewProps: React.FC<ContentPreviewProps> = async ({ file }) => {
  const [dataUrl, setDataUrl] = useState('');
  const fileType = await FileType.fromStream(file.stream())
  if (!fileType) {
    return (<>unsupported format</>)
  }

  switch (fileType.mime) {
    case "image/apng":
    case "image/avif":
    case "image/gif":
    case "image/jpeg":
    case "image/png":
    case "image/webp":
      useEffect(() => {
        setDataUrl(URL.createObjectURL(file))
      }, [file])
      return (
        <Image src={dataUrl} />
      );
  }
}