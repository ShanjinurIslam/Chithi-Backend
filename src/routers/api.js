const express = require('express')

const router = express.Router()

router.get('/',(req,res)=>{
    return res.send({messege:'Hello World'})
})

module.exports = router