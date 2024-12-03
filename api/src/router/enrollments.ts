import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getEnrollments,
  addEnrollment,
  deleteEnrollment,
  getEnrollmentById,
  updateEnrollment,
} from '../handlers/enrollment'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_enrollments = Router()

// Routing attendance
router_enrollments.get('/', getEnrollments)

router_enrollments.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  getEnrollmentById as any
)

router_enrollments.post(
  '/',
  // Validación
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  addEnrollment as any
)

router_enrollments.put(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  updateEnrollment as any
)

router_enrollments.delete(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  deleteEnrollment as any
)
