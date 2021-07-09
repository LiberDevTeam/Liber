export interface Example {
  title: string;
  input: string;
  output: string;
}

export interface Bot {
  id: string;
  uid: string;
  keyValAddress: string;
  created: number;
  qtySold: number;
  category: number;
  name: string;
  description: string;
  avatar: string;
  price: number;
  readme: string;
  sourceCode: string;
  examples: Example[];
}

export type BotPartialForUpdate = Omit<
  Bot,
  // These are the fields that cannot be updated.
  'id' | 'uid' | 'keyValAddress' | 'created' | 'qtySold'
>;
