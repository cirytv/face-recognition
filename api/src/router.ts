import { Router } from 'express'
import { body, param } from 'express-validator'

const router_students = Router()

// Routing
router_students.get('/', (req, res) => {
  res.json('from post')
})

export default router_students
