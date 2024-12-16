import { useState } from 'react'
import { prologQueryApi } from '../middleware/prologs'

export function usePrologs() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [responses, setResponses] = useState([]) // Inicializa como un array vacío para evitar null

  const prologQuery = async (query) => {
    try {
      setLoading(true)
      const response = await prologQueryApi(query)
      setLoading(false)
      setResponses(response) // Asegúrate de que response es lo que esperas, un array de resultados
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  return {
    loading,
    error,
    responses,
    prologQuery,
  }
}
