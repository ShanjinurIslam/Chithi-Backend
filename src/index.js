require('dotenv').config()
const app = require('express')()
const http = require('http')

server = http.createServer(app)

require('./database')

const socket = require('./socket')
socket(server)

const apiRouter = require("./routers/api")

app.use('/api',apiRouter)

app.get('/', (req, res) => {
    res.send("Welcome to Chithi Messeging Application")
})

const port = process.env.PORT || 3000;

server.listen(port);
