import { Router } from "express"
import TodoCtrl from "./todo.controller"

const router = new Router()

// associate put, delete, and get(id)
router
  .route("/:id")
  .put(TodoCtrl.update)
  .delete(TodoCtrl.delete)

router
  .route("/")
  .get(TodoCtrl.list)
  .post(TodoCtrl.create)

export default router
