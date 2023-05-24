const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1 , name: 1 })
  response.json(blogs)
})
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog){
    response.status(200).json(blog)}else{
    response.status(404).end()
  }
})
blogsRouter.delete('/:id', async (request, response) => {
  const blogToRemove = await Blog.findById(request.params.id)
  if (!blogToRemove) {
    return response.status(404).json({ error: 'Cannot find the blog' })
  }
  const userId = request.user.id.toString()
  if (blogToRemove.user.toString() !== userId) {
    return response.status(403).json({ error: 'User is not authorized to delete this blog' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const newObject = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }
  const blog = await Blog.findByIdAndUpdate(req.params.id,newObject ,{ new : true })
  res.status(201).json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})
module.exports = blogsRouter