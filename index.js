require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()



app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('jsonify', (request) => { return JSON.stringify(request.body)})
app.use(morgan((tokens, request, response) => (
   [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms',
    tokens.jsonify(request, response)
  ].join(' ')
)))

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
    }
   
]
app.get('/persons', (request, response) => {
      Person.find({}).then(persons => {
        response.json(persons)
      })
  })

  app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      response.json(`phonebook has info for ${persons.length} people ${Date()}`)
    })
  })

  app.get('/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
  })

  app.delete('/persons/:id', (request, response, next) => {
    const id = request.params.id
  
    Person.findByIdAndDelete(id)
      .then(() => { 
        response.status(204).end()
      })
      .catch(error => next(error))   
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
  
  // tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }

  app.put('/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  app.post('/persons', (request, response) => {
    const body = request.body

    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId(),
    })

    if (!body.name && !body.number)
    return response.status(400).json({ 
      error: 'content missing' 
    })

      if (persons.map(p => p.name).includes(body.name))
      return response.status(400).json({ 
        error: 'name must be unique' 
      })

      if(!body.name)
      return response.status(400).json({ 
        error: 'add name' 
      })

      if(!body.number)
      return response.status(400).json({ 
        error: 'add number' 
      })

      person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })