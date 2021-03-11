const express = require('express')
const shortid = require('shortid')
const cors = require('cors')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({
  inventory: [
    {
      id: shortid.generate(),
      name: 'Скакалка',
      isGoodCondiyion: true,
      quantity: 10,
    },
    {
      id: shortid.generate(),
      name: 'Штанга',
      isGoodCondiyion: true,
      quantity: 0,
    },
    {
      id: shortid.generate(),
      name: 'Гантели',
      isGoodCondiyion: true,
      quantity: 20,
    },

    {
      id: shortid.generate(),
      name: 'Блины',
      isGoodCondiyion: true,
      quantity: 20,
    },
  ],
}).write()

const app = express()
const port = 3000

app.use(cors())

app.use(express.json())

app.get('/inventory', (req, res) => {
  let inventory = db.get('inventory')
  res.send(inventory)
})

app.get('/inventory/detail/:id', (req, res) => {
  const { id } = req.params

  const item = db.get('inventory').find({ id })

  if (!item) {
    res.status(404).send(`ID ${id} is not found!`)
  }

  res.send(item)
})

app.post('/inventory/create', (req, res) => {
  let newInventory = {
    id: shortid.generate(),
    ...req.body,
  }

  db.get('inventory').push(newInventory).write()

  res.send(newInventory)
})

app.put('/inventory/update/:id', (req, res) => {
  let { id } = req.params

  let item = db.get('inventory').find({ id }).value()

  let updatedInventory = {
    ...item,
    ...req.body,
  }

  db.get('inventory').find({ id }).assign(updatedInventory).write()

  res.send(updatedInventory)
})
