interface KeyValueStoreMock {
  set(key: string, val: unknown): void;
  get(key: string): unknown;
}

let mockData: DBData = {};

interface DBData {
  [key: string]: unknown;
}

export const mockPrivateFieldsDB = {
  set: jest.fn((key: string, val: unknown) => {
    console.log(key);
    console.log(val);
    mockData[key] = val;
  }),
  get: (key: string) => mockData[key],
};

export const connectPrivateFieldsDB = (): KeyValueStoreMock => {
  return mockPrivateFieldsDB;
};

export const __setMockData = (data: DBData): void => {
  mockData = data;
};
