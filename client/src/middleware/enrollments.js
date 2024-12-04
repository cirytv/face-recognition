import axios from 'axios'

export const addEnrollmentApi = async (enrollment) => {
  const formData = new FormData()
  formData.student_id('student_id', enrollment.student_id)
  formData.course_id('course_id', enrollment.course_id)
  formData.enrollment_date('enrollment_date', enrollment.enrollment_date)

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
