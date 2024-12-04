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

// Routing schedules
router_schedules.get('/', getSchedules)

router_schedules.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  getScheduleById as any
)

router_schedules.post('/', addSchedule as any)

router_schedules.put(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  updateSchedule as any
)

router_schedules.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteSchedule as any
)
