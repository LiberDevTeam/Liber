import type { Message } from '~/state/places/messagesSlice';

onmessage = (e: { data: [Message, string] }) => {
  const [message, sourceCode] = e.data;

  // eslint-disable-next-line no-new-func
  const f = new Function('message', 'name', sourceCode);
  const result = f(message.text, message.authorName);
  postMessage(result);
};
