const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

// create new todo
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const UserId = req.user.id
  const name = req.body.name
  
  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// view todo detail
router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Todo.findOne({
    where: { id, UserId }
  })
    .then((todo) => res.render('detail', { todo: todo.toJSON() }))
    .catch((error) => console.log(error))
})

// edit todo detail page
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => res.render('edit', { todo: todo.get() }))
    .catch((error) => console.log(error))
})

// Render todo detail page after edited
router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body
  console.log(req.body)

  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error))
})

// Delete todo
router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  
  return Todo.findOne({ where: { id, UserId }})
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err)) 
})

module.exports = router