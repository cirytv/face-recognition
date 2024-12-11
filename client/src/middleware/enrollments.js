import axios from 'axios'

export const addEnrollmentApi = async (enrollment) => {
  // Asegúrate de que los datos se estén enviando correctamente
  const formData = new FormData()
  formData.append('student_id', enrollment.student_id)
  formData.append('course_id', enrollment.course_id)
  formData.append('enrollment_date', enrollment.enrollment_date)

  // Cambia el Content-Type a 'multipart/form-data' para enviar FormData correctamente
  const { data } = await axios.post(
    'http://localhost:4000/api/enrollments',
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return data
}
export const getEnrollmentsApi = async () => {
  const { data } = await axios.get('http://localhost:4000/api/enrollments', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}
export const getEnrollmentByIdApi = async (id) => {
  const { data } = await axios.get(
    `http://localhost:4000/api/enrollments${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}
