const express = require("express"); 
const { authUser, authRole } = require('../../auth')
const { addBoard, updateBoard, deleteBoard } = require('../../service/boardService')

const router = express.Router()

router.post('/', authUser, authRole('admin'), async (req, res) => {
    try {
        const boardData = req.body.board
        if(!boardData)
            throw new Error('board data is undefined')

        await addBoard(boardData)
        res.status(200).send({message: 'Board successfully added to the database'})   
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }  
})

router.put('/:id', authUser, authRole('admin'), async (req, res) => {
    try {
        const id = req.params.id
        const board = req.body.board
        if(!board || !id)
            throw new Error('data is undefined')

        await updateBoard(id, board)
        res.status(200).send({message: 'Board successfully updated in the database'})   
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }

})

router.delete('/:id', authUser, authRole('admin'), async (req, res) => {
    try {
        const id = req.params.id
        if(!id)
            throw new Error('id is undefined')
    
        deleteBoard(id)
        res.status(200).send({message: 'Board has been deleted!'})    
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }
})

module.exports = router