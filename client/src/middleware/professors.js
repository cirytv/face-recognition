import axios from 'axios'

// export const getStudentsApi = async () => {
//   const { data } = await apiClient.get('/students')
//   return data
// }

export const addProfessorApi = async (student) => {
  const formData = new FormData()
  formData.append('image', student.image)
  formData.append('name', student.name)
  formData.append('email', student.email)

  const { data } = await axios.post(
    'http://localhost:4000/api/professors',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return data
}

export const getProfessorsApi = async () => {
  const { data } = await axios.get('http://localhost:4000/api/professors', {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const getProfessorByIdApi = async (id) => {
  const { data } = await axios.get(
    `http://localhost:4000/api/professors${id}`,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return data
}
