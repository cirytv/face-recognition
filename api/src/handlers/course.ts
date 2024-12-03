import { Request, Response } from 'express'
import Course from '../models/Course.model'

// get all
export const getCourses = async (req: Request, res: Response) => {
  const courses = await Course.findAll()
  res.status(201).send(courses)
}

// get by id
export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params
  const course = await Course.findByPk(id)

  if (!course) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  res.status(200).send(course)
}

// create

export const addCourse = async (req: Request, res: Response) => {
  let info = {
    name: req.body.name,
    description: req.body.description,
  }

  const course = await Course.create(info)
  res.status(200).send(course)
  console.log(course)
}

// update
export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params
  const course = await Course.findByPk(id)

  if (!course) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   Actualizar
  await course.update(req.body)
  await course.save()
  res.send(course)
}

// delete
export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params
  const course = await Course.findByPk(id)

  if (!course) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   delete
  await course.destroy()
  // res.json({ data: 'Item Deleted' })
  res.send({ data: 'Item Deleted' })
}
