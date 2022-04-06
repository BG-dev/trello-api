const axios = require("axios");
const getDateNow = require('../service/dateService')

async function createCardInTrello(cardData, listId){
    if(!cardData || !listId)
        throw new Error('Incorrect data')

    const url = process.env.URL
    const response = await axios.post(`${url}/1/cards`, {
        idList: listId,
        key: process.env.KEY,
        token: process.env.TOKEN,
        name: cardData.name,
        desc: cardData.desc,
        due: cardData.dueDate
    })
    const {id} = response.data

    return { 
        id,
        ...cardData,
        listId,
        createAt: getDateNow()
    }
}  

async function updateCardInTrello(newCard, listId){
    if(!newCard || !listId)
        throw new Error('Incorrect data for card updating')

    const id = newCard.id
    const url = process.env.URL
    await axios.put(`${url}/1/cards/${id}`, {
        idList: listId,
        idBoard: newCard.boardId,
        key: process.env.KEY,
        token: process.env.TOKEN,
        name: newCard.name,
        desc: newCard.desc,
        due: newCard.dueDate
      })

    return {
        ...newCard,
        listId
    }
}

async function deleteCardFromTrello(cardId){
    if(!cardId)
        throw new Error('Card id is undefined')

    const url = process.env.URL
    const key = process.env.KEY
    const token = process.env.TOKEN
    await axios.delete(`${url}/1/cards/${cardId}`, {
        params:{
            key: key,
            token: token
        }
    })
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

module.exports = {
    createCardInTrello,
    updateCardInTrello,
    deleteCardFromTrello,
    getBoardListsById
}