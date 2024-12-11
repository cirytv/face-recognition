import pl from 'tau-prolog'

const session = pl.create(100)
const show = (x) => console.log(session.format_answer(x))

const item = process.argv[2]

// Program and goal

const program = `

`
