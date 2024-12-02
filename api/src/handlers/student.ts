import { Request, Response } from 'express'
import Student from '../models/Student.model'

// get all
export const getStudents = async (req: Request, res: Response) => {
  const student = await Student.findAll({
    order: [['id', 'ASC']],
  })
  res.json({ data: student })
}

// get by id
export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params
  const student = await Student.findByPk(id)

  if (!student) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  res.json({ data: student })
}

// create
export const createStudent = async (req: Request, res: Response) => {
  const student = await Student.create(req.body)
  res.status(201).json({ data: student })
}

// update
export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params
  const student = await Student.findByPk(id)

  if (!student) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   Actualizar
  await student.update(req.body)
  await student.save()
  res.json({ data: student })
}

// delete
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params
  const student = await Student.findByPk(id)

  if (!student) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   delete
  await student.destroy()
  res.json({ data: 'Item Deleted' })
}
