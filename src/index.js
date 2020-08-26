require('dotenv').config()
const app = require('express')()
const http = require('http')
const bodyParser = require('body-parser')

// routes
const apiRouter = require("./routers/api")
const adminRouter = require("./routers/admin")

server = http.createServer(app)

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

require('./database')

const socket = require('./socket')
socket(server)


app.use('/api',apiRouter)
app.use('/',adminRouter)

const port = process.env.PORT || 3000;

server.listen(port);
