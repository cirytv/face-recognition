import { Request, Response } from 'express'
import pl from 'tau-prolog'
import fs from 'fs'
import path from 'path'
import Student from '../models/Student.model'
import Attendance from '../models/Attendance.model'
import Course from '../models/Course.model' // Asegúrate de tener este modelo
import Schedule from '../models/Schedule.model' // Asegúrate de tener este modelo
import Career from '../models/Career.model'
import Professor from '../models/Professor.model'
import Enrollment from '../models/Enrollment.model'

// Crear una nueva sesión Prolog
const session = pl.create(1000)

// Cargar el programa Prolog desde el archivo
const loadPrologProgram = (program: string) => {
  session.consult(program)
}

// Ejecutar una consulta Prolog
const queryProlog = (query: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    session.query(query.trim(), {
      success: () => {
        const results: any[] = []
        const getAnswers = () => {
          session.answer({
            success: (answer) => {
              if (answer) {
                results.push(session.format_answer(answer))
                getAnswers() // Continúa buscando más respuestas
              } else {
                resolve(results)
              }
            },
            fail: () => resolve(results),
            error: (err) => {
              console.error('Error in query execution:', err)
              reject(err)
            },
            limit: () => {
              console.warn('Resolution limit exceeded')
              resolve(results)
            },
          })
        }
        getAnswers()
      },
      error: (err) => {
        console.error('Prolog Query Error:', err)
        reject(err)
      },
    })
  })
}

// Handler para recibir consultas desde el frontend
export const handlePrologQuery = async (req: Request, res: Response) => {
  const { query } = req.body

  try {
    // Cargar el archivo prolog.pl
    const prologFilePath = path.join(__dirname, '../prolog/prolog.pl')
    const prologProgram = fs.readFileSync(prologFilePath, 'utf8')
    loadPrologProgram(prologProgram)

    // Cargar estudiantes desde la base de datos y convertirlos a hechos Prolog
    const students = await Student.findAll()
    const studentFacts = students
      .map((student) => `student(${student.id},${student.name}).`)
      .join('\n')

    // Cargar asistencias desde la base de datos
    const attendances = await Attendance.findAll()
    const attendanceFacts = attendances
      .map(
        (attendance) =>
          `attendance(${attendance.id},${attendance.enrollment_id}, ${
            attendance.schedule_id
          }, '${attendance.date.toISOString().split('T')[0]}', '${
            attendance.arrival_time
          }', '${attendance.departure_time}').`
      )
      .join('\n')

    // Cargar materias desde la base de datos (asegúrate de tener este modelo)
    const courses = await Course.findAll()
    const courseFacts = courses
      .map(
        (course) =>
          `course(${course.id}, '${course.name}', ${course.description}).`
      )
      .join('\n')

    // Cargar horarios desde la base de datos (asegúrate de tener este modelo)
    const schedules = await Schedule.findAll()
    const scheduleFacts = schedules
      .map(
        (schedule) =>
          `schedule(${schedule.id},${schedule.name}, ${schedule.course_id},${schedule.professor_id}, '${schedule.day_of_week}', '${schedule.start_time}', '${schedule.end_time}').`
      )
      .join('\n')

    // Cargar carreras desde la base de datos
    const careers = await Career.findAll()
    const careerFacts = careers
      .map(
        (career) =>
          `career(${career.id}, ${career.name},${career.description}).`
      )
      .join('\n')

    // Cargar profesores de la base de datos
    const professors = await Professor.findAll()
    const professorFacts = professors
      .map(
        (professor) =>
          `professor(${professor.id},${professor.name},${professor.email}).`
      )
      .join('\n')

    // Cargar enrollments de la base de datos
    const enrollments = await Enrollment.findAll()
    const enrollmentFacts = enrollments
      .map(
        (enrollment) =>
          `enrollment(${enrollment.id},${enrollment.student_id},${
            enrollment.course_id
          },${enrollment.enrollment_date.toISOString().split('T')[0]}).`
      )
      .join('\n')

    // Cargar todos los hechos en Prolog
    loadPrologProgram(studentFacts)
    loadPrologProgram(attendanceFacts)
    loadPrologProgram(courseFacts)
    loadPrologProgram(scheduleFacts)
    loadPrologProgram(careerFacts)
    loadPrologProgram(professorFacts)
    loadPrologProgram(enrollmentFacts)

    // Ejecutar la consulta Prolog
    const results = await queryProlog(query)

    console.log(studentFacts)

    console.log(results)

    res.status(200).send(results)
  } catch (error) {
    console.error(error) // Log the error for debugging purposes.

    res.status(500).json({ error: 'Error executing Prolog query' })
  }
}
