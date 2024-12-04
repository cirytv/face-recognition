import { useState } from 'react'
import { addProfessorApi, getProfessorsApi } from '../middleware/professors'

export function useProfessors() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [professors, setProfessors] = useState(null)

  const getProfessors = async () => {
    try {
      setLoading(true)
      const response = await getProfessorsApi()
      setLoading(false)
      setProfessors(response)
      console.log(response)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const addProfessor = async (data) => {
    try {
      setLoading(true)
      const result = await addProfessorApi(data)
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
    professors,
    getProfessors,
    addProfessor,
  }
}
