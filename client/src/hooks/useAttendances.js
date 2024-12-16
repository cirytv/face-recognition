import { useState } from 'react'
import { addAttendanceApi, getAttendancesApi } from '../middleware/attendances'

export function useAttendances() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attendances, setAttendances] = useState(null)

  const getAttendances = async () => {
    try {
      setLoading(true)
      const response = await getAttendancesApi()
      setLoading(false)
      setAttendances(response)
      console.log(response)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const addAttendance = async (data) => {
    try {
      setLoading(true)
      const result = await addAttendanceApi(data)
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
    attendances,
    getAttendances,
    addAttendance,
  }
}
