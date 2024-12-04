import { useState } from 'react'
import { addCareerApi, getCareersApi } from '../middleware/careers'

export function useCareer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [careers, setCareers] = useState(null)

  const getCareers = async () => {
    try {
      setLoading(true)
      const response = await getCareersApi()
      setLoading(false)
      setCareers(response)
      console.log(response)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const addCareer = async (data) => {
    try {
      setLoading(true)
      const response = await addCareerApi(data)
      setLoading(false)
      return response
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  return {
    loading,
    error,
    careers,
    getCareers,
    addCareer,
  }
}
