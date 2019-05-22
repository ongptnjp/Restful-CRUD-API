module.exports = (app) => {
    const notes = require('../controllers/note.controller.js')

    // create new note
    app.post('/notes', notes.create)

    // retrieve all note
    app.get('/notes', notes.findAll)

    // Retrieve a single Note with noteId
    app.get('/notes/:noteId', notes.findOne)

    // Update a Note with noteId
    app.put('/notes/:noteId', notes.update)

    // Delete a Note with noteId
    app.delete('/notes/:noteId', notes.delete)
}