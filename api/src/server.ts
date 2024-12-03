import express from 'express'
import colors from 'colors'
import db from './config/db'
import {
  router_attendance,
  router_classrooms,
  router_professors,
  router_students,
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
server.use('/api/attendance', router_attendance)
// professors
server.use('/api/professors', router_professors)
// classrooms
server.use('/api/classrooms', router_classrooms)

export default server
