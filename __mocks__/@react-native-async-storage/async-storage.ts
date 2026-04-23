// In-memory AsyncStorage mock. Jest auto-discovers this because it mirrors
// the node_modules path under __mocks__/. Call clear() in beforeEach to
// prevent state leakage between tests.

const store: Record<string, string> = {};

const AsyncStorage = {
  getItem: jest.fn(async (key: string) => store[key] ?? null),
  setItem: jest.fn(async (key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: jest.fn(async (key: string) => {
    delete store[key];
  }),
  clear: jest.fn(async () => {
    Object.keys(store).forEach((k) => delete store[k]);
  }),
  getAllKeys: jest.fn(async () => Object.keys(store)),
  multiGet: jest.fn(async (keys: string[]) =>
    keys.map((k) => [k, store[k] ?? null])
  ),
  multiSet: jest.fn(async (pairs: [string, string][]) => {
    pairs.forEach(([k, v]) => {
      store[k] = v;
    });
  }),
  multiRemove: jest.fn(async (keys: string[]) => {
    keys.forEach((k) => {
      delete store[k];
    });
  }),
};

export default AsyncStorage;
