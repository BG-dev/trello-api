const express = require('express')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const usersRoutes = require('./routes/users.js')
const loginRoutes = require('./routes/login.js')
const boardsRoutes = require('./routes/boards.js')
const cardsRoutes = require('./routes/cards.js')

dotenv.config();

const app = express()
const port = process.env.PORT || 8000

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use('/users', usersRoutes)
app.use('/login', loginRoutes)
app.use('/boards', boardsRoutes)
app.use('/cards', cardsRoutes)

app.listen(port, () => {
    console.log(`Server was started on port: ${port}`)
})
