const express = require('express')
const app = express()
const port = 3000
const fs = require("fs")

const dbPath = `${__dirname}/db/db.json`

app.use(express.static('public'))
app.use(express.urlencoded({
  extended: true
}))

app.get("/api/notes", (req, res) => res.sendFile(dbPath))

app.post("/api/notes", (req, res) => {
  console.log('req', req.body)
  // Read the db file
  const data = fs.readFileSync(dbPath, "utf8")
  const db = JSON.parse(data)
  // Get new note data
  const newNote = req.body
  // Generate new id for note
  const lastNote = db[db.length - 1] || {}
  let lastId = lastNote.id || 0
  lastId++
  newNote.id = lastId
  // Push the new note on the end of the file
  db.push(newNote)
  // Write the file back to disk
  fs.writeFileSync(dbPath, JSON.stringify(db))
  // Respond to the request
  res.send("OK")
})

app.delete(`/api/notes/:id`, (req, res) => {
  const noteIdToDelete = Number(req.params.id)
  console.log('noteIdToDelete', noteIdToDelete)
  // Read the db file
  const data = fs.readFileSync(dbPath, "utf8")
  const db = JSON.parse(data)
  // Remove the note with the given id property
  const indexOfNoteToDelete = db.findIndex(note => note.id === noteIdToDelete)
  console.log('indexOfNoteToDelete', indexOfNoteToDelete)
  db.splice(indexOfNoteToDelete, 1);
  // Rewrite the notes file
  fs.writeFileSync(dbPath, JSON.stringify(db))
  // Respond to the request
  res.send("OK")
})

app.get('/notes', (req, res) => res.sendFile(`${__dirname}/public/notes.html`))

// Why would we use a * instead of a / ???
app.get('/', (req, res) => res.sendFile(`${__dirname}/public/index.html`))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
