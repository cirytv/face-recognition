import { Request, Response } from 'express'
import Classroom from '../models/Enrollment.model'
import multer from 'multer'
import path from 'path'

// get all
export const getClassrooms = async (req: Request, res: Response) => {
  const classroom = await Classroom.findAll()
  res.status(201).send(classroom)
}

// get by id
export const getClassroomById = async (req: Request, res: Response) => {
  const { id } = req.params
  const classroom = await Classroom.findByPk(id)

  if (!classroom) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  res.status(200).send(classroom)
}

// create

export const addClassroom = async (req: Request, res: Response) => {
  let info = {
    image: req.file.filename,
    name: req.body.name,
    age: req.body.age,
  }

  const classroom = await Classroom.create(info)
  res.status(200).send(classroom)
  console.log(classroom)
}

// update
export const updateClassroom = async (req: Request, res: Response) => {
  const { id } = req.params
  const classroom = await Classroom.findByPk(id)

  if (!classroom) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   Actualizar
  await classroom.update(req.body)
  await classroom.save()
  res.send(classroom)
}

// delete
export const deleteClassroom = async (req: Request, res: Response) => {
  const { id } = req.params
  const classroom = await Classroom.findByPk(id)

  if (!classroom) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   delete
  await classroom.destroy()
  res.send('Item Deleted')
}

// multer upload image

// Upload Image Controller
const storage = multer.diskStorage({
  destination: (req: Request, file, callback) => {
    const imagesPath = path.join(__dirname, '..', 'Images')
    callback(null, imagesPath)
  },
  filename: (req: Request, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname))
  },
})

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req: Request, file, callback) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))

    if (mimeType && extname) {
      return callback(null, true)
    }
    callback(new Error('Give proper files formate to upload'))
  },
}).single('image')
