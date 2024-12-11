import { useState } from 'react'
import { prologQueryApi } from '../middleware/prologs'

export function usePrologs() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [responses, setResponses] = useState(null)

  const prologQuery = async (query) => {
    try {
      setLoading(true)
      const response = await prologQueryApi(query) // Envía el query al middleware
      setLoading(false)
      setResponses(response)
      console.log(response)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  return {
    loading,
    error,
    responses,
    prologQuery,
  }
}
