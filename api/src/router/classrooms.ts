import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getClassrooms,
  addClassroom,
  deleteClassroom,
  getClassroomById,
  updateClassroom,
} from '../handlers/classrooms'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_classrooms = Router()

// Routing attendance
router_classrooms.get('/', getClassrooms)

router_classrooms.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  getClassroomById as any
)

router_classrooms.post(
  '/',
  // Validación
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  addClassroom as any
)

router_classrooms.put(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  updateClassroom as any
)

router_classrooms.delete(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  deleteClassroom as any
)
