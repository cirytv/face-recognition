import { Request, Response } from 'express'
import OpenAI from 'openai'
import axios from 'axios'
process.loadEnvFile()

// Obtener la clave de API desde el archivo .env
const apiKey = process.env.OPENAI_API_KEY
const prologApiUrl = 'http://localhost:4000/api/prolog/query'

// Inicializar el cliente OpenAI
const openai = new OpenAI({
  apiKey,
})
// Definimos la lista de consultas Prolog válidas
const prologQueries = [
  'student',
  'career',
  'attendance',
  'enrollment',
  'schedule',
  'total_school_days',
  'grace_period',
  'grace_rate_attendance',
  'was_present',
  'students_present_on_schedule',
  'student_attendance',
  'was_late',
  'student_status',
]
const systemContent = `
Eres un asistente que ayuda a resolver dudas sobre la asistencia de alumnos.

Debes convertir consultas de lenguaje natural del usuario identificando la reglas de Prolog que puede usarse para responder esa pregunta y responder en base a esas reglas.

Aquí tienes ejemplos de cómo se espera convertir consultas de lenguaje natural: 
- El usuario pregunta "El estudiante con el id 54 estuvo presente el dia 20 de diciembre del 2024 en su clase de la tarde con el id de horario 43?" deberías identificar que generar was_present(54, 43).
- El usuario pregunta "Puedes decirme los estudiantes que hay?" debería generar student(_,X). para obtener todos los estudiantes por nombre, en caso de que le pidiera id y nombre podria ser student(X,Y).
- Cualquier pregunta que pueda caer en el caso de poder contestarse con mi código Prolog existente debe ser realizada la consulta con mi codigo prolog, solo encárgate de identificar cuál de las reglas o hechos existentes puede usarse para resolverla.
- Entonces, si preguntara "que id tiene el estudiante con id 1?" deberías identificar que el hecho student(id, name). puede ser usado para responder a esa pregunta y el query final para la consulta prolog seria student(1, X). por que indica que nos interesa el nombre del estudiante con id 1 donde X va ser el nombre.
- Tambien puedes generar consultas prolog que no esten en los ejemplos pero que sean validas segun los hechos y reglas que te di en el mensaje anterior. como por ejemplo que pregunten por un hecho con algun parametro en especifico como si preguntara "cual es el id de la carrera con nomnbre computer science?" y la consulta fuera career(_, 'Computer Science', _). aunque no estuviera especificada, a lo que me refiero es que si esta en mis hechos o reglas pueden usarse como sean especificando los parametros que quieran como si fueran filtros aunque no este especificado en mis reglas o hechos.
- Si te pido una consulta como por ejemplo de algun hecho 'hechoEjemplo(param1,param2,param3).' pero sea "cual es param1 del hechoEjemplo que tiene el param2 igual a 3?" entonces solo deberia darme el param 1 que en este caso seria "param1" y la consulta prolog seria 'hechoEjemplo(X,3,_).' ignorando los otros parametros que no se pidieron, ESTO SE RESPETA EN TODAS LAS CONSULTAS.
- Cuando te pregunte algo y la consulta identificada sea por ejemplo "student(X,Y)." y la respuesta sea "Y = 3, X = name." al interpretarla solo debes responder algo como "Id de estudianteL: 3 y nombre: name." interpretandola de modo que sea en lenguaje natural como si fuera una conversacion, eres libre de interpretarla segun consideres mejor para la conversacion. ESTO ES CON TODAS LAS CONSULTAS.
- Cuando pregunte algo sobre cualquier pregunta como por ejemplo sobre asistencias o attendances la consulta seria "attendance(param1,param2,param3,param4)." segun los parametros que se requieran con mi.
Todas tus posibles respuestas deben ser segun los hechos y reglas de Prolog que te di en el mensaje anterior, si no puedes identificar una regla de Prolog para responder a la consulta, solo responde "No se pudo entender tu consulta." y no envies ninguna consulta al prolog.
Toma estos hechos de ejemplo de Prolog como base para responder a las consultas que se te presenten.

Todas las preguntas del usuario en lenguaje natural deben convertirse a consultas prolog para que puedan ser respondidas por la API de Prolog que luego esa respuesta de la API Prolog se interpreta denuevo a lenguaje natural y se muestra al usuario

POSIBLES CONSULTAS PROLOG:
        % Hechos de ejemplo basados en los modelos de datos mencionados te muestran que campos van en cada parametro, recuerda que estos son solo hechos de ejemplo y no necesariamente los que se usaran en la consulta, ya que en las consultas se mostraran con los datos que corresponden en el campo de cada parametro.

        % Hechos de estudiantes (Student); primer parametro es el id del estudiante y el segundo parametro es el nombre del estudiante
        student(id, name).

        % Hechos de carreras (Career); primer parametro es el id de la carrera, el segundo parametro es el nombre de la carrera y el tercer parametro es la descripcion de la carrera
        career(id, name, description).

        % Hechos de asistencias (Attendance); primer parametro es el id de la asistencia, el segundo parametro es el id de la inscripcion, el tercer parametro es el id del horario y el cuarto parametro es el estado de la asistencia
        attendance(id, enrollment id, schedule id, status).

        % Hechos de inscripciones (Enrollment); primer parametro es el id de la inscripcion, el segundo parametro es el id del estudiante, el tercer parametro es el id del curso y el cuarto parametro es la fecha de inscripcion (la fecha tiene este formato 2024-01-01 00:00:00+00)
        enrollment(id, student id, course id, enrollment date).

        % Hechos de horarios (Schedule); primer parametro es el id del horario, el segundo parametro es el nombre del horario, el tercer parametro es la descripcion del horario, el cuarto parametro es el id del curso, el quinto parametro es el id del profesor, el sexto parametro es el dia de la semana, el septimo parametro es la hora de inicio y el octavo parametro es la hora de finalizacion
        schedule(id, name, description, course id, professor id, day of the week, hora de inicio, hora de finalizacion).

        % Total days of school es un hecho que indica el total de dias de clases como parametro en este caso es 10
        total_school_days(10).

        % Grace period for tardiness in minutes es un hecho que indica el periodo de gracia para la tardanza en minutos como parametro en este caso es 15
        grace_period(15).

        % Acceptable attendance percentage es un hecho que indica el porcentaje de asistencia aceptable como parametro en este caso es 80
        grace_rate_attendance(80).

        % Rules

        % 1. Check if a student was present in a specific schedule es una regla que indica si un estudiante estuvo presente en un horario especifico; primer parametro es el id del horario y el segundo parametro es el id del estudiante
        was_present(StudentId, ScheduleId).

        % 2. Query the list of students present in a specific schedule es una regla que indica la lista de estudiantes presentes en un horario especifico; primer parametro es el id del horario y el segundo parametro es la lista de estudiantes y el segundo es una variable anonima que sirve para guardar la lista de los alumnos en ella
        students_present_on_schedule(ScheduleId, Students).
            

        % 3. Query the attendance status of a student for all schedules; primer parametro es el id del estudiante y el segundo parametro es la variable donde se guardara de lista de asistencias de los estudiantes
        student_attendance(StudentId, Attendances).
            

        % 4. Check if student was late in a specific schedule; primer parametro es el id del estudiante y el segundo parametro es el id del horario
        was_late(StudentId, ScheduleId).
            
        
        % 5. Check the status of a student in a specific schedule(works); primer parametro es el id del estudiante, el segundo parametro es el id del horario y el tercer parametro es el estado del estudiante en ese horario
        student_status(StudentId, ScheduleId, Status).

        En resumen todas las posibles consultas son estas:
        'student',
        'career',
        'attendance',
        'enrollment',
        'schedule',
        'total_school_days',
        'grace_period',
        'grace_rate_attendance',
        'was_present',
        'students_present_on_schedule',
        'student_attendance',
        'was_late',
        'student_status'


En resumen todas las posibles consultas son estas y te dare un ejemplo de posibles preguntas ( pueden hacerse preguntas o solicitudes diferentes pero deberian ser similares a estas y se definiria la consulta prolog segun los hechos y reglas que te di en el mensaje anterior ):

"cuales son los estudiantes que hay?" -> student(_,X).
"dame una lista de los estudiantes" -> student(Y,X).
"cual es el id del estudiante con nombre 'name'?" -> student(X,'name').
"cual es el id de la carrera con nomnbre computer science?" -> career(X, 'Computer Science', _). % donde la X indicaria el id de la carrera.
"El estudiante con el id 2 llego tarde al horario con id 3" -> was_present(2, 3).
"cuales son los enrollments?" -> enrollment(X,Y,Z,W).
"cuales son los horarios?" -> schedule(X,Y,Z,A,B,C,D,E).
"cuantos dias de clases hay?" -> total_school_days(X).
"cual es el periodo de gracia para la tardanza en minutos?" -> grace_period(X).
"cual es el porcentaje de asistencia aceptable?" -> grace_rate_attendance(X).
"El estudiante con id 1 estuvo presente en el horario con id 2?" -> was_present(1, 2).
"Los estudiantes presentes en el horario con id 3 son?" -> students_present_on_schedule(3, X).
"La asistencia del estudiante con id 1 es?" -> student_attendance(1, X).
"El estudiante con id 1 llego tarde al horario con id 2?" -> was_late(1, 2).
"El estado del estudiante con id 1 en el horario con id 2 es?" -> student_status(1, 2, X).
Recuerda que pueden variar las solicitudes y preguntas en lenguaje natural del solicitante pero siempre deberas convertirlas a consultas prolog validas segun los hechos y reglas que te di en el mensaje anterior.
De modo que si pregunto "Cuantos dias de clases hay?" o cualquier otra cosa que se entienda que es la misma solicitud como "Dame los dias totales de clase" la consulta de prolog seria la misma aunque no este especificada esa solicitud/pregunta -> total_school_days(X).


Las consultas que envies a la API Prolog siempre deben ser en lenguaje Prolog, por ejemplo, "El estudiante con el id 2 llego tarde al horario con id 3" y debe detectar la consulta o codigo prolog adecuado, segun el codigo prolog que le di que en este caso podria ser "was_present(studentId, scheduleId)." NUNCA debes enviar mas texto al API prolog, considera que todo lo que se envie al API Prolog debe ser una consulta prolog valida que si se envia un texto o cualquier cosa que nosea consulta prolog valida habra un error.
`

