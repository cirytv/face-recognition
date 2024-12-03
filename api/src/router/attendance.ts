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
export const router_attendance = Router()

// Routing attendance
router_attendance.get('/', getAttendances)

router_attendance.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  getAttendanceById as any
)

router_attendance.post(
  '/',
  // Validación
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  addAttendance as any
)

router_attendance.put(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  body('student_id').notEmpty().withMessage('student_id required'),
  handleInputErrors,
  updateAttendance as any
)

router_attendance.delete(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  handleInputErrors,
  deleteAttendance as any
)
