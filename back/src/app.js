
const express = require('express')
const morgan = require('morgan')
const APIRoutes = require('./routes/routes')
const cors = require('cors')
const errorMiddleware = require('./middlewares/errorMiddleware')
const {registrarConsulta, registrarRespuesta}  = require('./middlewares/registrarConsulta')

const app = express()

// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(registrarConsulta)
app.use(registrarRespuesta)
app.use(errorMiddleware)

// Routes
app.use('/', APIRoutes)

module.exports = app