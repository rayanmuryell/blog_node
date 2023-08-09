const e = require('connect-flash')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin}= require ("../helpers/eAdmin")
require ("../models/Usuario")
const Usuario = mongoose.model("usuarios")



router.get('/', eAdmin, (req, res) => {
    res.render("admin/index")
    })

router.get('/posts', eAdmin, (req, res) => {
    res.send("Página de Publicações")
})


router.get('/usuarios', (req, res) => {
    Usuario.find().lean().sort({ nome: 'DESC'}).then((usuarios) =>{
    res.render("admin/usuarios", { usuarios: usuarios })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar os usuários.")
        res.redirect("/admin")
    })
    
})

router.post("/usuarios/edit", (req, res) => {


    Usuario.findOne({_id: req.body.id }).then((usuario) => {


        usuario.nome = req.body.nome
        usuario.email = req.body.email
        usuario.eAdmin = req.body.eadmin


        usuario.save().then(() => {
            req.flash('success_msg', 'Usuário editada com sucesso!')
            console.log(usuario)
            res.redirect("/admin/usuarios")
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a edição.')
            res.redirect("/admin/usuarios")
        })


    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar o usuário!')
        res.redirect("/admin/usuarios")
    })
})

router.get("/usuarios/edit/:id", (req, res) => {
    Usuario.findOne({ _id: req.params.id }).lean().then((usuario) => {
        res.render("admin/usuariosedit", { usuario: usuario })
    }).catch((err) => {
        req.flash('error_msg', 'Este usuário não existe')
        res.redirect("/admin/usuarios")
    })

})


router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().lean().sort({ date: 'DESC' }).then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render("admin/addcategoria")
})

router.post('/categorias/nova', eAdmin, (req, res) => {


    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {

        erros.push({ texto: "Nome inválido" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {

        erros.push({ texto: "Slug inválido" })
    }

    if (erros.length > 0) {
        res.render("admin/addcategoria", { erros: erros })
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria!')
            res.redirect("/admin")
        })
    }
})


router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria })
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/edit", eAdmin, (req, res) => {


    Categoria.findOne({ _id: req.body.id }).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a edição.')
            res.redirect("/admin/categorias")
        })


    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar a categoria!')
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", eAdmin, (req, res) => {

    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        res.redirect("/admin/categorias")
    })

})


router.get('/postagens', eAdmin, (req, res) => {
    Postagem.find().populate("categoria").lean().sort({ data: 'DESC' }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias.")
        res.redirect("/admin")
    })
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", { categorias: categorias })
    }).catch((err) => {
        req.flash('error-msg', 'Houve um erro ao carregar o formulario')
        res.redirect("/admin")
    })
})


router.post("/postagens/nova", eAdmin, (req, res) => {

    var erros = []
    if (req.body.categoria == "0") {
        erros.push({ texto: "Categoria inválida. Registre uma categoria." })
    }
    if (erros.length > 0) {
        res.render("admin/addpostagem", { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug

        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Ocorreu um erro ao registrar a postagem.')
            res.redirect('/admin/postagens')
        })
    }
})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {

    Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })

        }).catch((err) => {
            req.flash("error_msg", "Erro ao acessar a edição da publicação.")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição.")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagem/edit", eAdmin, (req, res) => {

    Postagem.findOne({ _id: req.body.id }).then((postagem) => {
        console.log(req.body)

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            console.log(postagem)
            req.flash('success_msg', "Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash('erro_msg', "Erro interno.")
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', "Houve um erro ao salvar a edição.")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id", eAdmin, (req, res) => {

    Postagem.deleteOne({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Postagem deletada com sucesso.')
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a postagem.')
        res.redirect("/admin/postagens")
    })

})

module.exports = router
