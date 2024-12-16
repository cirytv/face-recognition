import { useState } from 'react'
import { addScheduleApi, getSchedulesApi } from '../middleware/schedules'

export function useSchedules() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [schedules, setSchedules] = useState(null)

  const getSchedules = async () => {
    try {
      setLoading(true)
      const response = await getSchedulesApi()
      setLoading(false)
      setSchedules(response)
      console.log(response)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const addSchedule = async (data) => {
    try {
      setLoading(true)
      const result = await addScheduleApi(data)
      setLoading(false)
      return result
    } catch (error) {
      setLoading(false)
      setError(error)
      throw error // Lanzamos el error para que se maneje en el componente si es necesario
    }
  }

  return {
    loading,
    error,
    schedules,
    getSchedules,
    addSchedule,
  }
}
