require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :response-time ms :body'))

morgan.token('body', function (request, response) {
  if (Object.keys(request.body).length) {
    return JSON.stringify(request.body);
  } else return ' ';
});

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id).then(person => {
    response.json(person)
  })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const id = request.params.id

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  Person.findByIdAndUpdate(id, body).then(savedPerson => {
    response.json(savedPerson)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

  // Person.find({}).then(people => {
  //   if (people.some(person => person.name === body.name)) {
  //     return response.status(400).json({ 
  //       error: 'name must be unique'
  //     })
  //   } else {
    // const person = new Person({
    //   name: body.name,
    //   number: body.number,
    // })
  
    // person.save().then(savedPerson => {
    //   response.json(savedPerson)
    // })
  //   }
  // })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})