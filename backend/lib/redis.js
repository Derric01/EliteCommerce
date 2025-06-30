// Mock Redis client that always works
const mockRedis = {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    exists: async () => 0
};

console.log('Using mock Redis client (no caching)');

export default mockRedis;