import axios from 'axios'

export const addCareerApi = async (career) => {
  const formData = new FormData()
  formData.append('name', career.name)
  formData.append('description', career.description)

  const { data } = await axios.post(
    'http://localhost:4000/api/careers',
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}

export const getCareersApi = async () => {
  const { data } = await axios.get('http://localhost:4000/api/careers', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}

export const getCareerByIdApi = async (id) => {
  const { data } = await axios.get(`http://localhost:4000/api/careers${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}
