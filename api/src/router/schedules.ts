import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getSchedules,
  addSchedule,
  deleteSchedule,
  getScheduleById,
  updateSchedule,
} from '../handlers/schedule'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_schedules = Router()

// Routing attendance
router_schedules.get('/', getSchedules)

router_schedules.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  getScheduleById as any
)

router_schedules.post(
  '/',
  // Validación
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  addSchedule as any
)

router_schedules.put(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  updateSchedule as any
)

router_schedules.delete(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  deleteSchedule as any
)
