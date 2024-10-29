import express from 'express'
import colors from 'colors'
import router_students from './router'
import db from './config/db'
import swaggerUi from 'swagger-ui-express'
// import swaggerSpec, { swaggerUiOptions } from './config/swagger'

// connect to database

export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    console.log(colors.blue('successful database connection!'))
  } catch (error) {
    console.log(colors.red.bold('error!'))
  }
}
connectDB()

// Instance express
const server = express()

// Read form data
server.use(express.json())

server.use('/api/students', router_students)

// Swagger Docs Router
// server.use(
//   '/docs',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec, swaggerUiOptions)
// )

export default server
