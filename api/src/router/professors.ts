import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getProfessors,
  addProfessor,
  deleteProfessor,
  getProfessorById,
  updateProfessor,
} from '../handlers/professors'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_professors = Router()

// Routing attendance
router_professors.get('/', getProfessors)

router_professors.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  getProfessorById as any
)

router_professors.post(
  '/',
  // Validación
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  addProfessor as any
)

router_professors.put(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  updateProfessor as any
)

router_professors.delete(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  deleteProfessor as any
)
