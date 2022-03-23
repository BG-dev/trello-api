const express = require('express')
const { v4: uuidv4 } = require('uuid');

const router = express.Router()

router.get('/', (req, res) => {
    res.send(users)
})

router.post('/', (req, res) => {
    const newUser = req.body
    const userId = uuidv4()
    const newUserWithId = { id: userId, ...newUser }

    users.push(newUserWithId)

    res.send(`User with the name ${newUserWithId.name} added to the database`)
})

module.exports = router