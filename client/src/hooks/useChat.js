import { useState, useCallback } from 'react'
import { chatQueryApi } from '../middleware/chats'

export function useChats() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])

  const chatQuery = useCallback(async (query) => {
    if (!query.trim()) return

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: query },
    ])

    try {
      setLoading(true)
      setError(null)

      const response = await chatQueryApi(query)
      console.log('Response from API:', response)

      // Extraer texto de la respuesta
      const responseText =
        response?.response || 'No response received from API.'

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'chatgpt', text: responseText },
      ])
    } catch (err) {
      setError(err.message || 'An error occurred')
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'chatgpt', text: `Error: ${err.message}` },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    messages,
    setMessages,
    chatQuery,
  }
}
