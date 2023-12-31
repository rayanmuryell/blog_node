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
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuarios")
const passport = require('passport')
require("./config/auth")(passport)

// Configurações

    // Sessão

    app.use(session({

        secret: "cursonode",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    // MiddleWare

    app.use((req, res, next) => {

        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
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



        app.get("/", (req, res) => {
            Postagem.find().populate("categoria").lean().sort({ data: 'DESC' }).then((postagens) => {
            res.render("index", {postagens: postagens})
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao carregar as postagens.")
                res.redirect("/404")
            })
        })


        app.get("/postagem/:slug", (req, res) => {
            Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
                console.log(postagem)
                if(postagem){
                    res.render("postagem/index", {postagem: postagem})
                }else{
                    req.flash("error_msg", "Esta postagem não existe.")
                    res.redirect("/")
                }
            }).catch((err) => {

                req.flash("error_msg", "Houve um erro interno.")
                res.redirect("/")
            })
        })


        app.get("/categorias", (req, res) => {
            Categoria.find().lean().then((categorias) => {               
                res.render("categorias/index", {categorias: categorias})
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar as categorias.")
                res.redirect("/")
            })
        })

        app.get("/categorias/:slug", (req, res) => {
            Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
                if(categoria){

                    Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                        res.render("categorias/postagens", {postagens: postagens, categoria: categoria}) 

                    }).catch((err) => {
                        req.flash("erro_msg", "Houve um erro ao listar os posts.")
                        res.redirect("/")
                    })


                }else{
                    req.flash("error_msg", "Esta categoria não existe")
                    res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao carregar as postagens desta categoria")            
            res.redirect("/")
        })
    })

        app.get("/404", (req, res) => {
        res.send('Erro 404!')
        })
        

// Painel Administrativo
        app.use('/admin', admin)
        app.use('/usuarios', usuarios)

// Outros
const PORT = 8081
app.listen(PORT,() => {

    console.log("Servidor sendo utilizado na porta "+PORT)
})