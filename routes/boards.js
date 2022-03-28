const axios = require("axios");
const express = require("express"); 
const { authUser, authRole } = require('../auth')
const boards = require('../databases/boards.json')
const { validateBoard, validateCard } = require('../validators/boardValidator')
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
    const id = req.params.id

    await updateBoardInTrello(id)
})

router.delete('/:id', authUser, authRole('admin'), async (req, res) => {
    try {
        const id = req.params.id
        if(!board)
            throw new Error('id is undefined')
    
        await deleteBoardFromTrelloById(id)
    
        const data = JSON.stringify(boards.filter(board => board.id !== id), null, 4)
        fs.writeFile('./databases/boards.json', data, () => {console.log('ok')})
        res.status(200).send({message: 'ok!'})    
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

async function updateBoardInTrello(board){
    const url = process.env.URL
    const response = await axios.post(`${url}/1/boards`, {
        name: board.name,
        desc: board.description,
        prefs_background: board.color,
        key: process.env.KEY,
        token: process.env.TOKEN
      })
      console.log(response)
      return response.data.id
}

function addBoardToFile(boards, board, boardTrelloId, fileName, fileExtension){
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
    const url = process.env.URL
    const key = process.env.KEY
    const token = process.env.TOKEN
    await axios.delete(`${url}/1/boards/${id}?key=${key}&token=${token}`)
}

module.exports = router