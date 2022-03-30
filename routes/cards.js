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
        const card = req.body.card
        if(!card)
            throw new Error('card is undefined')

        const { error } = validateCard(card)
        if(error)
            throw new Error(error.details[0].message)

        const lists = await getBoardListsById(card.boardId);
        const listId = getListIdByStatus(card.status, lists)
        card.listId = listId
        await createCardInTrello(card)
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

async function createCardInTrello(card){
    if(!card)
        throw new Error('New card data is undefined')
console.log(card)
    const url = process.env.URL
    const response = await axios.post(`${url}/1/cards`, {
        idList: card.listId,
        key: process.env.KEY,
        token: process.env.TOKEN,
        name: card.name,
        desc: card.desc,
        due: card.dueDate
    })
    
    return { id: response.data.id, ...card}
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
    return response.data
}

getListIdByStatus = (status, lists) => lists.find(list => list.name === status).id

module.exports = router