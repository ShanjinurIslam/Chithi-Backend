require('dotenv').config()
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const path = require('path')

app = express()

// paths
const viewsPath = path.join(__dirname + '/views')
const publicPath = path.join(__dirname + '/public')

// routes
const apiRouter = require("./routers/api")
const adminRouter = require("./routers/admin")

server = http.createServer(app)

app.use(express.static(publicPath))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

require('./database')

const socket = require('./socket')
socket(server)

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use('/api',apiRouter)
app.use('/',adminRouter)

const port = process.env.PORT || 3000;


server.listen(port, '127.0.0.1', function() {
    server.close(function() {
        server.listen(port, '192.168.0.101')
    })
})
/*
server.listen(port)*/
