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
import { useEnrollments } from '../../hooks/useEnrollments'
import { useStudents } from '../../hooks/useStudents'
import { useCourses } from '../../hooks/useCourses'
import { useEffect } from 'react'

const FormEnrollment = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { addEnrollment } = useEnrollments()
  const { courses, getCourses } = useCourses()
  const { students, getStudents } = useStudents()

  const handleFormSubmit = async (values) => {
    console.log(values)
    try {
      const newEnrollment = await addEnrollment(values)
      console.log('Enrollment created: ', newEnrollment)
    } catch (error) {
      console.error('Error creating enrollment:', error.message)
    }
  }
  useEffect(() => {
    getStudents()
    getCourses()
  }, [])

  useEffect(() => {
    getCourses()
  }, [])

  return (
    <Box m="20px">
      <Header title="CREATE ENROLLMENT" subtitle="Create a New Enrollment" />

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
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
              }}
            >
              {/* Date Picker */}
              <TextField
                fullWidth
                variant="filled"
                type="enrollment_date"
                label="Enrollment Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.enrollment_date}
                name="enrollment_date"
                InputLabelProps={{
                  shrink: true, // Asegura que la etiqueta no se superponga
                }}
                error={!!touched.enrollment_date && !!errors.enrollment_date}
                helperText={touched.enrollment_date && errors.enrollment_date}
                sx={{ gridColumn: 'span 4' }}
              />

              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 2' }}
                variant="filled"
              >
                <InputLabel>Courses</InputLabel>
                <Select
                  name="course_id"
                  value={values.course_id}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  {courses?.length > 0 ? (
                    students.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No course available</MenuItem>
                  )}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 2' }}
                variant="filled"
              >
                <InputLabel>Students</InputLabel>
                <Select
                  name="student_id"
                  value={values.student_id}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  {students?.length > 0 ? (
                    students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No student available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                create new enrollment
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

const checkoutSchema = yup.object().shape({
  student_id: yup
    .number()
    .positive('must be a positive number')
    .required('required'),
  course_id: yup
    .number()
    .positive('must be a positive number')
    .required('required'),
  enrollment_date: yup
    .date()
    .required('Date is required')
    .typeError('Invalid date format'),
})

const initialValues = {
  student_id: '',
  course_id: '',
  enrollment_date: '',
}

export default FormEnrollment
