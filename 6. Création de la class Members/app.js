const express = require('express')
const app = express()
// Middleware simple qui donne des infos à chaque page chargée
const morgan = require('morgan')('dev')
// On récupère les fonctions d'un autre module
const { success, error, checkAndChange } = require('./assets/functions')
// Pour POST
const bodyParser = require('body-parser')
// On importe la configuration du fichier json
const config = require('./assets/config')
const mysql = require('promise-mysql');

mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
}).then((db) => {
    console.log('Connected')

    // On déclare notre router
    let MembersRouter = express.Router()

    // On appelle la classe Members en passant db et config en paramètres
    let Members = require('./assets/classes/members-class')(db, config)

    // Utilisation du Middleware = module qui sera lu avant chaque requête
    app.use(morgan)

    // On utilise le body-parser
    app.use(bodyParser.json()) // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

    // On utilise le routeur pour nos éléments
    MembersRouter.route('/:id')
        // Fonction GET pour récupérer un membre avec son ID
        .get(async (req, res) => {
            let member = await Members.getByID(req.params.id)
            res.json(checkAndChange(member))
        })

        // Méthode PUT pour modifier un membre avec son ID
        .put(async (req, res) => {
            let updateMember = await Members.update(req.params.id, req.body.name)
            res.json(checkAndChange(updateMember))
        })

        // Méthode DELETE : Suppression d'un membre avec son ID
        .delete(async (req, res) => {
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })

    MembersRouter.route('/')
        // Fonction GET pour récupérer le nom des membres avec un paramètre sur le nombre
        .get(async (req, res) => {
            let allMembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })

        // Méthode POST pour ajouter un membre
        .post(async (req, res) => {
            let addMember = await Members.add(req.body.name)
            res.json(checkAndChange(addMember))
        })

    // On indique le lien et le routeur utilisé
    app.use(config.rootAPI + 'members', MembersRouter)

    // On écoute sur le port indiqué
    app.listen(config.port, () => {
        console.log('Start on port ' + config.port)
    })
}).catch((err) => {
    console.log('Error during database connection')
    console.log(err.message)
})