import { Bot } from '~/state/bots/types';
import { Mention, Message } from '~/state/places/type';
import { User } from '~/state/users/type';

export function resolveBotFromContent(
  content: Array<string | Mention>,
  bots: Bot[]
): Bot[] {
  return (
    content.filter((value) => {
      if (typeof value === 'string' || value.bot === false) {
        return false;
      }
      return true;
    }) as Mention[]
  ).map((mention) => {
    return bots.find((bot) => bot.id === mention.userId);
  }) as Bot[];
}

export function runBotWorker(
  message: Message,
  botCode: string
): Promise<string> {
  const worker = new Worker('/worker.js');
  return new Promise((resolve, reject) => {
    worker.onmessage = ({ data }) => {
      resolve(data);
    };
    worker.onerror = (e) => {
      reject(e);
    };
    worker.postMessage([message, botCode]);
  });
}

export function isBot(target: Bot | User): target is Bot {
  return 'sourceCode' in target;
}

const messageContentRegex = /@(\S*)/gm;
export const parseText = ({
  text,
  users,
  bots,
}: {
  text: string;
  users: User[];
  bots: Bot[];
}): Array<string | Mention> => {
  const matches = [...text.matchAll(messageContentRegex)];
  let pos = 0;
  const result: Array<string | Mention> = [];

  const mentionTarget: Array<Bot | User> = [...bots, ...users];

  matches.forEach((match) => {
    const nextPos = (match.index as number) + match[0].length;

    // TODO: Use id for matching
    const target = mentionTarget.find((user) => user.name === match[1]);
    if (target) {
      // Prevent adding empty string
      if (pos !== match.index) {
        result.push(text.slice(pos, match.index));
      }
      result.push({ userId: target?.id, name: match[1], bot: isBot(target) });
      pos = nextPos;
    }
  });

  if (pos !== text.length) {
    result.push(text.slice(pos, text.length));
  }

  return result;
};
