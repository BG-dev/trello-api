const express = require('express')
const dotenv = require('dotenv')
const helmet = require("helmet");
const bodyparser = require('body-parser')
const usersRoutes = require('./routes/users')
const loginRoutes = require('./routes/login')
const boardsRoutes = require('./routes/boards')
const cardsRoutes = require('./routes/cards')
const logger = require('./middlewares/logger')
const { logError, sendError } = require('./middlewares/errorHandler')

dotenv.config();

const app = express()
const port = process.env.PORT || 8000

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(helmet());

app.use('/users', usersRoutes)
app.use('/login', loginRoutes)
app.use('/boards', boardsRoutes)
app.use('/cards', cardsRoutes)

app.use(logError)
app.use(sendError)

app.listen(port, () => {
    logger.info(`Server was started on port: ${port}`)
})
