import axios from 'axios'

// export const getStudentsApi = async () => {
//   const { data } = await apiClient.get('/students')
//   return data
// }

export const addStudentApi = async (student) => {
  const formData = new FormData()
  formData.append('name', student.name)
  formData.append('age', student.age)
  formData.append('image', student.image)

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

export const getStudentApi = async () => {
  const { data } = await axios.get('http://localhost:4000/api/students', {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
