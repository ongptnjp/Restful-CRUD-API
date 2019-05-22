const express = require('express')
const bodyParser = require('body-parser')

const dbConfig = require('./config/database.config.js')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// create express app
const app = express()

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// connecting to the data base
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log('Successfully connected to the database')
}).catch(err => {
    console.log('Could not connect to the database. Exitinig now  ...', err)
    process.exit()
})

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// Require Notes routes
require('./app/routes/note.routes.js')(app);

// listen for request
app.listen(3000, () => {
    console.log("server is listening on port 3000")
})