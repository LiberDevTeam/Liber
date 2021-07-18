export const fetchIPFSContent = async (cid: string): Promise<File> => {
  return fetch(`/view/${cid}`)
    .then((response) => response.blob())
    .then((blob) => new File([blob], cid));
};
