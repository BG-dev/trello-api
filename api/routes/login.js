const express = require("express"); 
const users = require('../../integration/databases/users.json')
const validateUser = require('../../service/validators/userValidator')

const router = express.Router()

router.post('/', (req, res) => {
    try {
        const {error} = validateUser(req.body.user)

        if(error)
            return res.status(400).send({message: error.details[0].message})

        const user = findUser(req.body)
        if(!user)
            return res.status(401).send({message: "Invalid Login or Password"})

        res.status(200).send({
            user: user,
            message: "Logged in successfully"
        })

    } catch (error) {
        res.status(500).send({message: "Internal server error"})
    }
})

const findUser = user => 
    users
    .find(elem => elem.login === user.login && elem.password === user.password)

module.exports = router
