const app = require('express')()
const http = require('http')

server = http.createServer(app)

const socket = require('./socket')
socket(server)

app.get('/', (req, res) => {
    res.send("Welcome to Chithi Messeging Application")
})

server.listen(process.env.PORT)