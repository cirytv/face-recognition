import { Client, IntentsBitField } from 'discord.js'
import axios from 'axios'
process.loadEnvFile()

const startDiscordBot = () => {
  const bot = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  })

  bot.on('ready', () => {
    console.log('The bot is online!')
  })

  bot.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (message.channel.id !== process.env.CHANNEL_ID) return
    if (message.content.startsWith('!')) return

    try {
      await message.channel.sendTyping()

      // Loguea el mensaje recibido
      console.log(`Mensaje recibido: "${message.content}"`)

      const response = await axios.post(
        'http://localhost:4000/api/chat/query',
        {
          query: message.content, // Esto debería ser un string válido
        }
      )

      if (response.data?.response) {
        message.reply(response.data.response)
      } else if (response.data?.error) {
        message.reply(response.data.error)
      } else {
        message.reply('No response from the server (discord bot).')
      }
    } catch (error) {
      console.error(`Error al procesar la consulta: ${error}`)
      message.reply(
        `There was an error processing your request (discord bot): ${error}`
      )
    }
  })

  bot.login(process.env.TOKEN)
}

export default startDiscordBot
