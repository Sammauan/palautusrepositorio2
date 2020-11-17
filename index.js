const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }    
]

const getRandomID = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or number is missing' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandomID(5,1000000000000000),
  }

  const personfind = persons.find(person => person.name === body.name)
    if (personfind) {
      response.status(400).json({ 
        error: 'Name is already in the phonebook' 
      })
    } else {
      persons = persons.concat(person)
      response.json(person)
    }
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  var datetime = new Date();
  console.log(datetime);
  console.log(res.getHeaders())
  res.send(`<p> Phonebook has info for ${persons.length} people </p> <p>${datetime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  })