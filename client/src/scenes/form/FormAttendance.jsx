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
import { useStudents } from '../../hooks/useStudents'

const FormAttendance = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { addStudent } = useStudents()

  const handleFormSubmit = async (values) => {
    console.log(values)
    try {
      const newStudent = await addStudent(values)
      console.log('Student created: ', newStudent)
    } catch (error) {
      console.error('Error creating student:', error.message)
    }
  }

  return (
    <Box m="20px">
      <Header title="CREATE STUDENT" subtitle="Create a New Student Profile" />

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
                type="date"
                label="Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date}
                name="date"
                InputLabelProps={{
                  shrink: true, // Asegura que la etiqueta no se superponga
                }}
                error={!!touched.date && !!errors.date}
                helperText={touched.date && errors.date}
                sx={{ gridColumn: 'span 4' }}
              />

              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 2' }}
                variant="filled"
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="status"
                  error={!!touched.status && !!errors.status}
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <Box sx={{ color: 'red', mt: 1 }}>{errors.status}</Box>
                )}
              </FormControl>

              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 2' }}
                variant="filled"
              >
                <InputLabel>Enrollment</InputLabel>
                <Select
                  value={values.enrollment_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="enrollment_id"
                  error={!!touched.enrollment_id && !!errors.enrollment_id}
                >
                  <MenuItem value="">Select Enrollment</MenuItem>
                  <MenuItem value="1">Option 1</MenuItem>
                  <MenuItem value="2">Option 2</MenuItem>
                </Select>
                {touched.enrollment_id && errors.enrollment_id && (
                  <Box sx={{ color: 'red', mt: 1 }}>{errors.enrollment_id}</Box>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                create new student
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

const checkoutSchema = yup.object().shape({
  status: yup.string().required('required'),
  enrollment_id: yup.string().required('required'),
  date: yup
    .date()
    .required('Date is required')
    .typeError('Invalid date format'),
})

const initialValues = {
  enrollment_id: '',
  status: '',
  date: '',
}

export default FormAttendance
