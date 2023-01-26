const express = require('express')
const app = express()

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

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }
  
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

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })