import React, { createRef, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, fromUnixTime } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import ColorHash from 'color-hash';
import { hex } from 'wcag-contrast';
import { selectMe } from '~/state/ducks/me/meSlice';
import { selectChannelMessages } from '~/state/ducks/channel/channelSlice';
import { useParams } from 'react-router-dom';
import { rtcCreateOffer, broadcastMessage } from '~/connection/actions';
import {
  downloadTorrent,
  getClient,
  isNotTorrentFile,
  isTorrentFile,
  seed,
} from '~/torrent';
import { Torrent } from 'webtorrent';
import prettierBytes from 'prettier-bytes';
import { nanoid } from 'nanoid';
import BaseLayout from '~/templates';

export const ChannelPage: React.FC = () => {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const channel = me.channels[cid];

  const messages = useSelector(selectChannelMessages(cid)) || {};

  const colorHash = new ColorHash();

  const textareaRef = createRef<HTMLTextAreaElement>();
  const fileRef = createRef<HTMLInputElement>();

  const [progresses, setProgresses] = useState<
    Record<string, { progress: number; numPeers: number }>
  >({});

  const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
  const [, setUploadSpeed] = useState<number>(0);
  useEffect(() => {
    dispatch(rtcCreateOffer(cid, me));
  }, [dispatch, cid, me]);

  function handleFileChanged(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    // const target = event.target as HTMLInputElement;
    // if (target.files) {
    if (fileRef.current?.files) {
      onFiles(fileRef.current.files);
    }
  }

  function onFiles(files: FileList) {
    const fileAsArr = [...files];
    fileAsArr.forEach(function (file) {
      console.log(' - %s (%s bytes)', file.name, file.size);
    });

    function onTorrent(torrent: Torrent) {
      if (!textareaRef.current) {
        console.log('textareaRef is ', textareaRef.current);
        return;
      }
      const id = uuidv4();
      dispatch(
        broadcastMessage(cid, {
          id,
          uid: me.id,
          attachment: torrent.magnetURI,
          text: obtainTextareaValue(textareaRef.current),
          timestamp: new Date().getTime(),
        })
      );

      // const rootElm = document.querySelector(`#at-${id}`) as HTMLElement
      // appendFileTo(torrent, rootElm)
    }

    // .torrent file = start downloading the torrent
    fileAsArr.filter(isTorrentFile).forEach(downloadTorrent(onTorrent));

    // everything else = seed these files
    seed(
      fileAsArr.filter(isNotTorrentFile).map((file) => {
        const result = /(?:(\.[^.]+))?$/.exec(file.name);
        return new File([file], `${nanoid()}${(result && result[1]) || ''}`, {
          type: file.type,
        });
      }),
      onTorrent
    );
  }

  function obtainTextareaValue(textarea: HTMLTextAreaElement) {
    const value = textarea?.value;
    textarea.value = '';
    return value || '';
  }

  function handleSubmit() {
    if (!textareaRef.current) {
      console.log('textareaRef is ', textareaRef.current);
      return;
    }

    const text = obtainTextareaValue(textareaRef.current);
    if (!text) {
      console.log('Not sending empty message!');
      return;
    }

    const message = {
      id: uuidv4(),
      uid: me.id,
      text,
      timestamp: new Date().getTime(),
    };
    console.log('Sending remote message: ', message);

    dispatch(broadcastMessage(cid, message));
  }

  useEffect(() => {
    dispatch(rtcCreateOffer(cid, me));
  }, []);

  useEffect(() => {
    const client = getClient();
    messages.forEach((m) => {
      if (!m.attachment || progresses[m.id]) {
        return;
      }
      setProgresses((old) => {
        return { ...old, [m.id]: { progress: 0, numPeers: 0 } };
      });
      const torrent = client.get(m.attachment);
      if (torrent) {
        // TODO refactor
        const rootElm = document.querySelector(`#at-${m.id}`) as HTMLElement;
        appendFileTo(torrent, rootElm);
        return;
      }

      downloadTorrent((torrent) => {
        const updateProgress = (torrent: Torrent) => {
          setProgresses((old) => {
            return {
              ...old,
              [m.id]: {
                progress: torrent.progress,
                numPeers: torrent.numPeers,
              },
            };
          });
          setDownloadSpeed(client.downloadSpeed);
          setUploadSpeed(client.uploadSpeed);
          if (torrent.progress === 1) {
            clearInterval(interval);
            // setProgresses(old => {
            //   delete old[m.id];
            //   return old;
            // })
            return;
          }
        };
        const interval = setInterval(() => updateProgress(torrent), 1000);
        updateProgress(torrent);

        // TODO refactor
        const rootElm = document.querySelector(`#at-${m.id}`) as HTMLElement;
        appendFileTo(torrent, rootElm);
      })(m.attachment);
    });
  }, [messages]);

  if (!channel) {
    return <>Channel Not Found</>;
  }

  return (
    <BaseLayout>
      <div className="h-screen pt-2 pb-4 overflow-y-scroll">
        <div className="px-2 py-2">
          <div className="">
            <h1 className="mt-2 mb-6 text-3xl font-semibold leading-6 text-gray-900">
              {channel.name || channel.id}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{channel.description}</p>
          </div>
        </div>
        <div className="sticky top-0 px-2 bg-gray-50 bg-opacity-25 pb-2">
          <input
            type="file"
            ref={fileRef}
            onChange={handleFileChanged}
            multiple
          />
          <div className="pt-0">
            <textarea
              ref={textareaRef}
              id="about"
              rows={2}
              className="p-2 shadow-lg focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 border"
              placeholder="Say Hello 👋"
            ></textarea>
          </div>
          <button
            type="button"
            className="my-2 px-4 py-2 border border-gray-300 rounded-md shadow-lg inline-flex items-center justify-center text-base font-medium text-white hover:bg-gray-300 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-gray-700 w-full"
            onClick={handleSubmit}
          >
            Send
            <svg
              style={{ transform: 'rotate(90deg)' }}
              className="ml-2 mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <div className="px-2 text-grey-700">
          {messages.map((m) => {
            const name = m.uid === me.id ? 'you' : m.uid.split('-')[0];
            const color = colorHash.hex(name);
            const Progress = () => {
              if (
                !m.attachment ||
                !progresses[m.id] ||
                progresses[m.id].progress === 1
              )
                return null;

              if (progresses[m.id].numPeers === 0) {
                return <Discovering />;
              }

              const { numPeers, progress } = progresses[m.id];
              return (
                <div className="text-gray-500">
                  Peers: {numPeers} Progress: {(100 * progress).toFixed(1)}%
                  Download: {prettierBytes(downloadSpeed)}
                </div>
              );
            };
            return (
              <div key={m.id} className="my-3 px-1 pt-3 pb-4">
                <div className="mb-1">
                  <span
                    style={{
                      color: color,
                      background: hex('#fff', color) < 2.2 ? '#333' : undefined,
                    }}
                    className="mr-1"
                  >
                    {name}
                  </span>
                  <span className="text-sm text-gray-400">
                    |{' '}
                    {format(
                      fromUnixTime(Math.round(m.timestamp / 1000)),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </span>
                </div>
                <div>
                  {m.text.split('\n').map((str, index) => (
                    <p key={index}>{str}</p>
                  ))}
                </div>
                <Progress />
                <div id={`at-${m.id}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseLayout>
  );
};

// TODO refactor to use React Component instead.
function appendFileTo(torrent: Torrent, rootElm: HTMLElement) {
  torrent.files.map(async (file) => {
    file.appendTo(rootElm);
    file.getBlobURL(function (err, url) {
      if (err) {
        console.log(err);
        return;
      }
      if (url) {
        const a = document.createElement('a');
        a.target = '_blank';
        a.download = file.name;
        a.href = url;
        a.textContent = 'Download ' + file.name;
        a.className = 'underline text-blue-500';
        rootElm.appendChild(a);
      }
    });
  });
}

function Discovering() {
  const [count, setCount] = useState(0);
  const ref = useRef(count);
  useEffect(() => {
    ref.current = count;
  }, [count]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (ref.current === 3) setCount(1);
      else setCount(ref.current + 1);
    }, 500);
    return function cleanup() {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="text-gray-500">Discovering Peers{'.'.repeat(count)}</div>
  );
}

export default ChannelPage;
