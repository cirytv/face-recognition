import axios from 'axios'

export const addAttendanceApi = async (attendance) => {
  const formData = new FormData()
  formData.append('enrollment_id', attendance.enrollment_id)
  formData.append('schedule_id', attendance.schedule_id)
  formData.append('status', attendance.status)

  const { data } = await axios.post(
    'http://localhost:4000/api/attendances',
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}

export const getAttendancesApi = async () => {
  const { data } = await axios.get('http://localhost:4000/api/attendances', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}

export const getAttendanceByIdApi = async (id) => {
  const { data } = await axios.get(
    `http://localhost:4000/api/attendances${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return data
}
