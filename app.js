// Carregando módulos de dependência
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require ('connect-flash')
const { nextTick } = require('process')

// Configurações

    // Sessão

    app.use(session({

        secret: "cursonode",
        resave: true,
        saveUninitialized: true
    }))

    app.use(flash())
    // MiddleWare

    app.use((req, res, next) => {

        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    // BodyParser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    // HandleBars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine','handlebars')

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(() => {
        console.log("Conectado ao banco de dados do MONGODB")
        }).catch((err) => {
            console.log("Erro ao se conectar ao banco de dados."+err)
        })

// Publics

    app.use(express.static(path.join(__dirname,"public")))

// Rotas

    app.use('/admin', admin)


// Outros
const PORT = 8081
app.listen(PORT,() => {

    console.log("Servidor sendo utilizado na porta "+PORT)
})