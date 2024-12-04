import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getStudents,
  addStudent,
  deleteStudent,
  getStudentById,
  updateStudent,
  upload,
} from '../handlers/student'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_students = Router()

// Routing students
router_students.get('/', getStudents)

router_students.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  getStudentById as any
)

router_students.post('/', upload, addStudent as any)

router_students.put(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  body('name').notEmpty().withMessage('Student name cant be empty'),
  body('age')
    .isNumeric()
    .withMessage('Valor no válido')
    .notEmpty()
    .withMessage('Product Price Cant Be Empty')
    .custom((value) => value > 0)
    .withMessage('Invalid age'),
  handleInputErrors,
  updateStudent as any
)

router_students.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteStudent as any
)
