const express = require('express')
const usuariosRoutes = require('./usuarios.routes')

const app = express()

app.use('/', usuariosRoutes)

module.exports = app;