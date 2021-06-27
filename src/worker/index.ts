import type { Message } from '~/state/places/type';

onmessage = (e: { data: [Message, string]; origin: string }) => {
  const [message, sourceCode] = e.data;
  console.log(message, sourceCode);

  // eslint-disable-next-line no-new-func
  const f = new Function('message', sourceCode);
  const result = f(message);
  postMessage(result);
};
