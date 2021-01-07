import path from 'path';
import WebTorrent, { Torrent } from 'webtorrent';

export const getClient = (): WebTorrent.Instance => {
  // client.on('warning', console.log)
  // client.on('error', console.log);
  return client;
};

const client = new WebTorrent({
  tracker: {
    rtcConfig: {
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:global.stun.twilio.com:3478',
          ],
        },
      ],
      sdpSemantics: 'unified-plan',
    },
  },
});

export const isTorrentFile = (file: File): boolean => {
  const extname = path.extname(file.name).toLowerCase();
  return extname === '.torrent';
};

export const isNotTorrentFile = (file: File): boolean => {
  return !isTorrentFile(file);
};

export const downloadTorrent = (onTorrent: (torernt: Torrent) => void) => (
  torrent: string | File
): void => {
  client.add(torrent, onTorrent);
};

export const seed = (
  files: File[],
  onTorrent: (torrent: Torrent) => void
): void => {
  if (files.length === 0) return;
  client.seed(files, onTorrent);
};
