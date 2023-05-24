const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const api = supertest(app)
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.initilaizeBlogs)
})
describe('get tests', () => {
  test('get all blogs and check it', async () => {
    const result = await api.get('/blogs')
    expect(result.body).toHaveLength(listHelper.initilaizeBlogs.length)
  })
  test('the first blog has an id', async () => {
    const result = await api.get('/blogs')
    expect(result.body[0].id).toBeDefined()
  })
})
describe('post tests', () => {
  test('post new logs works good', async () => {
    const totalBlogs = listHelper.initilaizeBlogs
    const newObject = {
      title: 'Zion Adventure Photog',
      author: 'abdelfatah',
      url: 'https://www.wix.com',
    }
    await api
      .post('/api/blogs')
      .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiZG8iLCJpZCI6IjY0NjdhMWY2ZDY0MjlkM2Q4NTE3MDBhYSIsImlhdCI6MTY4NDc0NTQ3MH0.Oq-xQdue_bwI1LTM-oW7RUOOPry0c98g4bHv4zQ5hEU')
      .send(newObject)
      .expect(201)
      .expect('Content-Type',/application\/json/)
    const blogsNow = await listHelper.blogInDB()
    const newBlog = blogsNow[blogsNow.length - 1]
    expect(blogsNow).toHaveLength(totalBlogs.length + 1)
    const blogTitle = blogsNow.map(r => r.title)
    expect(blogTitle).toContain('Zion Adventure Photog')
    expect(newBlog.likes).toBeDefined()
    expect(newBlog.likes).toBe(0)
  })
  test('new blogs has no title', async () => {
    const newObject = {
      author: 'abdelfatah',
      url: 'https://www.wix.com',
      likes:20
    }
    await api
      .post('/api/blogs')
      .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiZG8iLCJpZCI6IjY0NjdhMWY2ZDY0MjlkM2Q4NTE3MDBhYSIsImlhdCI6MTY4NDc0NTQ3MH0.Oq-xQdue_bwI1LTM-oW7RUOOPry0c98g4bHv4zQ5hEU')
      .send(newObject)
      .expect(400)
  })
  test('new blogs has no url', async () => {
    const newObject = {
      title: 'has no url',
      author: 'abdelfatah',
      likes:20
    }
    await api
      .post('/api/blogs')
      .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiZG8iLCJpZCI6IjY0NjdhMWY2ZDY0MjlkM2Q4NTE3MDBhYSIsImlhdCI6MTY4NDc0NTQ3MH0.Oq-xQdue_bwI1LTM-oW7RUOOPry0c98g4bHv4zQ5hEU')
      .send(newObject)
      .expect(400)
  })
})
describe('delete tests', () => {
  test('delete a single blog', async () => {
    const allBlogs = await listHelper.blogInDB()
    const blogToDelete = allBlogs[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiZG8iLCJpZCI6IjY0NjdhMWY2ZDY0MjlkM2Q4NTE3MDBhYSIsImlhdCI6MTY4NDc0NTQ3MH0.Oq-xQdue_bwI1LTM-oW7RUOOPry0c98g4bHv4zQ5hEU')
      .expect(204)
    const afterDelete = await listHelper.blogInDB()
    expect(afterDelete.length).toBe(listHelper.initilaizeBlogs.length - 1)
  },10000)
})
describe('update tests' , () => {
  test('update likes in blog', async () => {
    const allBlogs = await listHelper.blogInDB()
    const blogToUpdate = allBlogs[0]
    const addLike =  { ...blogToUpdate , likes: blogToUpdate.likes + 1 }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(addLike)
      .expect(201)
    const blogsAtEnd = await listHelper.blogInDB()
    expect(blogsAtEnd).toContainEqual(addLike)
  },10000)
})
describe('users validation', () => {
  test('post new user in users api', async () => {
    const allUsers = await listHelper.userInDB()
    const newUser = {
      username:'mulluki',
      name:'arto farkars',
      password:'sekret',
    }
    await api
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(newUser)
      .expect(201)
    const userAtEnd = await listHelper.userInDB()
    expect(userAtEnd.length).toBe(allUsers.length + 1)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})