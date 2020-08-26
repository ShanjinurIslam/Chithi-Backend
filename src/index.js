const express = require('express')
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };

const api_router = require('./routers/api')
const socket = require('./socket')

app = express()

server = https.createServer(options)

socket(server)

app.use('/api',api_router)

app.get('/',(req,res)=>{
    return res.status(200).send('Welcome to Chithi Backend')
})

server.listen(process.env.PORT,()=>{
    console.log("Server started at port ",process.env.PORT)
})