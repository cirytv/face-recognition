import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material'
import { tokens } from '../../theme'
import Header from '../../components/Header'
import { useChats } from '../../hooks/useChat' // Correct import

const ChatBox = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [inputMessage, setInputMessage] = useState('')

  // Obtener datos desde el hook
  const { messages, chatQuery } = useChats() // messages se extrae correctamente aquí

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      try {
        // Call prologQuery with the user input
        await chatQuery(inputMessage)
      } catch (error) {
        console.error('Error sending message:', error)
      }
      setInputMessage('') // Clear the input after sending
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', mt: 4 }}>
      <Header
        title="Chat with ChatGPT + Prolog"
        subtitle="Ask something about student"
      />
      <List>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              backgroundColor: colors.primary[900],
              border: `1px solid ${colors.greenAccent[400]}`,
              borderRadius: '10px',
              padding: '10px',
              mb: 1,
            }}
          >
            <ListItemText
              primary={message.text}
              secondary={message.type === 'user' ? 'You' : 'ChatGPT'}
              align={message.type === 'user' ? 'right' : 'left'}
              primaryTypographyProps={{
                style: {
                  fontWeight: message.type === 'user' ? 'bold' : 'normal',
                  color: colors.grey[100],
                },
              }}
              secondaryTypographyProps={{
                style: {
                  color: colors.greenAccent[400],
                },
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your query here..."
          variant="outlined"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          sx={{
            backgroundColor: colors.primary[900],
          }}
        />
        <Button 
          variant="contained" onClick={handleSendMessage}  
          sx={{
            ml: 1,
            backgroundColor: colors.greenAccent[400],
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: colors.greenAccent[100], // Puedes definir un tono más claro para el hover si lo deseas
          },
  }}>
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default ChatBox
