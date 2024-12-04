import axios from 'axios'

export const addCourseApi = async (course) => {
  const formData = new FormData()
  formData.append('name', course.name)
  formData.append('description', course.description)

  const { data } = await axios.post(
    'http://localhost:4000/api/courses',
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}

export const getCoursesApi = async () => {
  const { data } = await axios.get('http://localhost:4000/api/courses', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}

export const getCourseByIdApi = async (id) => {
  const { data } = await axios.get(`http://localhost:4000/api/courses${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}
