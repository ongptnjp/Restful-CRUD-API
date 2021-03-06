const Note = require('../models/note.model.js')
const mongoOp = require('../models/note.model')

// Create and save a new Note
exports.create = (req, res) => {
    // validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: 'Note content can not be empty'
        })
    }

    // create a Note
    const note = new Note({
        title: req.body.title || 'Untitle Note',
        content: req.body.content
    })

    // save note in the database
    note.save().then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the Note.'
        })
    })

}


// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    var pageNo = parseInt(req.query.pageNo)
    var size = parseInt(req.query.size)
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = {
            "error": true,
            "message": 'invalid page number, should start with 1'
        }
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size

    // count notes
    mongoOp.count({}, function(err, totalCount) {
        if (err) {
            response = {
                "error": true,
                "message": "error fetching data"
            }
        }
        
        // find all notes
        mongoOp.find({},{},query,function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "error fetching data"
                }
            } else {
                var totalPage = Math.ceil(totalCount / size)
                response = {
                    "error": false,
                    "page": totalPage,
                    "message": data
                }
            }
            res.json(response)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving notes.'
            })
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving notes.'
        })
    })
}

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId).then(note => {
        if (!note) {
            return res.status(404).send({
                message: 'Note not found with id ' + req.params.noteId
            })
        }
        res.send(note)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Note not found with id ' + req.params.noteId
            })
        }
        return res.status(500).send({
            message: 'Error retriving note with id ' + req.params.noteId
        })
    })
}

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        })
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || 'Untitled Note',
        content: req.body.content
    }, {new: true}).then(note => {
        if (!note) {
            return res.status(404).send({
                message: 'Note not found with id' + req.params.noteId
            })
        }
        res.send(note)
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            })
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.noteId
        })
    })
}

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId).then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            })
        }
        res.send({message: "Note deleted successfully!"})
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            })
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        })
    })
}