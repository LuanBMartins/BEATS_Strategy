const { Client } = require('pg')

const dbClient = new Client()

function dbConnect () {
  dbClient.connect((err) => {
    if (err) {
      console.log(err)
      console.log('FATAL ERROR: Unable to connect to database')
      process.exit(1)
    }
    console.log('Database connected!')
  })
}

module.exports = {
  db_client: dbClient,
  db_connect: dbConnect
}
