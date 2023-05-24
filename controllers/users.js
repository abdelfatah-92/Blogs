const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1 , author: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' })
  }

  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'Username and password must be at least 3 characters long.' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: 'This username is already taken.' })
  }

  const saltNumber = 10
  const passwordHash = await bcrypt.hash(password, saltNumber)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const result = await user.save()
  res.status(201).json(result)
})

module.exports = usersRouter