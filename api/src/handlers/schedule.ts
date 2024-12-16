import { Request, Response } from 'express'
import Schedule from '../models/Schedule.model'

// get all
export const getSchedules = async (req: Request, res: Response) => {
  const schedules = await Schedule.findAll()
  res.status(200).send(schedules)
}

// get by id
export const getScheduleById = async (req: Request, res: Response) => {
  const { id } = req.params
  const schedule = await Schedule.findByPk(id)

  if (!schedule) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  res.status(200).send(schedule)
}

// create

export const addSchedule = async (req: Request, res: Response) => {
  let info = {
    name: req.body.name,
    description: req.body.description,
    course_id: req.body.course_id,
    professor_id: req.body.professor_id,
    day_of_week: req.body.day_of_week,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
  }

  const schedule = await Schedule.create(info)
  res.status(201).send(schedule)
  console.log(schedule)
}

// update
export const updateSchedule = async (req: Request, res: Response) => {
  const { id } = req.params
  const schedule = await Schedule.findByPk(id)

  if (!schedule) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   Actualizar
  await schedule.update(req.body)
  await schedule.save()
  res.send(schedule)
}

// delete
export const deleteSchedule = async (req: Request, res: Response) => {
  const { id } = req.params
  const schedule = await Schedule.findByPk(id)

  if (!schedule) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   delete
  await schedule.destroy()
  // res.json({ data: 'Item Deleted' })
  res.send({ data: 'Item Deleted' })
}