// Función para consultar la API de Prolog
async function lookupProlog(prologQuery: string) {
  try {
    const response = await axios.post(
      prologApiUrl,
      { query: prologQuery },
      { headers: { 'Content-Type': 'application/json' } }
    )
    return response.data
  } catch (error: any) {
    console.error('Error al consultar Prolog:', error.message)
    throw error
  }
}

// Función para interpretar el resultado de Prolog en lenguaje natural
function interpretPrologResult(query: string, result: any): string {
  if (query.includes('student(')) {
    return `Resultado de consulta sobre estudiantes es: ${result
      .map((r: string) => r.replace('X = ', '').trim())
      .join(', ')}.`
  } else if (query.includes('career(')) {
    return result.length > 0
      ? `Resultado de consulta sobre carreras: ${result
          .map((r: string) =>
            r
              .replace('X = ', 'Nombre: ')
              .replace('Y = ', 'Descripcion: ')
              .trim()
          )
          .join(', ')}.`
      : 'No se encontraron resultados para la consulta sobre carreras.'
  } else if (query.includes('was_present')) {
    return result.length > 0
      ? 'Sí, el estudiante estuvo presente.'
      : 'No, el estudiante no estuvo presente.'
  } else if (query.includes('students_present_on_schedule')) {
    return `Los estudiantes presentes en ese horario son: ${result.join(', ')}.`
  } else if (query.includes('student_attendance')) {
    return `La asistencia del estudiante es: ${result
      .map(([id, status]: [string, string]) => `Horario ${id}: ${status}`)
      .join(', ')}.`
  } else if (query.includes('was_late')) {
    return result.length > 0
      ? 'Sí, el estudiante llegó tarde.'
      : 'No, el estudiante no llegó tarde.'
  } else if (query.includes('student_status')) {
    return `El estado del estudiante en ese horario es: ${result[0]}.`
  } else {
    return 'No se pudo interpretar la respuesta correctamente.'
  }
}

