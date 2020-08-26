const express = require('express')
const http = require('https');

const api_router = require('./routers/api')
const socket = require('./socket')

app = express()

server = http.createServer(app)

socket(server)

app.use('/api',api_router)

app.get('/',(req,res)=>{
    return res.status(200).send('Welcome to Chithi Backend')
})

server.listen(process.env.PORT,()=>{
    console.log("Server started at port ",process.env.PORT)
})