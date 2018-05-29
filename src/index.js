import app from "./server"
import Promise from "bluebird"
import { MongoClient } from "mongodb"
import { injectDB } from "../api/todo.controller"
import todos from "../api/todo.route"

// Register api routes
app.use("/api/todos", todos)

const port = process.env.PORT || 8000

MongoClient.connect(`${process.env.MONGODB_URI}`, {
  promiseLibrary: Promise,
  useNewUrlParser: true,
})
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(client => {
    injectDB(client.db(`${process.env.MONGODB_NS}`))
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })
