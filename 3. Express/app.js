const express = require('express')
const morgan = require('morgan');
const app = express()

const members = [
    {
        id: 1,
        name: 'John'
    },
    {
        id: 2,
        name: 'Julie'
    },
    {
        id: 3,
        name: 'Jack'
    },
]

// Utilisation du Middleware = module qui sera lu avant chaque requête
// Exemple 1: Utilisation classique
// next : fonction qu'on va utiliser pour indiquer que le Middleware est fini
// app.use((req, res, next) => {
//     console.log('URL : ' + req.url);
//     next()
// })
// Exemple 2: Utilisation d'un package
app.use(morgan('dev'))

// Exemple de requêtes
// Requête GET simples
app.get('/api', (req, res) => {
    res.send('Root API')
})
app.get('/api/v1', (req, res) => {
    res.send('API version 1')
})

// Requête GET avec paramètre id
app.get('/api/v1/books/:id/:id2', (req, res) => {
    res.send(req.params)
})

// Fonction GET pour récupérer le nom d'un membre
app.get('/api/v1/members/:id', (req, res) => {
    res.send(members[(req.params.id) - 1].name)
})

app.get('/api/v1/members', (req, res) => {
    if(req.query.max != undefined && req.query.max > 0) {
        res.send(members.slice(0, req.query.max))
    } else {
        res.send(members)
    }
})


app.listen(8080, () => {
    console.log('Start on port 8080')
})