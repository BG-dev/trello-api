const axios = require("axios");
const express = require("express"); 
const { authUser, authRole } = require('../../auth')
const cards = require('../../integration/databases/cards.json')
const { validateCard } = require('../../service/validators/cardValidator')
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
        const newCard = await createCardInTrello(card)
        await addCardToFile(newCard, FILE_NAME, FILE_EXTENSION)
    
        res.status(200).send({message: 'Card successfully added to the database'})   
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }  
})

router.put('/:id', authUser, authRole('admin'), async (req, res) => {
    try {
        const id = req.params.id
        const card = req.body.card
        if(!card || !id)
            throw new Error('data is undefined')

        const oldCard = getCardById(id)
        const newCard = { ...oldCard, ...card }
        const lists = await getBoardListsById(newCard.boardId);
        const listId = getListIdByStatus(newCard.status, lists)
        newCard.listId = listId
        const { error } = validateCard(newCard)
        if(error)
            throw new Error(error.details[0].message)

        await updateCardInTrello(newCard)
        await updateCardInFile(newCard)

        res.status(200).send({message: 'Card successfully updated in the database'})   
    } catch (error) {
        res.status(400).send({message: `${error}`})
    }

})

router.delete('/:id', authUser, authRole('admin'), async (req, res) => {
    try {
        const id = req.params.id
        if(!id)
            throw new Error('id is undefined')
    
        await deleteCardFromTrelloById(id)
        await deleteCardFromFileById(id)
        
        res.status(200).send({message: 'Cards has been deleted!'})    
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

function addCardToFile(card, fileName, fileExtension){
    if(!card || !fileName || !fileExtension)
        throw new Error('New card data is undefined')

    const newCard = {
        ...card,
        createAt: getDateNow()
      }
      const newCards = JSON.stringify([...cards, newCard], null, 4)
      fs.writeFileSync(`./databases/${fileName}.${fileExtension}`, newCards)
}

async function deleteCardFromTrelloById(id){
    if(!id)
        throw new Error('id is undefined')

    const url = process.env.URL
    const key = process.env.KEY
    const token = process.env.TOKEN
    await axios.delete(`${url}/1/cards/${id}?key=${key}&token=${token}`)
}

const getCardById = (id) => cards.find(card => card.id === id)

async function deleteCardFromFileById(id){
    if(!id)
        throw new Error('id is undefined')

    const updatedCards = cards.filter(card => card.id !== id)

    const jsonCards = JSON.stringify(updatedCards, null, 4)
    await fs.writeFileSync('./databases/cards.json', jsonCards)
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

async function updateCardInTrello(newCard){
    if(!newCard)
        throw new Error('data is undefined')

    const id = newCard.id
    const url = process.env.URL
    await axios.put(`${url}/1/cards/${id}`, {
        idList: newCard.listId,
        idBoard: newCard.boardId,
        key: process.env.KEY,
        token: process.env.TOKEN,
        name: newCard.name,
        desc: newCard.desc,
        due: newCard.dueDate
      })

}

async function updateCardInFile(newCard){
    if(!newCard)
        throw new Error('data is undefined')

    const updatedCards = cards.map(card => card.id === newCard.id ? newCard : card)
    
    const jsonCards = JSON.stringify(updatedCards, null, 4)
    fs.writeFileSync('./databases/cards.json', jsonCards)
}

getListIdByStatus = (status, lists) => lists.find(list => list.name === status).id

module.exports = router