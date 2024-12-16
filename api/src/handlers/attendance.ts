import { Request, Response } from 'express'
import Attendance from '../models/Attendance.model'

//  get all
export const getAttendances = async (req: Request, res: Response) => {
  const attendance = await Attendance.findAll({
    order: [['id', 'ASC']],
  })
  // res.json({ data: attendance })
  res.send({ data: attendance })
}

// get by id
export const getAttendanceById = async (req: Request, res: Response) => {
  const { id } = req.params
  const attendance = await Attendance.findByPk(id)

  if (!attendance) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }
  // return item by id
  // res.json({ data: attendance })
  res.send({ data: attendance })
}

// create
export const addAttendance = async (req: Request, res: Response) => {
  let info = {
    enrollment_id: req.body.enrollment_id,
    schedule_id: req.body.schedule_id,
    status: req.body.status,
  }

  const attendance = await Attendance.create(info)
  res.status(201).send(attendance)
  console.log(attendance)
}

// update
export const updateAttendance = async (req: Request, res: Response) => {
  const { id } = req.params
  const attendance = await Attendance.findByPk(id)

  if (!attendance) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   Actualizar
  await attendance.update(req.body)
  await attendance.save()
  // res.json({ data: attendance })
  res.send({ data: attendance })
}

// delete
export const deleteAttendance = async (req: Request, res: Response) => {
  const { id } = req.params
  const attendance = await Attendance.findByPk(id)

  if (!attendance) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   delete
  await attendance.destroy()
  // res.json({ data: 'Item Deleted' })
  res.send({ data: 'Item Deleted' })
}
