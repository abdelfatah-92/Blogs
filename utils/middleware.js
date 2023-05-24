const User = require('../models/user')
const { SECRET } = require('./config')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    const decodedToken = jwt.verify(token, SECRET)
    if (decodedToken && decodedToken.id) {
      const user = await User.findById(decodedToken.id)
      if (user) {
        request.user = user
      }
    }
  }
  next()
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'jsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
}