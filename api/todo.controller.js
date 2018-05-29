import { ObjectID } from "mongodb"

// setup db injection and collection handle
let todos
export function injectDB(db) {
  todos = db.collection("todos")
}

export default class TodoController {
  /**
   * Updates a todo in the database
   *
   * Returns a 404 if either the specified _id is invalid or there is no update
   * specified.
   *
   * Returns a 200 if successful
   *
   * Returns a 404 if no document could be found to update
   *
   * @param {Request} req The Request object
   * @param {Response} res The Response object
   * @param {Function} next The Next function
   */
  static async update(req, res, next) {
    const updatedTodo = req.body.todo
    if (!updatedTodo || !ObjectID.isValid(req.params.id)) {
      return res.status(404)
    }
    try {
      let updates = updatedTodo
      delete updates._id
      const todo = await todos.updateOne(
        { _id: new ObjectID(req.params.id) },
        { $set: { ...updates } },
      )
      if (todo.matchedCount) {
        console.log("sending 200")
        res.status(200).json({ status: "success" })
      } else {
        res.status(404)
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Deletes a todo from the database
   *
   * Returns a 404 if the specified _id is invalid
   *
   * Returns a 200 if successful
   *
   * Returns a 404 if no document could be found to delete
   *
   * @param {Request} req The Request object
   * @param {Response} res The Response object
   * @param {Function} next The Next function
   */
  static async delete(req, res, next) {
    const id = req.params.id
    if (!ObjectID.isValid(id)) {
      return res.status(404)
    }
    try {
      const status = await todos.deleteOne({ _id: new ObjectID(id) })
      if (status.deletedCount) {
        res.status(200).json({ status: "success" })
      } else {
        res.status(404)
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Gets all todos from the database
   *
   * Returns an object of the shape `{todos: [...]}` if successful
   *
   * Returns a 500 if there was an internal server error
   *
   * @param {Request} req The Request object
   * @param {Response} res The Response object
   * @param {Function} next The Next function
   */
  static async list(req, res, next) {
    try {
      const todoList = await todos
        .find()
        .sort({ dueDate: -1 })
        .toArray()

      if (Array.isArray(todoList)) {
        res.json({ todos: todoList })
      } else {
        res.status(500)
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Creates a new todo
   *
   * TODO: Add todo validation
   *
   * Returns an object of the shape `{todo: [...]}` that is comprised of
   * the passed todo and the inserted _id.
   *
   * Returns a 406 if no todo to insert is specified
   *
   * Returns a 500 if there was an internal server error
   *
   * @param {Request} req The Request object
   * @param {Response} res The Response object
   * @param {Function} next The Next function
   */
  static async create(req, res, next) {
    const todo = req.body.todo
    if (!todo) {
      return res.status(406)
    }
    try {
      const newTodo = await todos.insertOne({ ...todo })
      if (newTodo) {
        res.json({ todo: { ...todo, _id: newTodo.insertedId } })
      } else {
        res.status(500)
      }
    } catch (err) {
      next(err)
    }
  }
}
