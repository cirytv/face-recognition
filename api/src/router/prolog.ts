import { Router } from 'express'
import { handlePrologQuery } from '../handlers/prolog'

// create routers
export const router_prolog = Router()

// Ruta para manejar consultas Prolog
router_prolog.post('/query', handlePrologQuery)
