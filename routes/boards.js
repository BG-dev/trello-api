const axios = require("axios");
const express = require("express"); 
const { authUser, authRole } = require('../auth')
const boards = require('../databases/boards.json')
const { validateBoard } = require('../validators/boardValidator')
const fs = require('fs');

const FILE_NAME = 'boards'
const FILE_EXTENSION = 'json'

const router = express.Router()

router.get('/', authUser, (req, res) => {
    res.status(200).send({
        data: boards,
        message: "Boards loadded successfully"
    })
})

router.get('/:id', authUser, (req, res) => {
    const id = req.params.id
    const board = getBoardById(id)

    res.status(200).send({
        data: board,
        message: "Board by name loadded successfully"
    })
})

router.post('/', authUser, authRole('admin'), async (req, res) => {
    try {
        const board = req.body.board
        if(!board)
            throw new Error('board is undefined')

        const { error } = validateBoard(req.body.board)
        if(error)
            throw new Error(error.details[0].message)
        
        const id = await createBoardInTrello(board)
        await addBoardToFile(boards, board, id, FILE_NAME, FILE_EXTENSION)
    
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
    
        const oldBoard = getBoardById(id)
        const newBoard = {... oldBoard, ...board}
        await updateBoardInTrello(id, newBoard)
        await updateBoardInFile(id, newBoard)

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
    
        await deleteBoardFromTrelloById(id)

        await deleteBoardFromFileById(id)
        
        res.status(200).send({message: 'Board has been deleted!'})    
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }
})

const getDateNow = () => {
    const time = new Date()
    return `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()}, ` 
    + `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}

const getBoardById = (id) => boards.find(board => board.id === id)

async function createBoardInTrello(board){
    if(!board)
        throw new Error('New board data is undefined')

    const url = process.env.URL
    const response = await axios.post(`${url}/1/boards`, {
        name: board.name,
        desc: board.description,
        prefs_background: board.color,
        key: process.env.KEY,
        token: process.env.TOKEN
      })

      return response.data.id
}

async function updateBoardInTrello(id, newBoard){
    if(!id || !newBoard)
        throw new Error('data is undefined')

    const url = process.env.URL
    await axios.put(`${url}/1/boards/${id}?prefs/background=${newBoard.color}`, {
        name: newBoard.name,
        desc: newBoard.description,
        key: process.env.KEY,
        token: process.env.TOKEN
      })
}

async function updateBoardInFile(id, newBoard){
    if(!id || !newBoard)
        throw new Error('data is undefined')

    const updatedBoards = boards.map(board => {
        if(board.id === id){
            board = newBoard
        }
    })

    const jsonBoards = JSON.stringify(updatedBoards, null, 4)
      fs.writeFileSync('./databases/boards.json', jsonBoards)
}

function addBoardToFile(boards, board, boardTrelloId, fileName, fileExtension){
    if(!board || !boards || !boardTrelloId || !fileName || !fileExtension)
        throw new Error('New board data is undefined')

    const newBoard = {
        id: boardTrelloId,
        name: board.name,
        desc: board.desc,
        color: board.color,
        createAt: getDateNow()
      }
      const newBoards = JSON.stringify([...boards, newBoard], null, 4)
      fs.writeFileSync(`./databases/${fileName}.${fileExtension}`, newBoards)
}

async function deleteBoardFromTrelloById(id){
    if(!id)
        throw new Error('id is undefined')

    const url = process.env.URL
    const key = process.env.KEY
    const token = process.env.TOKEN
    await axios.delete(`${url}/1/boards/${id}?key=${key}&token=${token}`)
}

async function deleteBoardFromFileById(id){
    if(!id)
        throw new Error('id is undefined')

    const updatedBoards = boards.filter(board => board.id !== id)

    const jsonBoards = JSON.stringify(updatedBoards, null, 4)
    await fs.writeFileSync('./databases/boards.json', jsonBoards)
}

module.exports = router