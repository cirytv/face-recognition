import axios from 'axios'

export const chatQueryApi = async (query) => {
  // Asegúrate de que `query` sea un string
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query provided')
  }

  const response = await axios.post(
    'http://localhost:4000/api/chat/query',
    { query }, // El servidor probablemente espera un objeto JSON con la clave "query"
    {
      headers: {
        'Content-Type': 'application/json', // Usa el encabezado correcto para JSON
      },
    }
  )

  return response.data // Devuelve los datos recibidos
}
