import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import useMediaQuery from '@mui/material/useMediaQuery'
import Header from '../../components/Header'
import { useStudents } from '../../hooks/useStudents'
import { Button as MuiButton } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useCareer } from '../../hooks/useCareers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

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

const FormStudent = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { addStudent } = useStudents()
  const { careers, getCareers } = useCareer()

  useEffect(() => {
    getCareers()
  }, [])

  const handleFormSubmit = async (values) => {
    console.log(values)
    try {
      const newStudent = await addStudent(values)
      console.log('Student created: ', newStudent)
      toast.success('Estudiante registrado', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      console.error('Error creating student:', error.message)
      toast.error('Error creating student', {
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
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: 'span 4' }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: 'span 4' }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Age"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.age}
                name="age"
                error={!!touched.age && !!errors.age}
                helperText={touched.age && errors.age}
                sx={{ gridColumn: 'span 2' }}
              />

              <FormControl
                fullWidth
                sx={{ gridColumn: 'span 2' }}
                variant="filled"
              >
                <InputLabel>Careers</InputLabel>
                <Select
                  name="career"
                  value={values.career}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  {careers?.length > 0 ? (
                    careers.map((career) => (
                      <MenuItem key={career.id} value={career.id}>
                        {career.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No careers available</MenuItem>
                  )}
                </Select>
              </FormControl>

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
                Upload image
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files[0]
                    handleChange({
                      target: {
                        name: 'image',
                        value: file,
                      },
                    })
                  }}
                  name="image"
                />
              </MuiButton>
              {/* Display the uploaded image */}
              {values.image && (
                <Box
                  mt="20px"
                  display="flex"
                  justifyContent="center"
                  sx={{ gridColumn: 'span 4' }}
                >
                  <img
                    src={URL.createObjectURL(values.image)}
                    alt="uploaded"
                    width="400px"
                    height="400px"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}
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

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

const checkoutSchema = yup.object().shape({
  image: yup.mixed().required('Image is required'),
  name: yup.string().required('required'),
  email: yup.string().email().required('required'),
  phone: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('required'),
  age: yup
    .number()
    .nullable()
    .positive('must be a positive number')
    .required('required'),
  career: yup.string().required('required'),
})

const initialValues = {
  name: '',
  age: '',
  email: '',
  career: '',
  phone: '',
  image: null,
}

export default FormStudent
