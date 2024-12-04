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

// Routing courses
router_courses.get('/', getCourses)

router_courses.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  getCourseById as any
)

router_courses.post('/', addCourse as any)

router_courses.put(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  updateCourse as any
)

router_courses.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteCourse as any
)
