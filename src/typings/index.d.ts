declare module 'prettier-bytes';
declare module 'ipfs-http-response' {
  import { IPFS } from 'ipfs';
  export function getResponse(ipfsNode: IPFS, ipfsPath: string): Response;
}
