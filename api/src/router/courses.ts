import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getCourses,
  addCourse,
  deleteCourse,
  getCourseById,
  updateCourse,
} from '../handlers/course'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_courses = Router()

// Routing attendance
router_courses.get('/', getCourses)

router_courses.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  getCourseById as any
)

router_courses.post(
  '/',
  // Validación
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  addCourse as any
)

router_courses.put(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  updateCourse as any
)

router_courses.delete(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  deleteCourse as any
)
