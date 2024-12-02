import { exit } from 'node:process'
import db from '../config/db'

// this is used as pre-test to clear the database
const clearDB = async () => {
  try {
    await db.sync({ force: true })
    console.log('Database cleaned')
    exit()
  } catch (error) {
    console.log(error)
    exit(1)
  }
}

if (process.argv[2] === '--clear') {
  clearDB()
}
