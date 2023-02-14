const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: parseFloat(process.env.PGPORT),
    dialect: 'postgres'
  })

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(error => { console.log("🚀 ~ file: database.js:17 ~ error", error) })

module.exports = sequelize