import { useState } from 'react'
import { addCourseApi, getCoursesApi } from '../middleware/courses'

export function useCourses() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [courses, setCourses] = useState(null)

  const getCourses = async () => {
    try {
      setLoading(true)
      const response = await getCoursesApi()
      setLoading(false)
      setCourses(response)
      console.log(response)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  const addCourse = async (data) => {
    try {
      setLoading(true)
      const result = await addCourseApi(data)
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
    courses,
    getCourses,
    addCourse,
  }
}
