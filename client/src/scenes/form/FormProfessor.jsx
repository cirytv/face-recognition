import { Box, Button, styled, TextField } from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import useMediaQuery from '@mui/material/useMediaQuery'
import Header from '../../components/Header'
import { Button as MuiButton } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useProfessors } from '../../hooks/useProfessors'

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

const FormProfessor = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { addProfessor } = useProfessors()

  const handleFormSubmit = async (values) => {
    console.log(values)
    try {
      const newProfessor = await addProfessor(values)
      console.log('Professor created: ', newProfessor)
    } catch (error) {
      console.error('Error creating student:', error.message)
    }
  }

  return (
    <Box m="20px">
      <Header
        title="CREAR PROFESOR"
        subtitle="Create a New Professor Profile"
      />

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

const checkoutSchema = yup.object().shape({
  image: yup.mixed().required('Image is required'),
  name: yup.string().required('required'),
  email: yup.string().email().required('required'),
})

const initialValues = {
  image: null,
  name: '',
  email: '',
}

export default FormProfessor
