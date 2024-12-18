import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from '@mui/material'
import Header from '../../components/Header'
import { Formik } from 'formik'
import * as yup from 'yup'
import { usePrologs } from '../../hooks/usePrologs'
import { useEffect, useState } from 'react'
import { useStudents } from '../../hooks/useStudents'
import { useSchedules } from '../../hooks/useSchedules'

const Dashboard = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { prologQuery, responses } = usePrologs()
  const { students, getStudents } = useStudents()
  const { schedules, getSchedules } = useSchedules()
  const [selectedOption, setSelectedOption] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: 'Hola, ¿qué deseas hacer?', query: '' },
  ])
  const [currentQuery, setCurrentQuery] = useState('')
  const [queryParams, setQueryParams] = useState({})
  const [scheduleId, setScheduleId] = useState(null)
  const [studentId, setStudentId] = useState(null)

  useEffect(() => {
    getStudents()
    getSchedules()
  }, [])

  useEffect(() => {
    console.log('StudentId:', studentId)
    console.log('ScheduleId:', scheduleId)
  }, [studentId, scheduleId])

  // Object to determine which parameters are needed for each query option
  const queryParamsNeeded = {
    was_present: ['StudentId', 'ScheduleId'],
    students_present_on_schedule: ['ScheduleId'],
    was_late: ['StudentId', 'ScheduleId'],
    schedule_list_on_day: ['ScheduleId'],
    new_attendances_on_day: ['ScheduleId'],
    new_attendances_today: [],
    students_in_schedule: ['ScheduleId'],
    student_status: ['StudentId', 'ScheduleId'],
  }

  const handleFormSubmit = async () => {
    console.log(
      'Form submission initiated with currentQuery:',
      currentQuery,
      'and queryParams:',
      queryParams
    )
    if (currentQuery) {
      const params = Object.values(queryParams).join(', ')
      const query = `${currentQuery}(${params})`
      console.log('Constructed query:', query + '.')
      try {
        await prologQuery({ query })
        setChatMessages([
          ...chatMessages,
          { type: 'response', text: responses.join('\n') },
        ])
      } catch (error) {
        console.error('Error during Prolog query:', error.message)
      }
      setCurrentQuery('')
      setQueryParams({})
    }
  }

  const handleOptionSelect = (option) => {
    const optionMap = {
      'estuvo presente en horario': 'was_present',
      'lista de estudiantes presentes en horario':
        'students_present_on_schedule',
      'revisar si llego tarde en un horario': 'was_late',
      'ver lista de horario en un dia': 'schedule_list_on_day',
      'ver nuevas asistencias en un dia': 'new_attendances_on_day',
      'ver nuevas asistencias de hoy': 'new_attendances_today',
      'lista de estudiantes en un horario': 'students_in_schedule',
      'ver estado de estudiante en un horario': 'student_status',
    }
    const englishOption = optionMap[option] || option

    setSelectedOption(englishOption)
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type: 'option', text: option },
    ])

    setCurrentQuery(englishOption)
    const params = queryParamsNeeded[englishOption] || []

    if (params.length > 0) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'system',
          text: `Ingresa ID de ${
            params[0] === 'StudentId' ? 'estudiante' : 'horario de clase'
          }:`,
        },
      ])
    } else {
      // For queries without parameters, we can submit directly
      handleFormSubmit()
    }
  }

  const handleStudentSelect = (event, setFieldValue) => {
    const selectedId = event.target.value
    console.log(selectedId)

    setFieldValue('studentId', selectedId)
    setStudentId(selectedId) // Actualiza el estado con el ID del estudiante seleccionado
    showScheduleSelect('StudentId')(selectedId)
  }

  const handleScheduleSelect = (event, setFieldValue) => {
    const selectedId = event.target.value
    console.log(selectedId)

    setFieldValue('scheduleId', selectedId)
    setScheduleId(selectedId)
    showScheduleSelect()
  }

  const showScheduleSelect = (param) => {
    return (value) => {
      setQueryParams((prevState) => ({
        ...prevState,
        [param]: value,
      }))
      setChatMessages([...chatMessages, { type: 'user', text: value }])

      if (queryParamsNeeded[selectedOption]) {
        const params = queryParamsNeeded[selectedOption]
        if (param === params[0] && params.length > 1) {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { type: 'system', text: 'Ingresa el ID del horario de clase:' },
          ])
        } else {
          // Log the value of the current parameter being entered
          console.log(`${param}:`, queryParams[param] || 'N/A')

          // Only check if all requirements are met if we are on the last parameter
          if (param === params[params.length]) {
            console.log('All requirements met')

            // If all required parameters are collected, submit the form
            if (studentId && scheduleId) {
              console.log('submit')
              // handleFormSubmit()
            }
          }
        }
      }
    }
  }

  // Array of options for the user to choose from, now matching your Prolog queries
  const options = [
    'estuvo presente en horario',
    'lista de estudiantes presentes en horario',
    'revisar si llego tarde en un horario',
    'ver lista de horario en un dia',
    'ver nuevas asistencias en un dia',
    'ver nuevas asistencias de hoy',
    'lista de estudiantes en un horario',
    'ver estado de estudiante en un horario',
  ]
  return (
    <Box m="20px">
      <Header title="Prolog" subtitle="Subtitle" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                gridColumn: 'span 4',
                border: '2px solid #070d0d',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
                '& > .button-container': {
                  gridColumn: 'span 4',
                  justifyContent: 'center !important',
                },
              }}
            >
              {chatMessages.map((message, index) => (
                <Box key={index} mb={2}>
                  {message.type === 'system' &&
                    message.text === 'Hola, ¿qué deseas hacer?' && (
                      <>
                        <InputLabel
                          sx={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            minWidth: '350px',
                            height: '60px',
                          }}
                        >
                          {message.text}
                        </InputLabel>
                        <Box display="flex" flexWrap="wrap">
                          {options.map((option, idx) => (
                            <Button
                              key={idx}
                              sx={{
                                marginRight: 1,
                                marginBottom: 1,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                minWidth: '350px',
                                height: '60px',
                              }}
                              onClick={() => handleOptionSelect(option)}
                              color="secondary"
                              variant="outlined"
                            >
                              {option}
                            </Button>
                          ))}
                        </Box>
                      </>
                    )}
                  {message.type === 'system' &&
                    message.text !== 'Hola, ¿qué deseas hacer?' && (
                      <InputLabel
                        sx={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          minWidth: '350px',
                          height: '60px',
                        }}
                      >
                        {message.text}
                      </InputLabel>
                    )}
                  {message.type === 'user' && (
                    <TextField value={message.text} disabled fullWidth />
                  )}
                  {message.type === 'response' && (
                    <TextField
                      value={message.text}
                      disabled
                      multiline
                      fullWidth
                    />
                  )}
                </Box>
              ))}

              {/* Render input fields conditionally based on selectedOption */}
              {/* Render input fields conditionally based on selectedOption */}
              {(() => {
                if (queryParamsNeeded[selectedOption]) {
                  const params = queryParamsNeeded[selectedOption]

                  // Select for StudentId
                  if (!queryParams.StudentId) {
                    return (
                      <Select
                        fullWidth
                        variant="filled"
                        label="Student ID"
                        onBlur={handleBlur}
                        onChange={(event) =>
                          handleStudentSelect(event, setFieldValue)
                        } // Usamos la nueva función
                        value={values.studentId || ''}
                        name="StudentId"
                        error={!!touched.studentId && !!errors.studentId}
                        sx={{ gridColumn: 'span 4' }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Selecciona un estudiante
                        </MenuItem>
                        {students?.map((student) => (
                          <MenuItem key={student.id} value={student.id}>
                            {student.name || student.id}
                          </MenuItem>
                        ))}
                      </Select>
                    )
                  }

                  // Select for ScheduleId, only if it's required after StudentId
                  if (params.length > 1 && !queryParams.ScheduleId) {
                    return (
                      <Select
                        fullWidth
                        variant="filled"
                        label="Schedule ID"
                        onBlur={handleBlur}
                        onChange={(event) =>
                          handleScheduleSelect(event, setFieldValue)
                        } // Usamos la nueva función
                        value={values.scheduleId || ''}
                        name="ScheduleId"
                        error={!!touched.scheduleId && !!errors.scheduleId}
                        sx={{ gridColumn: 'span 4' }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Selecciona un horario
                        </MenuItem>
                        {schedules?.map((schedule) => (
                          <MenuItem key={schedule.id} value={schedule.id}>
                            {schedule.name || schedule.id}
                          </MenuItem>
                        ))}
                      </Select>
                    )
                  }
                }
                return null
              })()}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}
const checkoutSchema = yup.object().shape({
  query: yup.string().required('required'),
  studentId: yup.number().required('Student ID is required'),
  scheduleId: yup.number().required('Student ID is required'),
})

const initialValues = {
  query: '',
  studentId: '',
  scheduleId: '',
}

export default Dashboard
