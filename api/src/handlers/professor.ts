import { Request, Response } from 'express'
import Professor from '../models/Professor.model'
import multer from 'multer'
import path from 'path'

// get all
export const getProfessors = async (req: Request, res: Response) => {
  const professors = await Professor.findAll()
  res.status(201).send(professors)
}

// get by id
export const getProfessorById = async (req: Request, res: Response) => {
  const { id } = req.params
  const professor = await Professor.findByPk(id)

  if (!professor) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  // res.json({ data: professor })
  res.status(200).send({ data: professor })
}

// create

export const addProfessor = async (req: Request, res: Response) => {
  console.log(req.file) // ¿Este log muestra undefined?
  console.log(req.body)
  if (!req.file) {
    return res
      .status(400)
      .json({ error: 'File not provided or incorrect field name' })
  }
  let info = {
    image: req.file.filename,
    name: req.body.name,
    email: req.body.email,
  }

  const professor = await Professor.create(info)
  res.status(200).send(professor)
}

// update
export const updateProfessor = async (req: Request, res: Response) => {
  const { id } = req.params
  const professor = await Professor.findByPk(id)

  if (!professor) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   Actualizar
  await professor.update(req.body)
  await professor.save()
  // res.json({ data: professor })
  res.send({ data: professor })
}

// delete
export const deleteProfessor = async (req: Request, res: Response) => {
  const { id } = req.params
  const professor = await Professor.findByPk(id)

  if (!professor) {
    return res.status(404).json({
      error: 'Item Not Found',
    })
  }

  //   delete
  await professor.destroy()
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
