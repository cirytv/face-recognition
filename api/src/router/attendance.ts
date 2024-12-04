import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getAttendances,
  addAttendance,
  deleteAttendance,
  getAttendanceById,
  updateAttendance,
} from '../handlers/attendance'
import { handleInputErrors } from '../middleware/index'

// create routers
export const router_attendances = Router()

// Routing attendances
router_attendances.get('/', getAttendances)

router_attendances.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  getAttendanceById as any
)

router_attendances.post('/', addAttendance as any)

router_attendances.put(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  updateAttendance as any
)

router_attendances.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteAttendance as any
)
