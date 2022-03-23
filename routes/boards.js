const express = require("express"); 
const { authUser, authRole } = require('../auth')
const boards = require('../databases/boards.json')
const { validateBoard, validateCard } = require('../validators/boardValidator')

const router = express.Router()

router.get('/', authUser, (req, res) => {
    res.status(200).send({
        data: boards,
        message: "Boards loadded successfully"
    })
})

router.post('/', authUser, authRole('admin'), (req, res) => {
    const { error } = validateBoard(req.body.board)
    if(error)
        return res.status(400).send({message: error.details[0].message})

    res.status(200).send({message: 'Board successfully added to the database'})
    
})

module.exports = router