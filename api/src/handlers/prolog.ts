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
          `attendance(${att.id},${att.enrollment_id},${att.schedule_id},'${att.status}',').`
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

    // Generar hechos de ausencia basados en la ausencia de registros de asistencia
    const absences = []
    for (const enrollment of enrollments) {
      for (const schedule of schedules) {
        if (schedule.course_id === enrollment.course_id) {
          // Si el curso coincide
          const attendanceForDate = attendances.find(
            (att) =>
              att.enrollment_id === enrollment.id &&
              att.schedule_id === schedule.id
          )
          if (!attendanceForDate) {
            absences.push(
              `absent(${enrollment.student_id}, '${
                schedule.day_of_week.toISOString().split('T')[0]
              }').`
            )
          }
        }
      }
    }
    const absenceFacts = absences.join('\n')

    const staticFactsAndRules = `
      % Total days of school
      total_school_days(10).

      % Grace period for tardiness in minutes
      grace_period(15).

      % Acceptable attendance percentage
      grace_rate_attendance(80).

      % Rules

      % 1. Check if a student was present on a specific date
      was_present(StudentId, Date) :-
          attendance(_, EnrollmentId, _, Date, ArrivalTime, _),
          enrollment(EnrollmentId, StudentId, _, _),
          ArrivalTime \\= ''.

      % 2. Query the list of students present on a specific date
      students_present_on_date(Date, Students) :-
          findall(StudentName, 
                  (attendance(_, EnrollmentId, _, Date, ArrivalTime, _),
                   enrollment(EnrollmentId, StudentId, _, _),
                   student(StudentId, StudentName),
                   ArrivalTime \\= ''),
                  Students).

      % 3. Query the attendance of a student on all dates
      student_attendance(StudentId, Attendances) :-
          findall([Date, ArrivalTime, DepartureTime], 
                  (attendance(_, EnrollmentId, _, Date, ArrivalTime, DepartureTime),
                   enrollment(EnrollmentId, StudentId, _, _)),
                  Attendances).

      % 4. Count the number of attendances for a student
      count_attendances(StudentId, Count) :-
          findall(_, 
                  (attendance(_, EnrollmentId, _, _, ArrivalTime, _),
                   enrollment(EnrollmentId, StudentId, _, _),
                   ArrivalTime \\= ''),
                  Attendances),
          length(Attendances, Count).

      % 5. Calculate the attendance percentage of a student (simplified)
      attendance_percentage(StudentId, Percent) :-
          count_attendances(StudentId, Attended),
          total_school_days(TotalDays),
          Percent is (Attended * 100) / TotalDays.

      % 6. Determine if a student meets the acceptable attendance threshold
      meets_attendance_threshold(StudentId) :-
          attendance_percentage(StudentId, Percent),
          grace_rate_attendance(Threshold),
          Percent >= Threshold.

      % 7. List students who were late on a specific date
      students_late_on_date(Date, LateStudents) :-
          grace_period(GracePeriod),
          findall(StudentName,
                  (attendance(_, EnrollmentId, _, Date, ArrivalTime, _),
                   enrollment(EnrollmentId, StudentId, _, _),
                   schedule(_, _, _, _, _, StartTime, _),
                   parse_time(ArrivalTime, ArrivalMinutes),
                   parse_time(StartTime, StartMinutes),
                   LateMinutes is ArrivalMinutes - StartMinutes,
                   LateMinutes > GracePeriod,
                   student(StudentId, StudentName)),
                  LateStudents).

      % Helper for time parsing (assuming time is in format 'HH:MM')
      parse_time(Time, Minutes) :-
          split_string(Time, ":", "", [Hours, MinutesS]),
          number_string(Hour, Hours),
          number_string(Minute, MinutesS),
          Minutes is Hour * 60 + Minute.

      % 8. Determine the day with the most absences for a student (simplified)
      most_absences_day(StudentId, Day) :-
          findall(Day-Count,
                  (aggregate(count, 
                             Date^(absent(StudentId, Date), 
                                   day_of_week(Date, Day)), 
                             Count)),
                  DaysAndCounts),
          max_member(Day-_, DaysAndCounts).

      % Modificación para generar ausencias dinámicamente
      absent(StudentId, Date) :-
          enrollment(_, StudentId, CourseId, _),
          schedule(_, _, _, CourseId, _, Date, _, _),
          not(attendance(_, _, _, Date, _, _)).
    `

    const program = `
      ${studentFacts}
      ${careerFacts}
      ${attendanceFacts}
      ${enrollmentFacts}
      ${scheduleFacts}
      ${absenceFacts}
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
                console.error('Error querying Prolog:', err)
                res.status(500).send({ error: 'Error executing Prolog query' })
              },
            })
          },
          error: (err) => {
            console.error('Error consulting Prolog:', err)
            res.status(500).json({ error: 'Error consulting Prolog' })
          },
        })
      },
      error: (err) => {
        console.error('Error clearing Prolog session:', err)
        res.status(500).json({ error: 'Error clearing Prolog session' })
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error executing Prolog query' })
  }
}
