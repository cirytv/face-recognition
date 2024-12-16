import { Box, Button, TextField, useMediaQuery } from '@mui/material'
import Header from '../../components/Header'
import { Formik } from 'formik'
import * as yup from 'yup'
import { usePrologs } from '../../hooks/usePrologs'

const Dashboard = () => {
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const { prologQuery, responses } = usePrologs()

  const handleFormSubmit = async (values) => {
    console.log('Form values:', values)
    try {
      await prologQuery(values)
      console.log('Prolog Response: ', responses)
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  return (
    <Box m="20px">
      <Header title="Prolog" subtitle="Ask Something" />

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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Query"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.query}
                name="query"
                error={!!touched.query && !!errors.query}
                helperText={touched.query && errors.query}
                sx={{ gridColumn: 'span 4' }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                ask
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

const checkoutSchema = yup.object().shape({
  query: yup.string().required('required'),
})

const initialValues = {
  query: '',
}

export default Dashboard
