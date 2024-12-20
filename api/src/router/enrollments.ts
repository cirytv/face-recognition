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

// Routing enrollments
router_enrollments.get('/', getEnrollments)

router_enrollments.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  getEnrollmentById as any
)

router_enrollments.post('/', addEnrollment as any)

router_enrollments.put(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  updateEnrollment as any
)

router_enrollments.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteEnrollment as any
)
