import { Bot } from '~/state/bots/botsSlice';

export const tmpPurchased: Bot[] = [...Array(10)].map((_, i) => ({
  id: `b83e2b45-85eb-46c1-9509-3598e86d1d69${i}`,
  uid: `zdpuAtz9efzfAP8AA9iWHq7onLpDHHceqp4GyHj827H925nVn${i}`,
  category: 2,
  name: 'baku_purchased',
  description: "Hey everyone. I'm baku.",
  avatar: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
  price: 199999,
  readme: `# Usage
      
      hogehogehogehoge
      
      ## Links
      
      - [http: //liber.live/](http: //liber.live/)
      - [http: //docs.liber.live/](http: //docs.liber.live/)`,
  sourceCode: `
      if (message.text.includes('ping')) {
	return 'pong';
      } else if (message.text.includes('hello')) {
	return 'hi ' + message.authorName;
      }`,
  examples: [
    {
      title: 'ping',
      input: 'ping',
      output: 'pong',
    },
    {
      title: 'greeting',
      input: 'hello <@>',
      output: 'pong',
    },
  ],
  keyValAddress: 'zdpuB1UwZHJbcStBbuVgKDzEvayVw1VhXoQTkK3TWnyPA3iRh',
  created: 1622195011,
  purchased: 1622197011,
}));

export const tmpListingOn: Bot[] = [...Array(1)].map((_, i) => ({
  id: `b83e2b45-85eb-46c1-9509-3598e86d1d69${i}`,
  uid: `zdpuAtz9efzfAP8AA9iWHq7onLpDHHceqp4GyHj827H925nVn${i}`,
  category: 2,
  name: 'baku',
  description: "Hey everyone. I'm baku.",
  avatar: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
  price: 199999,
  readme: `# Usage
      
      hogehogehogehoge
      
      ## Links
      
      - [http://liber.live/](http://liber.live/)
      - [http://docs.liber.live/](http://docs.liber.live/)`,
  sourceCode: `
      if (message.text.includes('ping')) {
	return 'pong';
      } else if (message.text.includes('hello')) {
	return 'hi ' + message.authorName;
      }
      return 'no matched';
      `,
  examples: [
    {
      title: 'ping',
      input: 'ping',
      output: 'pong',
    },
    {
      title: 'greeting',
      input: 'hello',
      output: 'hi',
    },
  ],
  keyValAddress: 'zdpuB1UwZHJbcStBbuVgKDzEvayVw1VhXoQTkK3TWnyPA3iRh',
  created: 1622195011,
}));
