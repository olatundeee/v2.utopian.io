const LRU = require('lru-cache')

const cache = LRU()

const register = (server) => {
  server.method('cache', cache, {})
  // server.register(cache)
}

exports.plugin = {
  register,
  name: 'cache'
}
