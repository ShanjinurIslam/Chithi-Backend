const router = require('express').Router()

router.get('/',(req,res)=>{
    return res.render('index',{title:'Chithi App'})
})

router.get('/admin',(req,res)=>{
    return res.status('200').send('Welcome to admin panel')
})


router.get('/test',(req,res)=>{
    return res.render('test',{title:'Socket IO Test'})
})

module.exports = router