import { Router } from 'express'
import { param } from 'express-validator'
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

// Routing careers
router_careers.get('/', getCareers)

router_careers.get(
  '/:id',
  param('id').isInt().withMessage('Invalid ID'),
  getCareerById as any
)

router_careers.post('/', addCareer as any)

router_careers.put(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),

  handleInputErrors,
  updateCareer as any
)

router_careers.delete(
  '/:id',
  param('id').isInt().withMessage('Not Valid ID'),
  handleInputErrors,
  deleteCareer as any
)
