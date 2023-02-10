const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// mongoose tietokanta

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://mulipmby:${password}@cluster0.vnlqkmz.mongodb.net/puhelinLuettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (person.name != undefined && person.number != undefined) {
    person.save().then(result => {
        console.log(`added ${result.name} ${result.number} to phonebook`)
        mongoose.connection.close()
      })
}

if (person.name === undefined && person.number === undefined) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

//tietokanta päättyy tähän

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
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
]

  app.get('/api/persons', (request, response) => {
    if (persons) {
      Person.find({}).then(persons => {
        response.json(persons)
      })
    } else {
      response.status(404).end()
    }
  })

  app.get('/info', (request, response) => {
    var data = `phonebok has info for ${persons.length} people`
    var time = new Date();
    

    if (persons) {
      response.json(`${data} ${time}`)
    } else {
      response.status(404).end()
    }
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
      
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

  const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

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

    persons = persons.concat(person)

    response.json(person)
  })
