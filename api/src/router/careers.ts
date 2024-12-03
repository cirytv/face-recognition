import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getCareers,
  addCareer,
  deleteCareer,
  getCareerById,
  updateCareer,
} from '../handlers/career'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_careers = Router()

// Routing attendance
router_careers.get('/', getCareers)

router_careers.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  getCareerById as any
)

router_careers.post(
  '/',
  // Validación
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  addCareer as any
)

router_careers.put(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  updateCareer as any
)

router_careers.delete(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  deleteCareer as any
)
