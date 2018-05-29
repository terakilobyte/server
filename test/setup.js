const MongodbMemoryServer = require("mongodb-memory-server")

const MONGO_DB_NAME = "test-todos"
const mongod = new MongodbMemoryServer.default({
  instance: {
    dbName: MONGO_DB_NAME,
  },
  binary: {
    version: "3.6.4",
  },
})

module.exports = function() {
  global.__MONGOD__ = mongod
  global.__MONGO_DB_NAME__ = MONGO_DB_NAME
}
