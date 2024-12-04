import { useState } from 'react'
import { addEnrollmentApi, getEnrollmentsApi } from '../middleware/enrollments'

export function useEnrollments() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [enrollments, setEnrollments] = useState(null)

  const getEnrollments = async () => {
    try {
      setLoading(true)
      const response = await getEnrollmentsApi()
      setLoading(false)
      setEnrollments(response)
      console.log(response)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const addEnrollment = async (data) => {
    try {
      setLoading(true)
      const result = await addEnrollmentApi(data)
      setLoading(false)
      return result
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  return {
    loading,
    error,
    enrollments,
    getEnrollments,
    addEnrollment,
  }
}
