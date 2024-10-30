import { Request, Response } from 'express'
import Attendance from '../models/Attendance.model'

export const getAttendance = async (req: Request, res: Response) => {
  const attendance = await Attendance.findAll({
    order: [['id', 'ASC']],
  })
  res.json({ data: attendance })
}

export const getAttendanceById = async (req: Request, res: Response) => {
  const { id } = req.params
  const attendance = await Attendance.findByPk(id)

  if (!attendance) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }
  // return item by id
  res.json({ data: attendance })
}

export const createAttendance = async (req: Request, res: Response) => {
  const attendance = await Attendance.create(req.body)
  res.status(201).json({ data: attendance })
}

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
  res.json({ data: attendance })
}

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
  res.json({ data: 'Item Deleted' })
}
