// Modules
require('babel-register')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')('dev')
const twig = require('twig') // Inutile?
const axios = require('axios').default // Permet d'exécuter des requêtes HTTP pour chercher des données

// Variable globales
const app = express()
const port = 8081
// On déclare l'URL de base de l'API
const fetch = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// Middlewares
app.use(morgan)
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Routes
// Page d'accueil
app.get('/', (req, res) => {
    // Utilisation d'une page HTML simple
    // res.sendFile(__dirname + '/views/index.html')
    res.redirect('/members')
})

// Page récupérant tous les membres
app.get('/members', (req, res) => {
    apiCall(req.query.max ? '/members?max=' + req.query.max : '/members', 'get', {}, res, (members) => {
        res.render('members.twig', {
            members: members
        })
    })
})

// Page récupérant un membre en fonction de son ID
app.get('/members/:id', (req, res) => {
    apiCall('/members/' + req.params.id, 'get', {}, res, (member) => {
        res.render('member.twig', {
            member: member
        })
    })
})

// Page gérant la modification d'un membre
app.get('/edit/:id', (req, res) => {
    apiCall('/members/' + req.params.id, 'get', {}, res, (member) => {
        res.render('edit.twig', {
            member: member
        })
    })
})

// Méthode permettant de modifier un membre
app.post('/edit/:id', (req, res) => {
    apiCall('/members/' + req.params.id, 'put', { name: req.body.name }, res, () => {
        res.redirect('/members')
    })
})

// Méthode permettant de supprimer un membre
app.post('/delete', (req, res) => {
    apiCall('/members/' + req.body.id, 'delete', {}, res, () => {
        res.redirect('/members')
    })
})

// Page gérant l'ajout d'un membre
app.get('/insert', (req, res) => {
    res.render('insert.twig')
})

// Méthode permettant d'ajouter un membre
app.post('/insert', (req, res) => {
    apiCall('/members', 'post', { name: req.body.name }, res, () => {
        res.redirect('/members')
    })
})

// Lancement de l'application
app.listen(port, () => console.log('Started on port ' + port))

// Fonctions
// Fonction qui retourne la page d'erreur
function renderError(res, errMsg) {
    res.render('error.twig', {
        errorMsg: errMsg
    })
}

// Fonction qui appelle l'API
function apiCall(url, method, data, res, next) {
    // On détermine la méthode, l'URL et les données envoyés
    // Pour un appel en GET simple, on peut utiliser axios.get().then()
    fetch({
        method: method,
        url: url,
        data: data
    }).then((response) => {
        if (response.data.status == 'success')
            next(response.data.result)
        else
            renderError(res, response.data.result)
    })
        .catch((err) => renderError(res, err.message))
}