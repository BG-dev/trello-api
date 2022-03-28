const axios = require("axios");
const express = require("express"); 
const { authUser, authRole } = require('../auth')
const boards = require('../databases/boards.json')
const { validateBoard, validateCard } = require('../validators/boardValidator')
const fs = require('fs');


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
        const { error } = validateBoard(req.body.board)
        if(error)
            return res.status(400).send({message: error.details[0].message})
        
        const id = await createBoardInTrello(board)
    
        const boardData = {
          id: id,
          name: board.name,
          desc: board.desc,
          color: board.color,
          createAt: getDateNow()
        }
        const data = JSON.stringify([...boards, boardData], null, 4)
        fs.writeFile('./databases/boards.json', data, () => {console.log('ok')})
    
        res.status(200).send({message: 'Board successfully added to the database'})   
    } catch (error) {
        console.log(error)
        res.status(403).send({message: `Error: ${error}`})
    }  
})

router.put('/:id', authUser, authRole('admin'), async (req, res) => {
    const id = req.params.id

    await updateBoardInTrello(id)
})

router.delete('/:id', authUser, authRole('admin'), async (req, res) => {
    const id = req.params.id
    
    await deleteBoardFromTrelloById(id)

    const data = JSON.stringify(boards.filter(board => board.id !== id), null, 4)
    fs.writeFile('./databases/boards.json', data, () => {console.log('ok')})
    res.status(200).send({message: 'ok!'})
})

const getDateNow = () => {
    const time = new Date()
    return `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()}, ` 
    + `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}

const getBoardById = (id) => boards.find(board => board.id === id)

async function createBoardInTrello(newBoard){
    const url = process.env.URL
    const response = await axios.post(`${url}/1/boards`, {
        name: newBoard.name,
        desc: newBoard.description,
        prefs_background: newBoard.color,
        key: process.env.KEY,
        token: process.env.TOKEN
      })
      console.log(response)
      return response.data.id
}

async function updateBoardInTrello(newBoard){
    const url = process.env.URL
    const response = await axios.post(`${url}/1/boards`, {
        name: newBoard.name,
        desc: newBoard.description,
        prefs_background: newBoard.color,
        key: process.env.KEY,
        token: process.env.TOKEN
      })
      console.log(response)
      return response.data.id
}

async function deleteBoardFromTrelloById(id){
    const url = process.env.URL
    const key = process.env.KEY
    const token = process.env.TOKEN
    await axios.delete(`${url}/1/boards/${id}?key=${key}&token=${token}`)
}

module.exports = router