import { Request, Response } from 'express'
import Student from '../models/Student.model'
import multer from 'multer'
import path from 'path'

// get all
export const getStudents = async (req: Request, res: Response) => {
  const students = await Student.findAll()
  res.status(201).send(students)
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

  // res.json({ data: student })
  res.status(200).send(student)
}

// create

export const addStudent = async (req: Request, res: Response) => {
  let info = {
    image: req.file.filename,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
    career: req.body.career,
  }

  const student = await Student.create(info)
  res.status(200).send(student)
  console.log(student)
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
  // res.json({ data: student })
  res.send({ data: student })
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
  // res.json({ data: 'Item Deleted' })
  res.send({ data: 'Item Deleted' })
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