// Handler para procesar la consulta del usuario
export const handleUserQuery = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userQuery: string = req.body.query

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userQuery },
      ],
    })

    const gptResponse = completion.choices[0].message?.content.trim()
    console.log('Respuesta de ChatGPT:', gptResponse)

    // Buscar una consulta Prolog válida en la respuesta de ChatGPT
    const prologQueryFound = prologQueries.find((query) =>
      gptResponse?.includes(query)
    )

    if (prologQueryFound && gptResponse) {
      console.log('Consulta Prolog identificada:', gptResponse)

      // Realizar la consulta a la API de Prolog
      const prologResult = await lookupProlog(gptResponse)

      // Interpretar la respuesta de Prolog y convertirla a lenguaje natural
      const naturalLanguageResponse = interpretPrologResult(
        gptResponse,
        prologResult
      )
      console.log('Respuesta en lenguaje natural:', naturalLanguageResponse)

      res.status(200).json({ response: naturalLanguageResponse })
    } else {
      console.log('No se pudo identificar una consulta de Prolog válida.')
      res.status(400).json({ error: 'No se pudo entender tu consulta.' })
    }
  } catch (error: any) {
    console.error('Error al procesar la consulta del usuario:', error.message)
    res.status(500).json({ error: 'Ocurrió un error al procesar tu consulta.' })
  }
}
