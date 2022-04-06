const { createCardInTrello, updateCardInTrello, deleteCardFromTrello, getBoardListsById } = require('../integration/cardIntegration')
const { replaceArrayElementById, getElementFromArrayById, deleteElementFromArrayById} = require('./arrayService')
const { validateCard } = require('./validators/cardValidator')
const { writeDataToJsonFile } = require('./commandHelper')
const cards = require('../integration/databases/cards.json')

const CARDS_FILE = 'cards.json'

async function addCard(newCardData){
    const { error } = validateCard(newCardData)
    if(error)
        throw new Error(error.details[0].message)

    const lists = await getBoardListsById(newCardData.boardId);
    const listId = getListIdByStatus(newCardData.status, lists)
    const card = await createCardInTrello(newCardData, listId)
    addCardToFile(card)
}

async function updateCard(cardId, newCardData){
    const oldCard = getElementFromArrayById(cards, cardId)
    const newCard = { ...oldCard, ...newCardData }
    const lists = await getBoardListsById(newCard.boardId);
    const listId = getListIdByStatus(newCard.status, lists)

    const { error } = validateCard(newCard)
    if(error)
        throw new Error(error.details[0].message)

    const updatedCard = await updateCardInTrello(newCard, listId)
    await updateCardInFile(updatedCard)
}

async function deleteCard(cardId){
    await deleteCardFromTrello(cardId)
    await deleteCardFromFile(cardId)
}

function addCardToFile(card){
    if(!card )
        throw new Error('Card data is undefined')

      const updatedCards = [...cards, card]
      writeDataToJsonFile(updatedCards, CARDS_FILE)
}

async function updateCardInFile(updatedCard){
    if(!updatedCard)
        throw new Error('data is undefined')

    const updatedCards = replaceArrayElementById(cards, updatedCard)
    writeDataToJsonFile(updatedCards, CARDS_FILE)
}

async function deleteCardFromFile(cardId){
    if(!cardId)
        throw new Error('id is undefined')

    const updatedCards = deleteElementFromArrayById(cards, cardId)
    writeDataToJsonFile(updatedCards, CARDS_FILE)
}

const getListIdByStatus = (status, lists) => lists.find(list => list.name === status).id

module.exports = {
    addCard,
    updateCard,
    deleteCard
}