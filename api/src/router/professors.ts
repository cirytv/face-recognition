import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getProfessors,
  addProfessor,
  deleteProfessor,
  getProfessorById,
  updateProfessor,
  upload,
} from '../handlers/professor'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_professors = Router()

// Routing professors
router_professors.get('/', getProfessors)

router_professors.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  getProfessorById as any
)

router_professors.post('/', upload, addProfessor as any)

router_professors.put(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  updateProfessor as any
)

router_professors.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteProfessor as any
)
