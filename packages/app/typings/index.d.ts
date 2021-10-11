declare module 'prettier-bytes';
declare module 'ipfs-http-response' {
  import * as IPFS from 'ipfs-core';
  export function getResponse(ipfsNode: IPFS, ipfsPath: string): Response;
}
