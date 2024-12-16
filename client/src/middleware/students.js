import axios from 'axios'

export const addStudentApi = async (student) => {
  const formData = new FormData()
  formData.append('image', student.image)
  formData.append('name', student.name)
  formData.append('email', student.email)
  formData.append('phone', student.phone)
  formData.append('age', student.age)
  formData.append('career', student.career)

  const { data } = await axios.post(
    'http://localhost:4000/api/students',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return data
}

export const getStudentsApi = async () => {
  const { data } = await axios.get('http://localhost:4000/api/students', {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const getStudentByIdApi = async (id) => {
  const { data } = await axios.get(`http://localhost:4000/api/students/${id}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
