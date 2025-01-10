import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    styled,
    useMediaQuery,
  } from '@mui/material'
  import Header from '../../components/Header'
  import { Formik } from 'formik'
  import * as yup from 'yup'
  import { useStudents } from '../../hooks/useStudents'
  import * as faceapi from 'face-api.js'
  import { useEffect, useRef, useState } from 'react'
  import { Button as MuiButton } from '@mui/material'
  import CloudUploadIcon from '@mui/icons-material/CloudUpload'
  import { useEnrollments } from '../../hooks/useEnrollments'
  import { useSchedules } from '../../hooks/useSchedules'
  import { useCourses } from '../../hooks/useCourses'
  import { useAttendances } from '../../hooks/useAttendances'
  
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })
  
  const FaceRecognition = () => {
    const isNonMobile = useMediaQuery('(min-width:600px)')
    const { students, getStudents, getStudentById } = useStudents()
    const { enrollments, getEnrollments } = useEnrollments()
    const { schedules, getSchedules } = useSchedules()
    const { courses, getCourses } = useCourses()
    const { addAttendance } = useAttendances()
  
    const canvasRef1 = useRef(null)
    const canvasRef2 = useRef(null)
  
    // State to control visibility of image fields
    const [showRefImage, setShowRefImage] = useState(false)
    const [showImageToCompare, setShowImageToCompare] = useState(false)
    const [studentImage, setStudentImage] = useState('') // Estado para la URL de la imagen de referencia
    const [selectedStudentId, setSelectedStudentId] = useState('') // Nuevo estado para el ID del estudiante seleccionado
  
    useEffect(() => {
      getStudents() // Obtener la lista de estudiantes al montar el componente
      getEnrollments()
      getSchedules()
      getCourses()
      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ])
    }, [])
  
    const handleCreateAttendance = async (values) => {
      try {
        const newAttendance = await addAttendance(values)
        console.log('Attendance created: ', newAttendance)
      } catch (error) {
        console.error('Error creating attendance:', error.message)
      }
    }
  
    const handleFormSubmit = async (values) => {
      const valuesWithStatus = {
        ...values,
        status: 'present', // Añadimos el campo status con el valor 'present'
      }
      console.log(`schedule_id: ${valuesWithStatus.schedule_id}`)
      console.log(`enrollment_id: ${valuesWithStatus.enrollment_id}`)
      console.log(`status: ${valuesWithStatus.status}`)
  
      try {
        // Aquí cargamos las imágenes para el reconocimiento facial
        const [refImage, imageToCompare] = await Promise.all([
          faceapi.fetchImage(studentImage),
          faceapi.fetchImage(URL.createObjectURL(values.image)),
        ])
  
        // Generate description for reference face
        const refFaceAiData = await faceapi
          .detectAllFaces(refImage)
          .withFaceLandmarks()
          .withFaceDescriptors()
  
        // Generate descriptions for face to check
        const facesToCheckAiData = await faceapi
          .detectAllFaces(imageToCompare)
          .withFaceLandmarks()
          .withFaceDescriptors()
  
        // If there's a reference face and a face to check then...
        if (refFaceAiData.length > 0 && facesToCheckAiData.length > 0) {
          const faceMatcher = new faceapi.FaceMatcher(refFaceAiData)
          const canvas1 = canvasRef1.current
          const canvas2 = canvasRef2.current
  
          // Ajustamos las dimensiones de los canvas para que coincidan con las imágenes
          faceapi.matchDimensions(canvas1, refImage)
          faceapi.matchDimensions(canvas2, imageToCompare)
  
          // Función para dibujar de manera asíncrona con mayor tamaño de elementos
          const drawOnCanvas = (canvas, faces, label) => {
            faces.forEach((detection) => {
              const box = detection.detection.box
              const drawBox = new faceapi.draw.DrawBox(box, {
                label: label,
                lineWidth: 15,
                boxColor: 'blue',
                drawLabelOptions: {
                  fontSize: 44,
                  fontColor: 'white',
                  padding: 10,
                },
              })
              drawBox.draw(canvas)
  
              // Incrementar el tamaño de los puntos de referencia
              faceapi.draw.drawFaceLandmarks(canvas, detection, {
                lineWidth: 3,
                drawLines: true,
                color: 'blue',
              })
            })
          }
  
          // Usamos requestAnimationFrame para no bloquear la UI
          requestAnimationFrame(() => {
            drawOnCanvas(canvas1, refFaceAiData, 'Reference')
            facesToCheckAiData.forEach((detection, index) => {
              const { descriptor } = detection
              const bestMatch = faceMatcher.findBestMatch(descriptor)
              const matchPercentage = (1 - bestMatch.distance) * 100 // Calcular porcentaje de similitud
              const label = bestMatch.toString()
  
              console.log(`Match Result for face ${index + 1}: ${label}`)
              if (label.includes('unknown')) {
                console.log('This face is not recognized.')
              } else {
                console.log(
                  `This face matches with: ${
                    label.split(' ')[0]
                  } with ${matchPercentage.toFixed(2)}% match.`
                )
  
                // addAttendance
                handleCreateAttendance(valuesWithStatus)
              }
              drawOnCanvas(
                canvas2,
                [detection],
                `${label.split(' ')[0]} (${matchPercentage.toFixed(2)}%)`
              )
            })
          })
        } else {
          console.log('No faces detected in one or both images.')
        }
      } catch (error) {
        console.error('Error:', error.message)
      }
    }
  
    const [selectedScheduleId, setSelectedScheduleId] = useState('')
  
    const handleEnrollmentSelect = async (event, setFieldValue) => {
      const selectedId = event.target.value
      setFieldValue('enrollment_id', selectedId)
  
      // Find the selected enrollment
      const selectedEnrollment = enrollments.find(
        (e) => e.id === parseInt(selectedId)
      )
      if (selectedEnrollment) {
        // Filter schedules by the course_id of the selected enrollment
        const now = new Date()
        const currentSchedules = schedules.filter((schedule) => {
          const scheduleDate = new Date() // We use the current date for simplicity
          const [hours, minutes, seconds] = schedule.start_time
            .split(':')
            .map(Number)
          const [endHours, endMinutes, endSeconds] = schedule.end_time
            .split(':')
            .map(Number)
  
          scheduleDate.setHours(hours, minutes, seconds, 0)
          const endDate = new Date(scheduleDate)
          endDate.setHours(endHours, endMinutes, endSeconds, 0)
  
          return (
            schedule.course_id === selectedEnrollment.course_id &&
            now >= scheduleDate &&
            now <= endDate
          )
        })
  
        if (currentSchedules.length > 0) {
          // Here we're just selecting the first schedule that matches, but you might want to show all or let the user choose
          const firstSchedule = currentSchedules[0]
          console.log('Schedule for the current time:', firstSchedule)
          setFieldValue('schedule_id', firstSchedule.id)
          setSelectedScheduleId(firstSchedule.id)
        } else {
          // No schedule matches current time
          setFieldValue('schedule_id', '')
          setSelectedScheduleId('')
          console.log('No schedule available at the current time or student')
        }
      }
    }
    // Aquí ajustamos el onChange para manejar la selección asincrónicamente
    const handleStudentSelect = async (event, setFieldValue) => {
      const selectedId = event.target.value
      setFieldValue('refImageURL', selectedId) // Actualiza el valor para la validación y submit
      setSelectedStudentId(selectedId) // Actualiza el estado con el ID del estudiante seleccionado
  
      if (selectedId) {
        try {
          const student = await getStudentById(selectedId)
          setStudentImage(`http://localhost:4000/Images/${student.image}`)
          setShowRefImage(true)
        } catch (error) {
          setStudentImage('') // Limpiar la imagen si hay un error
          setShowRefImage(false)
          console.error('Student not found:', error.message)
        }
      } else {
        setStudentImage('')
        setShowRefImage(false)
      }
    }
  
    return (
      <Box m="20px">
        <Header title="Face-Api" subtitle="Face Recognition" />
  
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
                }}
              >
                <Select
                  fullWidth
                  variant="filled"
                  label="Student ID"
                  onBlur={handleBlur}
                  onChange={(event) => handleStudentSelect(event, setFieldValue)} // Usamos la nueva función
                  value={values.refImageURL}
                  name="refImageURL"
                  error={!!touched.refImageURL && !!errors.refImageURL}
                  sx={{ gridColumn: 'span 4' }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Selecciona un estudiante
                  </MenuItem>
                  {students &&
                    students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name || student.id}
                      </MenuItem>
                    ))}
                </Select>
  
                {showRefImage && (
                  <FormControl
                    fullWidth
                    sx={{ gridColumn: 'span 4' }}
                    variant="filled"
                  >
                    <InputLabel>Enrollments</InputLabel>
                    <Select
                      name="enrollment_id"
                      value={values.enrollment_id || ''} // Asegúrate de que si no hay un valor seleccionado, use una cadena vacía
                      onBlur={handleBlur}
                      onChange={(event) =>
                        handleEnrollmentSelect(event, setFieldValue)
                      }
                    >
                      {selectedStudentId && enrollments?.length > 0 ? (
                        enrollments.filter(
                          (enrollment) =>
                            enrollment.student_id === parseInt(selectedStudentId)
                        ).length > 0 ? (
                          enrollments
                            .filter(
                              (enrollment) =>
                                enrollment.student_id ===
                                parseInt(selectedStudentId)
                            )
                            .map((enrollment) => {
                              const course = courses.find(
                                (c) => c.id === enrollment.course_id
                              )
                              const courseName = course
                                ? course.name
                                : `Unknown Course (${enrollment.course_id})`
                              return (
                                <MenuItem
                                  key={enrollment.id}
                                  value={enrollment.id}
                                >
                                  Enrollment al curso: {courseName}
                                </MenuItem>
                              )
                            })
                        ) : (
                          <MenuItem disabled>
                            No enrollment available for this student
                          </MenuItem>
                        )
                      ) : (
                        <MenuItem disabled>
                          Please select a student first
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                )}
                {showRefImage && (
                  <MuiButton
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      backgroundColor: 'white',
                      color: 'black',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: 'lightgray',
                      },
                      gridColumn: 'span 4',
                    }}
                  >
                    Upload image to compare
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files[0]
                        setFieldValue('image', file)
                        setShowImageToCompare(!!file)
                      }}
                      name="image"
                    />
                  </MuiButton>
                )}
                {showRefImage && (
                  <Box position="relative" width="100%" height="auto">
                    <img
                      src={studentImage}
                      alt="Reference Image"
                      style={{ maxWidth: '100%', display: 'block' }}
                    />
                    <canvas
                      ref={canvasRef1}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    ></canvas>
                  </Box>
                )}
                {showImageToCompare && (
                  <Box position="relative" width="100%" height="auto">
                    <img
                      src={URL.createObjectURL(values.image)}
                      alt="Image to Compare"
                      style={{ maxWidth: '100%', display: 'block' }}
                    />
                    <canvas
                      ref={canvasRef2}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    ></canvas>
                  </Box>
                )}
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Recognize
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    )
  }
  
  const checkoutSchema = yup.object().shape({
    refImageURL: yup.number().required('Student ID is required'),
    enrollment_id: yup.number().required('Enrollment ID is required'),
    image: yup.mixed().required('Image is required'),
  })
  
  const initialValues = {
    refImageURL: '',
    enrollment_id: '',
    image: null,
  }
  
  export default FaceRecognition
  