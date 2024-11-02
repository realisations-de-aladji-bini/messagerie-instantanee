// Load Enviroment Variables to process.env (if not present take variables defined in .env file)
require('mandatoryenv').load(['PORT'])
const { PORT } = process.env

// Instantiate an Express Application
const app = require('./app')
// Open Server on selected Port
app.listen(
  PORT,
  () => console.info('Server listening on port ', PORT)
)
