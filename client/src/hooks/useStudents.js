import { useState } from 'react'
import {
  addStudentApi,
  getStudentByIdApi,
  getStudentsApi,
} from '../middleware/students'

export function useStudents() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [students, setStudents] = useState(null)

  const getStudents = async () => {
    try {
      setLoading(true)
      const response = await getStudentsApi()
      setLoading(false)
      setStudents(response)
      console.log(response)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const addStudent = async (data) => {
    try {
      setLoading(true)
      const result = await addStudentApi(data)
      setLoading(false)
      return result
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const getStudentById = async (id) => {
    try {
      setLoading(true)
      const result = await getStudentByIdApi(id)
      setLoading(false)
      return result
    } catch (error) {
      setLoading(false)
      setError(error)
      console.error('Error getting student:', error)
      return null // Maneja el error retornando null o un valor por defecto
    }
  }

  return {
    loading,
    error,
    students,
    getStudents,
    getStudentById,
    addStudent,
  }
}
