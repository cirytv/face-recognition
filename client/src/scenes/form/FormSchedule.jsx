import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import useMediaQuery from '@mui/material/useMediaQuery'
import Header from '../../components/Header'
import { useCourses } from '../../hooks/useCourses'
import { useProfessors } from '../../hooks/useProfessors'
import { useEffect } from 'react'
import { useSchedules } from '../../hooks/useSchedules'
import { toast } from 'react-toastify'

const FormSchedule = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { courses, getCourses } = useCourses()
  const { professors, getProfessors } = useProfessors()
  const { addSchedule } = useSchedules()

  useEffect(() => {
    getCourses()
    getProfessors()
  }, [])

  const handleFormSubmit = async (values) => {
    console.log('Form values:', values)
    try {
      const newSchedule = await addSchedule(values)
      console.log('Schedule created:', newSchedule)
      toast.success('Horario registrado', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      console.error('Error creating schedule:', error.message)
      toast.error('Error creating schedule', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return (
    <Box m="20px">
      <Header title="CREATE SCHEDULE" subtitle="Create a New Schedule" />

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
          handleChange,
          setFieldValue,
          handleSubmit,
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
              {/* Name of the schedule */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: 'span 4' }}
              />

              {/* Description */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: 'span 4' }}
              />

              {/* Course */}
              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 2' }}
                variant="filled"
              >
                <InputLabel>Course</InputLabel>
                <Select
                  name="course_id"
                  value={values.course_id}
                  onBlur={handleBlur}
                  onChange={(e) => setFieldValue('course_id', e.target.value)}
                >
                  {courses?.length > 0 ? (
                    courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No course available</MenuItem>
                  )}
                </Select>
              </FormControl>

              {/* Professor */}
              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 2' }}
                variant="filled"
              >
                <InputLabel>Professor</InputLabel>
                <Select
                  name="professor_id"
                  value={values.professor_id}
                  onBlur={handleBlur}
                  onChange={(e) =>
                    setFieldValue('professor_id', e.target.value)
                  }
                >
                  {professors?.length > 0 ? (
                    professors.map((professor) => (
                      <MenuItem key={professor.id} value={professor.id}>
                        {professor.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No professor available</MenuItem>
                  )}
                </Select>
              </FormControl>

              {/* Day of Week */}
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Day of Week"
                onBlur={handleBlur}
                onChange={(e) => setFieldValue('day_of_week', e.target.value)}
                value={values.day_of_week}
                name="day_of_week"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!touched.day_of_week && !!errors.day_of_week}
                helperText={touched.day_of_week && errors.day_of_week}
                sx={{ gridColumn: 'span 2' }}
              />

              {/* Start Time */}
              <TextField
                fullWidth
                variant="filled"
                type="time"
                label="Start Time"
                onBlur={handleBlur}
                onChange={(e) => setFieldValue('start_time', e.target.value)}
                value={values.start_time}
                name="start_time"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!touched.start_time && !!errors.start_time}
                helperText={touched.start_time && errors.start_time}
                sx={{ gridColumn: 'span 2' }}
              />

              {/* End Time */}
              <TextField
                fullWidth
                variant="filled"
                type="time"
                label="End Time"
                onBlur={handleBlur}
                onChange={(e) => setFieldValue('end_time', e.target.value)}
                value={values.end_time}
                name="end_time"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!touched.end_time && !!errors.end_time}
                helperText={touched.end_time && errors.end_time}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Schedule
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

const checkoutSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  course_id: yup
    .number()
    .positive('Must be a positive number')
    .required('Course ID is required'),
  professor_id: yup
    .number()
    .positive('Must be a positive number')
    .required('Professor ID is required'),
  day_of_week: yup.date().required('Day of week is required'),
  start_time: yup.string().required('Start time is required'),
  end_time: yup.string().required('End time is required'),
})

const initialValues = {
  name: '',
  description: '',
  course_id: '',
  professor_id: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
}

export default FormSchedule
