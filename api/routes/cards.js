const express = require("express"); 
const { authUser, authRole } = require('../middlewares/auth')
const { addCard, updateCard, deleteCard } = require('../../service/cardService')

const router = express.Router()

router.post('/', authUser, authRole('admin'), async (req, res) => {
    try {
        const cardData = req.body.card
        if(!cardData)
            throw new Error('card is undefined')
    
        await addCard(cardData)
        res.status(200).send({message: 'Card successfully added to the database'})   
    } catch (error) {
        next(error)
    }  
})

router.put('/:id', authUser, authRole('admin'), async (req, res) => {
    try {
        const id = req.params.id
        const card = req.body.card
        if(!card || !id)
            throw new Error('data is undefined')

        await updateCard(id, card)
        res.status(200).send({message: 'Card successfully updated in the database'})   
    } catch (error) {
        next(error)
    }

})

router.delete('/:id', authUser, authRole('admin'), async (req, res) => {
    try {
        const id = req.params.id
        if(!id)
            throw new Error('id is undefined')
        
        await deleteCard(id)
        res.status(200).send({message: 'Cards has been deleted!'})    
    } catch (error) {
        next(error)
    }
})

module.exports = router