import todoCtrl, { injectDB } from "./todo.controller"
import { Request } from "jest-express/lib/request"
import { Response } from "jest-express/lib/response"
import { ObjectID } from "mongodb"

let conn
let db
let req
let res
let next = jest.fn()
describe("Todo API", async () => {
  const { MongoClient } = require("mongodb")
  const todos = [
    {
      name: "testing1",
      description: "a sample todo",
      dueDate: new Date(new Date() + 3),
      completed: false,
    },
    {
      name: "testing2",
      description: "a sample todo",
      dueDate: new Date(new Date() + 3),
      completed: false,
    },
  ]
  beforeAll(async () => {
    conn = await MongoClient.connect(global.__MONGO_URI__)
    db = await conn.db(global.__MONGO_DB_NAME)
  })

  afterAll(async () => {
    await conn.close()
    await db.close()
  })

  describe("VALID", async () => {
    beforeEach(() => {
      injectDB(db)
      req = new Request()
      res = new Response()
    })

    afterEach(() => {
      req.resetMocked()
      res.resetMocked()
      next.mockReset()
    })

    test("should return a list of todos", async () => {
      await todoCtrl.list(req, res, next)

      expect(res.json).toBeCalled()
    })

    test("should allow creation of new todo", async () => {
      req.setBody({ todo: todos[0] })
      await todoCtrl.create(req, res, next)

      expect(res.json).toBeCalled()
      let actual = res.json.mock.calls[0][0]
      expect(actual.todo._id).not.toBeUndefined()
      todos[0]._id = actual.todo._id
      expect(actual).toEqual({ todo: todos[0] })
    })

    test("should return a list of 1 todos", async () => {
      await todoCtrl.list(req, res, next)

      expect(res.json).toBeCalled()
      expect(res.json.mock.calls[0][0].todos).toEqual(todos.slice(0, 1))
    })

    test("should allow creation of second todo", async () => {
      req.setBody({ todo: todos[1] })
      await todoCtrl.create(req, res, next)

      expect(res.json).toBeCalled()
      let actual = res.json.mock.calls[0][0]
      todos[1]._id = actual.todo._id
      expect(actual).toEqual({ todo: todos[1] })
    })

    test("should return list of 2 todos", async () => {
      await todoCtrl.list(req, res, next)

      expect(res.json).toBeCalled()
      expect(res.json.mock.calls[0][0].todos.length).toEqual(2)
      expect(res.json.mock.calls[0][0].todos).toEqual(todos)
    })

    test("should allow updating a todo", async () => {
      const update = {
        name: "updated name",
        description: "an updated description",
        completed: true,
      }
      req.params.id = todos[0]._id
      req.setBody({ todo: update })
      await todoCtrl.update(req, res, next)

      expect(res.status).toBeCalledWith(200)

      // verify update
      todos[0] = { ...todos[0], ...update }
      res.resetMocked()
      await todoCtrl.list(req, res, next)
      expect(res.json.mock.calls[0][0].todos).toEqual(todos)
    })

    test("should allow deletion of todo", async () => {
      req.params.id = todos[0]._id
      await todoCtrl.delete(req, res, next)

      expect(res.status).toBeCalledWith(200)

      // verify deletion
      res.resetMocked()
      await todoCtrl.list(req, res, next)

      expect(res.json.mock.calls[0][0].todos).toEqual(todos.slice(1))
    })
  })

  describe("ERRORS", async () => {
    /**
     * Error Checking Section
     *
     * The next() fn should NEVER be called in this suite
     */
    let invalidID = "fizzlebazzle"
    let enoentID = new ObjectID()

    beforeEach(() => {
      injectDB(db)
      req = new Request()
      res = new Response()
    })

    afterEach(() => {
      req.resetMocked()
      res.resetMocked()
      next.mockReset()
    })

    test("update should respond with 404 if invalid _id", async () => {
      req.params.id = invalidID
      await todoCtrl.update(req, res, next)

      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(404)
    })

    test("update should respond with 404 if non-existent _id", async () => {
      req.params.id = enoentID
      await todoCtrl.update(req, res, next)

      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(404)
    })

    test("delete should respond with 404 if invalid _id", async () => {
      req.params.id = invalidID
      await todoCtrl.delete(req, res, next)

      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(404)
    })

    test("delete should respond with 404 if non-existent _id", async () => {
      req.params.id = enoentID
      await todoCtrl.delete(req, res, next)

      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(404)
    })
    test("create should respond with 406 if no todo in body", async () => {
      await todoCtrl.create(req, res, next)

      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(406)
    })
  })
})
