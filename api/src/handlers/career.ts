import { Request, Response } from 'express'
import Career from '../models/Career.model'

// get all
export const getCareers = async (req: Request, res: Response) => {
  const careers = await Career.findAll()
  res.status(201).send(careers)
}

// get by id
export const getCareerById = async (req: Request, res: Response) => {
  const { id } = req.params
  const career = await Career.findByPk(id)

  if (!career) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  // res.json({ data: career })
  res.status(200).send({ data: career })
}

// create

export const addCareer = async (req: Request, res: Response) => {
  let info = {
    name: req.body.name,
    description: req.body.description,
  }

  const career = await Career.create(info)
  console.log(career)

  res.status(200).send(career)
  console.log(career)
}

// update
export const updateCareer = async (req: Request, res: Response) => {
  const { id } = req.params
  const career = await Career.findByPk(id)

  if (!career) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   Actualizar
  await career.update(req.body)
  await career.save()
  // res.json({ data: career })
  res.send({ data: career })
}

// delete
export const deleteCareer = async (req: Request, res: Response) => {
  const { id } = req.params
  const career = await Career.findByPk(id)

  if (!career) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   delete
  await career.destroy()
  // res.json({ data: 'Item Deleted' })
  res.send({ data: 'Item Deleted' })
}
