const router = require('express').Router()

router.get('/',(req,res)=>{
    return res.status('200').send('Hello World')
})

router.get('/admin',(req,res)=>{
    return res.status('200').send('Welcome to admin panel')
})

module.exports = router