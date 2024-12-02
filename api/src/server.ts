import express from 'express'
import colors from 'colors'
import db from './config/db'
import { router_attendance, router_students } from './router'

// connect to database
export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    console.log(colors.blue('successful database connection!'))
  } catch (error) {
    console.log(error)

    console.log(colors.red.bold('error!'))
  }
}
connectDB()

// Instance express
const server = express()

// Read form data
server.use(express.json())

// students
server.use('/api/students', router_students)
// attendances
server.use('/api/attendance', router_attendance)

export default server
