import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"

const app = express()

app.use(cors())
process.env.NODE_ENV !== "prod" && app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export default app
