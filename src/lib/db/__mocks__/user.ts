interface KeyValueStoreMock {
  set(key: string, val: unknown): void;
  get(key: string): unknown;
}

let mockData: DBData = {};

interface DBData {
  [key: string]: unknown;
}

export const mockUserDB = {
  set: (key: string, value: unknown) => (mockData[key] = value),
  get: (key: string) => mockData[key],
};

export const connectUserDB = (): KeyValueStoreMock => {
  return mockUserDB;
};

export const __setMockData = (data: DBData): void => {
  mockData = data;
};
