import { Mutex } from 'async-mutex';
import IPFS, { IPFS as IPFSType } from 'ipfs';
import { getResponse } from 'ipfs-http-response';
import { CacheableResponse } from 'workbox-cacheable-response';
import { registerRoute } from 'workbox-routing';

let ipfsNode: IPFSType | null;
const ipfsMutex = new Mutex();

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

const imageHandler = async ({ url }: { url: URL }) => {
  const ipfsNode = await getIpfsNode();
  const match = url.pathname.match(cidRegex);
  const cache = await caches.open('ipfs-content-cache');

  if (!match) {
    return new Response();
  }

  const cachedResponse = await cache.match(match[1]);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await getResponse(ipfsNode, `/ipfs/${match[1]}`);

  if (cacheable.isResponseCacheable(response)) {
    cache.put(match[1], response.clone());
  }
  return response;
};

registerRoute(new RegExp('/view/.*'), imageHandler);
