const express = require('express')
const router = express.Router()


const Noticia = require('../models/noticia')


router.use((req, res, next)=> {
    //check if is logged
    if(req.isAuthenticated()){
        //check if has a role 'admin' into the user 
        if(req.user.roles.indexOf('admin')>=0){
            return next()
            //else redirect to main home '/'
        }else{
            res.redirect('/')
        }
        
    }
    res.redirect('/login')
   
})

router.get('/', (req, res)=> {

    res.send('admin')
})


router.get('/noticias', async(req, res)=> {
    const noticias = await Noticia.find({})
    res.render('noticias/admin',{noticias})
})

module.exports = router