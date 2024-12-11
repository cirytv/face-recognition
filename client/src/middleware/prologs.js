import axios from 'axios'

export const prologQueryApi = async (queryData) => {
  const formData = new FormData()
  formData.append('query', queryData.query)
  const response = await axios.post(
    'http://localhost:4000/api/prolog/query',
    formData,
    {
      headers: {
        'Content-Type': 'application/json', // Asegúrate de que este tipo de contenido sea correcto
      },
    }
  )

  return response.data // Devuelve los datos recibidos
}
