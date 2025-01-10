import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import {
  Box,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  FormControl,
  InputLabel,
} from '@mui/material'
import { useStudents } from '../../hooks/useStudents'
import { useEnrollments } from '../../hooks/useEnrollments'
import { useSchedules } from '../../hooks/useSchedules'
import { useCourses } from '../../hooks/useCourses'
import { useAttendances } from '../../hooks/useAttendances'
import Header from '../../components/Header'
import { Formik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const WebcamFaceRecognition = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { students, getStudents, getStudentById } = useStudents()
  const { enrollments, getEnrollments } = useEnrollments()
  const { schedules, getSchedules } = useSchedules()
  const { courses, getCourses } = useCourses()
  const { addAttendance } = useAttendances()

  const [showRefImage, setShowRefImage] = useState(false)
  const [studentImage, setStudentImage] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [matchResult, setMatchResult] = useState('')

  const handleVideoPlay = () => {
    if (!modelsLoaded) {
      console.warn('Models not loaded yet.')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      }
      faceapi.matchDimensions(canvas, displaySize)

      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceExpressions()

        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      }, 100)
    }
  }

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        await faceapi.nets.faceExpressionNet.loadFromUri('/models')
        setModelsLoaded(true)
      } catch (error) {
        console.error('Error loading models:', error)
      }
    }

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => console.error('Error accessing camera:', err))
    }

    const initApp = async () => {
      await loadModels()
      startVideo()
      getStudents()
      getEnrollments()
      getSchedules()
      getCourses()
    }

    initApp()

    // Register the play event only after models are loaded
    if (modelsLoaded && videoRef.current) {
      videoRef.current.addEventListener('play', handleVideoPlay)
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('play', handleVideoPlay)
      }
    }
  }, [modelsLoaded])

  // parte final, aqui ya es para conseguir el schedule y el status que deberia tener el registro del attendance y agregarlos a la lista, luego se llama al handleCreateAttendance enviandose la lista y se hace el post
  const handleCreateAttendance = async ({
    enrollment_id,
    schedule_id,
    status,
  }) => {
    console.log('Values for creating attendance:', {
      enrollment_id,
      schedule_id,
      status,
    })

    try {
      const newAttendance = await addAttendance({
        enrollment_id,
        schedule_id,
        status,
      })
      console.log('Attendance created:', newAttendance)
      toast.success('Asistencia registrada', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      console.error('Error creating attendance:', error.message)
      toast.error('Error al registrar la asistencia', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  const handleFormSubmit = async (values) => {
    console.log('Hello from handleFormSubmit')

    // Assuming 'enrollment_id' is selected in handleEnrollmentSelect
    const selectedEnrollment = enrollments.find(
      (e) => e.id === parseInt(values.enrollment_id)
    )

    if (selectedEnrollment) {
      const now = new Date()
      const currentSchedules = schedules.filter((schedule) => {
        const scheduleDate = new Date()
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
        const scheduleId = currentSchedules[0].id

        const valuesWithStatus = {
          ...values,
          schedule_id: scheduleId,
          status: 'present',
        }

        console.log(`schedule_id: ${valuesWithStatus.schedule_id}`)
        console.log(`enrollment_id: ${valuesWithStatus.enrollment_id}`)
        console.log(`status: ${valuesWithStatus.status}`)

        // Instead of calling API, we just log the values
        handleCreateAttendance(valuesWithStatus)
      } else {
        // comment this in case you're testing and not in a valid schedule time
        console.log('No schedule available at the current time or student')
        // test only - comment this if you're not testing this part of the code
        const valuesWithStatus = {
          ...values,
          schedule_id: 777,
          status: 'present',
        }

        console.log(`schedule_id: ${valuesWithStatus.schedule_id}`)
        console.log(`enrollment_id: ${valuesWithStatus.enrollment_id}`)
        console.log(`status: ${valuesWithStatus.status}`)

        // Instead of calling API, we just log the values
        handleCreateAttendance(valuesWithStatus)
      }
    } else {
      console.log('No valid enrollment selected')
    }
  }

  //
  const handleStudentSelect = async (event, setFieldValue) => {
    const selectedId = event.target.value
    setFieldValue('studentId', selectedId)
    setSelectedStudentId(selectedId)

    if (selectedId) {
      try {
        const student = await getStudentById(selectedId)
        setStudentImage(`http://localhost:4000/Images/${student.image}`)
      } catch (error) {
        setStudentImage('')
        console.error('Student not found:', error.message)
      }
    } else {
      setStudentImage('')
    }
  }

  const handleEnrollmentSelect = async (event, setFieldValue) => {
    setFieldValue('enrollment_id', event.target.value)
    console.log('handleMatchCheck')
    setShowRefImage(true) // Show the image after selecting the enrollment

    // Function to compare faces
    const compareFaces = async (refImageSrc, videoElement) => {
      try {
        const refImage = await faceapi.fetchImage(refImageSrc)
        const refFaces = await faceapi
          .detectAllFaces(refImage)
          .withFaceLandmarks()
          .withFaceDescriptors()

        if (refFaces.length === 0) {
          console.log('No se detectó rostro en la imagen de referencia.')
          // setMatchResult('No se detectó rostro en la imagen de referencia.')
          toast.error(
            'Error: No se detectó rostro en la imagen de referencia.',
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          )
          return
        }

        const videoFaces = await faceapi
          .detectAllFaces(videoElement)
          .withFaceLandmarks()
          .withFaceDescriptors()

        if (videoFaces.length === 0) {
          console.log('No se detectó rostro en la webcam.')
          // setMatchResult('No se detectó rostro en la webcam.')
          toast.error('Error: No se detectó rostro en la webcam.', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
          return
        }

        const faceMatcher = new faceapi.FaceMatcher(refFaces, 0.6) // 0.6 is the distance threshold
        videoFaces.forEach((videoFace, index) => {
          const bestMatch = faceMatcher.findBestMatch(videoFace.descriptor)
          const matchPercentage = (1 - bestMatch.distance) * 100

          console.log(
            `Match percentage for face ${index + 1}: ${matchPercentage.toFixed(
              2
            )}%`
          )

          if (bestMatch.label === 'unknown') {
            console.log(`Result for face ${index + 1}: No match found.`)
            setMatchResult(
              `Rostro ${index + 1}: No coincide con el estudiante seleccionado.`
            )
            toast.error(
              `Rostro ${
                index + 1
              }: No coincide con el estudiante seleccionado.`,
              {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            )
          } else {
            console.log(
              `Result for face ${index + 1}: Match found with ${
                bestMatch.label
              } - ${matchPercentage.toFixed(2)}% match.`
            )

            toast.success(
              `Result for face ${index + 1}: Match found with ${
                bestMatch.label
              } - ${matchPercentage.toFixed(2)}% match.`,
              {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            )
            setMatchResult(
              `Rostro ${index + 1}: Coincidencia encontrada con ${
                bestMatch.label
              } - ${matchPercentage.toFixed(2)}% match.`
            )

            // Call handleFormSubmit when there's a match
            handleFormSubmit({
              studentId: selectedStudentId,
              enrollment_id: event.target.value,
            })
          }
        })
      } catch (error) {
        console.error('Error al comparar rostros:', error)
        toast.error('Error al comparar rostros', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setMatchResult('Error al procesar la comparación de rostros.')
      }
    }

    // Call the comparison function with the student image and webcam
    if (videoRef.current && studentImage) {
      await compareFaces(studentImage, videoRef.current)
    }
  }

  return (
    <Box m={'20px'}>
      <Header title="Webcam + face-api.js" subtitle="Face Recognition" />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Reconocimiento Facial
        </Typography>

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
              {/* Box webcam */}
              <Box
                sx={{
                  position: 'relative',
                  width: '720px',
                  height: '560px',
                  border: '4px solid blue',
                }}
              >
                <video
                  ref={videoRef}
                  width="720"
                  height="560"
                  autoPlay
                  muted
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                ></video>
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                ></canvas>
              </Box>
              {/* Box form */}
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
                  onBlur={handleBlur}
                  onChange={(event) =>
                    handleStudentSelect(event, setFieldValue)
                  }
                  value={values.studentId}
                  name="studentId"
                  error={!!touched.studentId && !!errors.studentId}
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

                {selectedStudentId && (
                  <FormControl
                    fullWidth
                    sx={{ gridColumn: 'span 4' }}
                    variant="filled"
                  >
                    <InputLabel>Enrollments</InputLabel>
                    <Select
                      name="enrollment_id"
                      value={values.enrollment_id || ''}
                      onBlur={handleBlur}
                      onChange={(event) =>
                        handleEnrollmentSelect(event, setFieldValue)
                      }
                    >
                      {selectedStudentId && enrollments?.length > 0 ? (
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
                          {selectedStudentId
                            ? 'No enrollment available for this student'
                            : 'Please select a student first'}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                )}
              </Box>
              {/* Display the student image */}
              {showRefImage && (
                <Box mt={2}>
                  <Typography variant="body1" mt={2}>
                    {matchResult}
                  </Typography>
                  <img
                    src={studentImage}
                    alt="Student Image"
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                </Box>
              )}
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  )
}

const checkoutSchema = yup.object().shape({
  studentId: yup.number().required('Student ID is required'),
  enrollment_id: yup.number().required('Enrollment ID is required'),
})

const initialValues = {
  studentId: '',
  enrollment_id: '',
}

export default WebcamFaceRecognition
