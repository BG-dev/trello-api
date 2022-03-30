const axios = require("axios");
const express = require("express"); 
const { authUser, authRole } = require('../auth')
const boards = require('../databases/cards.json')
const { validateCard } = require('../validators/cardValidator')
const fs = require('fs');

const FILE_NAME = 'cards'
const FILE_EXTENSION = 'json'

const router = express.Router()

router.post('/', authUser, authRole('admin'), async (req, res) => {
    try {
        // const card = req.body.card
        // if(!card)
        //     throw new Error('card is undefined')

        // const { error } = validateCard(card)
        // if(error)
        //     throw new Error(error.details[0].message)

        const lists = await getBoardListsById('624420c4f626f42b44b1c1a9');
        console.log(lists)
        // const id = await createBoardInTrello(board)
        // await addBoardToFile(boards, board, id, FILE_NAME, FILE_EXTENSION)
    
        res.status(200).send({message: 'Card successfully added to the database'})   
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }  
})

const getDateNow = () => {
    const time = new Date()
    return `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()}, ` 
    + `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}

async function getBoardListsById(boardId){
    if(!boardId)
        throw new Error('Board id is undefined')

    const url = process.env.URL
    const response = await axios.get(`${url}/1/boards/${boardId}/lists`, {
        params:{
            key: process.env.KEY,
            token: process.env.TOKEN
        }
      })

    return response
}


module.exports = router