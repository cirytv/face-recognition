import axios from 'axios'

export const addScheduleApi = async (schedule) => {
  // Ajustamos los datos para que coincidan con el modelo Schedule
  const formData = new FormData()
  formData.append('name', schedule.name)
  formData.append('description', schedule.description)
  formData.append('course_id', schedule.course_id)
  formData.append('professor_id', schedule.professor_id)
  formData.append('day_of_week', schedule.day_of_week)
  formData.append('start_time', schedule.start_time)
  formData.append('end_time', schedule.end_time)

  // Usamos JSON para enviar los datos ya que no estamos manejando archivos
  const { data } = await axios.post(
    'http://localhost:4000/api/schedules',
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}

export const getSchedulesApi = async () => {
  const { data } = await axios.get('http://localhost:4000/api/schedules', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}

// El siguiente método tiene un problema con la URL, debería ser:
export const getScheduleByIdApi = async (id) => {
  const { data } = await axios.get(
    `http://localhost:4000/api/schedules/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}
