import isAbsoluteUrl from 'is-absolute-url';
import { Bot } from '~/state/bots/types';
import {
  Mention,
  Message,
  MessageContent,
  NormalMessage,
  Place,
  PlaceField,
  SystemMessage,
  URLText,
} from '~/state/places/type';
import { User } from '~/state/users/type';

export function isURLText(
  content: string | Mention | URLText
): content is URLText {
  if (typeof content === 'string') {
    return false;
  }

  if ('value' in content) {
    return true;
  }

  return false;
}

export function resolveBotFromContent(
  content: MessageContent,
  bots: Bot[]
): Bot[] {
  return (
    content.filter((c) => {
      if (typeof c === 'string') {
        return false;
      }
      if (isURLText(c)) {
        return false;
      }
      return c.bot;
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

const mentionRegex = /^@/;
export const parseText = ({
  text,
  users,
  bots,
}: {
  text: string;
  users: User[];
  bots: Bot[];
}): MessageContent => {
  const result: MessageContent = [];
  const mentionTarget: Array<Bot | User> = [...bots, ...users];
  const words = text.trim().split(' ');
  words.forEach((word) => {
    if (mentionRegex.test(word)) {
      const username = word.slice(1);
      const target = mentionTarget.find((user) => user.name === username);
      if (target && target?.id) {
        result.push({ userId: target.id, name: username, bot: isBot(target) });
        return;
      }
    }

    if (isAbsoluteUrl(word)) {
      result.push({ value: word });
      return;
    }

    if (result.length > 0 && typeof result[result.length - 1] === 'string') {
      result[result.length - 1] = `${result[result.length - 1]} ${word}`;
      return;
    }

    result.push(word);
  });

  return result;
};

export function isNormalMessage(message: Message): message is NormalMessage {
  if ('content' in message) {
    return true;
  }

  return false;
}

export function isSystemMessage(message: Message): message is SystemMessage {
  return isNormalMessage(message) === false;
}

const requiredPlaceFields: PlaceField[] = [
  'id',
  'name',
  'description',
  'avatarCid',
  'passwordRequired',
  'readOnly',
  'createdAt',
  'category',
  'timestamp',
  'messageIds',
  'unreadMessages',
  'permissions',
  'feedAddress',
  'keyValAddress',
  'bannedUsers',
];

export function checkPlaceValues(place: Partial<Place>): place is Place {
  return requiredPlaceFields.some((key) => place[key] === undefined) === false;
}
