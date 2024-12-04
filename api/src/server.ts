import express from 'express'
import colors from 'colors'
import db from './config/db'
import {
  router_attendances,
  router_careers,
  router_enrollments,
  router_schedules,
  router_professors,
  router_students,
  router_courses,
} from './router'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

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

// Configuración de CORS para aceptar peticiones de cualquier origen
const corsOptions = {
  origin: '*', // Permitir todos los orígenes
}

server.use(cors(corsOptions))
// Crear carpeta de Images en caso de que no exista
const imagesPath = path.join(__dirname, 'Images')
if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath)
}

// Middleware para servir imágenes estáticas
server.use('/Images', express.static(imagesPath))
// Read form data
server.use(express.json())

// students
server.use('/api/students', router_students)
// attendances
server.use('/api/attendance', router_attendances)
// professors
server.use('/api/professors', router_professors)
// courses
server.use('/api/courses', router_courses)
// enrollments
server.use('/api/enrollments', router_enrollments)
// careers
server.use('/api/careers', router_careers)
// schedules
server.use('/api/schedules', router_schedules)

export default server
