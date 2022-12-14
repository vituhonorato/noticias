const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./models/user')
const noticias = require('./routes/noticias')
const Noticia = require('./models/noticia')
const restrito = require('./routes/restrito')
const auth = require('./routes/auth')
const pages = require('./routes/pages')
const admin = require('./routes/admin')
const session = require('express-session')
const app = express()
const path = require('path')


const port = process.env.PORT || 3000
mongoose.Promise = global.Promise
const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

//STATIC FILES ASSESTS
app.use(express.static('public'))
app.use(express.static(__dirname +"public/css"));
app.use(express.static(__dirname +"public/js"));
app.use(express.static(__dirname +"public/img"));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


//configuração responsável por direcionar consulta a pasta view ao tipo de arquivo ejs TEMPLATE ENGINE 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs')

//ROUTES
app.use(session({
    secret: 'fullstack-master',
    resave: true,
    saveUninitialized: true
}))

app.use('/', auth)
app.use('/', pages)

app.use('/noticias', noticias)
app.use('/restrito', restrito)
app.use('/admin', admin)




//CREATE USER    passa uma condicional de criação caso não tenha nenhum usuario criado ele cria um admin automaticamente
const createInitialUser = async() => {
    const total = await User.count({})
    if(total === 0){
        const user = new User({
            username: "user1",
            password: "1234",
            roles:['restrito', 'admin']
        })
        await user.save()
        const user2 = new User({
            username: "user2",
            password: "1234",
            roles:['restrito']
        })
        await user2.save()

        console.log('User created')
    }else{
        console.log('user created skipped')
    }
    const noticia = new Noticia({
        title:'Noticia Publíca '+new Date().getTime(),
        content: 'content',
        category: 'public'
    })
    await noticia.save()
    
    const noticia2 = new Noticia({
        title:'Noticia Privada 1'+new Date().getTime(),
        content: 'content',
        category: 'private'
    })
    await noticia2.save()
}


mongoose
.connect(mongo, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
    createInitialUser()
     app.listen(port, ()=> console.log('Server running...'))
})
.catch(e => console.log(e))





