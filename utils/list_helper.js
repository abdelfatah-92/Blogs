/* eslint-disable indent */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
const _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')

const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}
const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return  total + blog.likes },0)
}
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}
const favoriteBlog = (blogs) => {
  if(blogs.length === 0 ){
    return null }
    let fav = blogs[0]
    for (let i = 0; i < blogs.length; i++) {
      if(blogs[i].likes > fav.likes){
        let fav = blogs[i]
      }
  }
  return fav.title
}
const mostBlogs = (blogs) => {
  let authorCount = _.countBy(blogs, 'author')
  let authorMostCount = _.max(_.keys(authorCount),(author) => {
    authorCount[author]
  })
  return ({
    author:authorMostCount,
    blogs:authorCount[authorMostCount]
  })
}
const mostLikes = (blogs) => {
  let groupAuthor = _.groupBy(blogs, 'author')
  let likes = _.mapValues(groupAuthor,blogs => {
   return _.sumBy(blogs,'likes')})
  let authorMostLikes = _.maxBy(_.keys(likes) , author => 
  likes[author])
   
  return ({
    author: authorMostLikes,
    likes:likes[authorMostLikes]
  })
}
const initilaizeBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]
const blogInDB = async () => {
  const result = await Blog.find({})
  return result.map(n => n.toJSON())
}
const userInDB = async () => {
  const result = await User.find({})
  return result.map(n => n.toJSON())
}
module.exports= {
  reverse, totalLikes, dummy, favoriteBlog, mostBlogs, mostLikes, initilaizeBlogs, blogInDB, userInDB
}