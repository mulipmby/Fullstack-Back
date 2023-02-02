const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "09-44-53514"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12342535"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "2573737"
  }
]

  
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons/', (request, response) => {
    if (persons) {
      response.json(persons)
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

  const PORT = 3001
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
