const mockLocalStorage = {
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => null,
  setItem: () => undefined,
};

const _storage = {
  clear: (...params) => window.localStorage.clear(...params),
  getItem: (...params) => JSON.parse(window.localStorage.getItem(...params)),
  key: (...params) => window.localStorage.key(...params),
  removeItem: (...params) => window.localStorage.removeItem(...params),
  setItem: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
};

const storage = typeof window !== 'undefined' ? _storage : mockLocalStorage;

if (storage === mockLocalStorage) {
  console.warn('userPostServce: localStorage is not available.');
}

const getItemKey = (id) => `userPosts-${id}`;

const cache = new Map();

function _findOrCreateByCacheKey(key) {
  if (!cache.has(key)) {
    const item = storage.getItem(key);
    cache.set(key, item !== null ? item : {});
  }
  return cache.get(key);
}
export async function findOrCreate(id) {
  return _findOrCreateByCacheKey(getItemKey(id));
}

export async function update(id, field, value) {
  const key = getItemKey(id);
  const item = _findOrCreateByCacheKey(key);
  if (!value) {
    delete item[field];
  } else {
    item[field] = value;
  }
  if (Object.keys(item).length > 0) {
    console.log(`updating item ${key} ${JSON.stringify(item)}`);
    storage.setItem(key, item);
  } else {
    console.log(`removing item ${key}`);
    storage.removeItem(key);
  }

  // no need to update Map cache... we updated an attribute to the Object already saved in cache.
  return true;
}
