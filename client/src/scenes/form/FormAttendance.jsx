import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import useMediaQuery from '@mui/material/useMediaQuery'
import Header from '../../components/Header'
import { useAttendances } from '../../hooks/useAttendances'
import { useEnrollments } from '../../hooks/useEnrollments'
import { useSchedules } from '../../hooks/useSchedules'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const FormAttendance = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { addAttendance } = useAttendances()
  const { enrollments, getEnrollments } = useEnrollments()
  const { schedules, getSchedules } = useSchedules()

  useEffect(() => {
    getEnrollments()
    getSchedules()
  }, [])

  const handleFormSubmit = async (values) => {
    console.log(values)
    try {
      const newAttendance = await addAttendance(values)
      console.log('Attendance created: ', newAttendance)
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
      toast.error('EError creating attendance', {
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

  return (
    <Box m="20px">
      <Header title="CREAR ASISTENCIA" subtitle="subtitle" />

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
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
              }}
            >
              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 4' }}
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
                  <MenuItem value="late">Late</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <Box sx={{ color: 'red', mt: 1 }}>{errors.status}</Box>
                )}
              </FormControl>

              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 4' }}
                variant="filled"
              >
                <InputLabel>Schedules</InputLabel>
                <Select
                  name="schedule_id"
                  value={values.schedule_id}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  {schedules?.length > 0 ? (
                    schedules.map((schedule) => (
                      <MenuItem key={schedule.id} value={schedule.id}>
                        {schedule.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No schedule available</MenuItem>
                  )}
                </Select>
                {touched.schedule_id && errors.schedule_id && (
                  <Box sx={{ color: 'red', mt: 1 }}>{errors.schedule_id}</Box>
                )}
              </FormControl>

              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 4' }}
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
                  {enrollments?.length > 0 ? (
                    enrollments.map((enrollment) => (
                      <MenuItem key={enrollment.id} value={enrollment.id}>
                        {enrollment.id}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No enrollment available</MenuItem>
                  )}
                </Select>
                {touched.enrollment_id && errors.enrollment_id && (
                  <Box sx={{ color: 'red', mt: 1 }}>{errors.enrollment_id}</Box>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                create new attendance
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
  schedule_id: yup.string().required('required'),
  enrollment_id: yup.string().required('required'),
})

const initialValues = {
  enrollment_id: '',
  schedule_id: '',
  status: '',
}

export default FormAttendance
