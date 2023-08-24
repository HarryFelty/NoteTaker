const express = require('express');
const path = require('path');
const PORT = process.env.port || 3002;
const app = express();
const notesArray = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'))
})

app.post('/api/notes', (req, res) => {
    req.body = { ...req.body, id: uuidv4() };
    notesArray.push(req.body);
    fs.writeFile("./db/db.json", JSON.stringify(notesArray), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Note saved!");
        }
        res.sendFile(path.join(__dirname, './public/notes.html'));
    });
})

app.delete('/api/notes/:id', (req, res) => {
    notesArray.forEach((note) => {
        if (note.id === req.params.id) {
            notesArray.splice(notesArray.indexOf(note), 1);
            fs.writeFile("./db/db.json", JSON.stringify(notesArray), function (err) {
                if (err) {
                    console.log(err);
                }
            });
            res.sendFile(path.join(__dirname, './public/notes.html'));
        }
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
