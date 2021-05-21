import { Mutex } from 'async-mutex';
import FileType from 'file-type/browser';
import IPFS, { IPFS as IPFSType } from 'ipfs';
import { CacheableResponse } from 'workbox-cacheable-response';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';

let ipfsNode: IPFSType | null;
const ipfsMutex = new Mutex();

// eslint-disable-next-line no-restricted-globals
self.__WB_DISABLE_DEV_LOGS = true;

const getIpfsNode = async (): Promise<IPFSType> => {
  return await ipfsMutex.runExclusive<IPFSType>(async () => {
    if (!ipfsNode) {
      ipfsNode = await IPFS.create();
    }
    return ipfsNode;
  });
};

const cidRegex = /\/view\/(.*)/;
const cacheable = new CacheableResponse({
  statuses: [0, 200],
});

const readIPFSContent = async (stream: AsyncIterable<Uint8Array>) => {
  const uint8arr = [];
  for await (const chunk of stream) {
    uint8arr.push(chunk);
  }
  return new Blob(uint8arr);
};

const createPartialContentResponse = async (res: Response) => {
  const ab = await res.arrayBuffer();
  return new Response(ab, {
    status: 206,
    headers: res.headers,
  });
};

const imageHandler = async ({ url }: { url: URL }) => {
  const ipfsNode = await getIpfsNode();
  const match = url.pathname.match(cidRegex);
  const cache = await caches.open('ipfs-content-cache');

  if (!match) {
    return new Response('', { status: 404 });
  }

  const cachedResponse = await cache.match(match[1]);
  if (cachedResponse) {
    return createPartialContentResponse(cachedResponse);
  }

  const content = await readIPFSContent(await ipfsNode.cat(match[1]));
  const contentType = await FileType.fromBlob(content);

  const headers = new Headers();

  headers.append('Content-Type', contentType?.mime || '');
  headers.append('Content-Length', `${content.size}`);
  headers.append(
    'Content-Range',
    `bytes 0-${content.size - 1}/${content.size}`
  );

  const response = new Response(content, {
    status: 200,
    headers,
  });

  if (cacheable.isResponseCacheable(response)) {
    cache.put(match[1], response.clone());
  }

  return createPartialContentResponse(response);
};

registerRoute(new RegExp('/view/.*'), imageHandler);
clientsClaim();
