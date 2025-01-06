import { Request, Response } from 'express'
import pl from 'tau-prolog'
import Student from '../models/Student.model'
import Career from '../models/Career.model'
import Attendance from '../models/Attendance.model'
import Enrollment from '../models/Enrollment.model'
import Schedule from '../models/Schedule.model'

const session = pl.create(1000)

// Handler para recibir consultas desde el frontend
export const handlePrologQuery = async (req: Request, res: Response) => {
  const { query } = req.body

  console.log(`Received query: ${query}`)

  try {
    // Cargar estudiantes, carreras, asistencias, inscripciones y horarios
    const students = await Student.findAll()
    const careers = await Career.findAll()
    const attendances = await Attendance.findAll()
    const enrollments = await Enrollment.findAll()
    const schedules = await Schedule.findAll()

    // Convertir los datos a hechos Prolog
    const studentFacts = students
      .map((student) => `student(${student.id},'${student.name}').`)
      .join('\n')
    const careerFacts = careers
      .map(
        (career) =>
          `career(${career.id}, '${career.name}','${career.description}').`
      )
      .join('\n')
    const attendanceFacts = attendances
      .map(
        (att) =>
          `attendance(${att.id},${att.enrollment_id},${att.schedule_id},'${att.status}').`
      )
      .join('\n')
    const enrollmentFacts = enrollments
      .map(
        (enr) =>
          `enrollment(${enr.id},${enr.student_id},${enr.course_id},'${
            enr.enrollment_date.toISOString().split('T')[0]
          }').`
      )
      .join('\n')
    const scheduleFacts = schedules
      .map(
        (sch) =>
          `schedule(${sch.id},'${sch.name}','${sch.description}',${
            sch.course_id
          },${sch.professor_id},'${
            sch.day_of_week.toISOString().split('T')[0]
          }','${sch.start_time}','${sch.end_time}').`
      )
      .join('\n')

    const staticFactsAndRules = `
        % Total days of school
        total_school_days(10).

        % Grace period for tardiness in minutes
        grace_period(15).

        % Acceptable attendance percentage
        grace_rate_attendance(80).

        % Rules

        % 1. Check if a student was present in a specific schedule (works)
        was_present(StudentId, ScheduleId) :-
            attendance(_, EnrollmentId, ScheduleId, 'present'),
            enrollment(EnrollmentId, StudentId, _, _).

        % 2. Query the list of students present in a specific schedule
        students_present_on_schedule(ScheduleId, Students) :-
            findall(StudentName, 
                    (attendance(_, EnrollmentId, ScheduleId, 'present'),
                    enrollment(EnrollmentId, StudentId, _, _),
                    student(StudentId, StudentName)),
                    Students).

        % 3. Query the attendance status of a student for all schedules
        student_attendance(StudentId, Attendances) :-
            findall([ScheduleId, Status], 
                    (attendance(_, EnrollmentId, ScheduleId, Status),
                    enrollment(EnrollmentId, StudentId, _, _)),
                    Attendances).

        % 4. Check if student was late in a specific schedule (works)
        was_late(StudentId, ScheduleId) :-
            attendance(_, EnrollmentId, ScheduleId, 'late'),
            enrollment(EnrollmentId, StudentId, _, _).
        
        % 5. Check the status of a student in a specific schedule(works)
        student_status(StudentId, ScheduleId, Status) :-
            attendance(_, EnrollmentId, ScheduleId, Status),
            enrollment(EnrollmentId, StudentId, _, _).
    `

    const program = `
      ${studentFacts}
      ${careerFacts}
      ${attendanceFacts}
      ${enrollmentFacts}
      ${scheduleFacts}
      ${staticFactsAndRules}
    `

    // Limpia la sesión Prolog antes de cargar el nuevo programa
    session.consult('', {
      success: () => {
        // Ahora puedes consultar el nuevo programa
        session.consult(program, {
          success: () => {
            const results = []

            session.query(query, {
              success: () => {
                session.answers((answer) => {
                  if (answer === false) {
                    console.log('Resultado bruto de Prolog:', results)
                    res.status(200).send(results)
                  } else {
                    const formattedAnswer = session
                      .format_answer(answer)
                      .replace(/ = /g, ' = ')
                    results.push(formattedAnswer)
                  }
                })
              },
              error: (err) => {
                // console.error('Error querying Prolog:', err)
                res.status(500).send({ error: 'Error executing Prolog query' })
              },
            })
          },
          error: (err) => {
            // console.error('Error consulting Prolog:', err)
            res.status(500).json({ error: 'Error consulting Prolog' })
          },
        })
      },
      error: (err) => {
        // console.error('Error clearing Prolog session:', err)
        res.status(500).json({ error: 'Error clearing Prolog session' })
      },
    })
  } catch (error) {
    // console.error(error)
    res.status(500).json({ error: 'Error executing Prolog query' })
  }
}
