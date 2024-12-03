import { Request, Response } from 'express'
import Enrollment from '../models/Enrollment.model'

// get all
export const getEnrollments = async (req: Request, res: Response) => {
  const enrollment = await Enrollment.findAll()
  res.status(201).send(enrollment)
}

// get by id
export const getEnrollmentById = async (req: Request, res: Response) => {
  const { id } = req.params
  const enrollment = await Enrollment.findByPk(id)

  if (!enrollment) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  res.status(200).send(enrollment)
}

// create

export const addEnrollment = async (req: Request, res: Response) => {
  let info = {
    student_id: req.body.student_id,
    course_id: req.body.course_id,
    enrollment_date: req.body.enrollment_date,
  }

  const enrollment = await Enrollment.create(info)
  res.status(200).send(enrollment)
  console.log(enrollment)
}

// update
export const updateEnrollment = async (req: Request, res: Response) => {
  const { id } = req.params
  const enrollment = await Enrollment.findByPk(id)

  if (!enrollment) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   Actualizar
  await enrollment.update(req.body)
  await enrollment.save()
  res.send(enrollment)
}

// delete
export const deleteEnrollment = async (req: Request, res: Response) => {
  const { id } = req.params
  const enrollment = await Enrollment.findByPk(id)

  if (!enrollment) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   delete
  await enrollment.destroy()
  res.send('Item Deleted')
}
