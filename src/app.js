require('dotenv/config')

const express = require('express')
const cors = require('cors')
const dbconfig = require('./dbconfig')

dbconfig.db_connect()

const dbClient = dbconfig.db_client

process.on('exit', (code) => {
  console.log(`SERVER: exiting with code: ${code}`)
  dbClient.end()
})

process.on('SIGINT', (code) => {
  console.log('SERVER: stopping')
  dbClient.end()
  process.exit(0)
})

const PORT = process.env.PORT || 3000
const app = express()

const app1 = express() // Compliant
app1.disable('x-powered-by')

const helmet = require('helmet')
app.use(helmet.hidePoweredBy())

app.listen(PORT, () => {
  console.log(`SERVER: listening on ${PORT}`)
})

app.use(cors())
app.use(express.json())
app.options('*', cors())
app.disable('etag')

const strategyRouter = require('./routes/strategy_routes')
app.use(strategyRouter)

const commentRouter = require('./routes/comment_routes')
app.use(commentRouter)

const userRouter = require('./routes/user_routes')
app.use(userRouter)

const requestRouter = require('./routes/request_routes')
app.use(requestRouter)

const voteRouter = require('./routes/vote_routes')
app.use(voteRouter)

const suggestionRouter = require('./routes/suggestion_routes')
app.use(suggestionRouter)
