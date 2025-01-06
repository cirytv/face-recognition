import { Router } from 'express'
import { handleUserQuery } from '../handlers/chat'

// create routers
export const router_chat = Router()

// Ruta para manejar consultas Chat
router_chat.post('/query', handleUserQuery)
