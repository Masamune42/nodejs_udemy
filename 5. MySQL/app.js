const express = require('express')
const app = express()
// Middleware simple qui donne des infos à chaque page chargée
const morgan = require('morgan')
// On récupère les fonctions d'un autre module
const { success, error } = require('functions')
// Pour POST
const bodyParser = require('body-parser')
// On importe la configuration du fichier json
const config = require('./config')
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    database: 'node_js',
    user: 'root',
    password: ''
})

db.connect((err) => {
    if (err)
        console.log(err.message)
    else {
        console.log('Connected')

        // On déclare notre router
        let MembersRouter = express.Router()

        // Utilisation du Middleware = module qui sera lu avant chaque requête
        app.use(morgan('dev'))

        // On utilise le body-parser
        app.use(express.json()) // for parsing application/json
        app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

        // On utilise le routeur pour nos éléments
        MembersRouter.route('/:id')
            // Fonction GET pour récupérer un membre avec son ID
            .get((req, res) => {

                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                    if (err) {
                        res.json(error(err.message))
                    } else {
                        if (result[0] != undefined)
                            res.json(success(result))
                        else
                            res.json(error('Wrong id !'))
                    }
                })
            })

            // Méthode PUT pour changer un membre avec son ID
            .put((req, res) => {
                let index = getIndex(req.params.id)
                if (typeof (index) === 'string') {
                    res.json(error(index))
                } else {
                    let same = false

                    for (let i = 0; i < members.length; i++) {
                        if (req.body.name == members[i].name && req.params.id != members[i].id) {
                            same = true;
                            break
                        }
                    }
                    if (same) {
                        res.json(error('same name'))
                    } else {
                        members[index].name = req.body.name
                        res.json(success(true))
                    }
                }
            })

            // Méthode DELETE : Suppression d'un membre avec son ID
            .delete((req, res) => {
                let index = getIndex(req.params.id)
                if (typeof (index) === 'string') {
                    res.json(error(index))
                } else {
                    members.splice(index, 1)
                    res.json(success(true))
                }
            })

        MembersRouter.route('/')
            // Fonction GET pour récupérer le nom des membres avec un paramètre sur le nombre
            .get((req, res) => {
                if (req.query.max != undefined && req.query.max > 0) {
                    db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(req.query.max)], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            res.json(success(result))
                        }
                    })
                } else if (req.query.max != undefined) {
                    res.json(error('Wrong max value !'))
                } else {
                    db.query('SELECT * FROM members', (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            res.json(success(result))
                        }
                    })
                }
            })

            // Méthode POST pour ajouter un membre
            .post((req, res) => {
                if (req.body.name) {
                    let sameName = false
                    // Pour chaque membre, on vérifie si le nom existe déjà
                    for (let i = 0; i < members.length; i++) {
                        // Si on trouve le nom, on passe sameName à true
                        if (members[i].name == req.body.name) {
                            sameName = true;
                            break
                        }
                    }
                    // Si on a trouvé le même nom on renvoie une erreur, sinon on ajoute le nom dans le tableau
                    if (sameName) {
                        res.json(error('name already taken'))
                    } else {
                        let member = {
                            id: createID(),
                            name: req.body.name
                        }
                        members.push(member)
                        res.json(success(member))
                    }
                } else {
                    res.json(error('no name value'))
                }
            })

        // On indique le lien et le routeur utilisé
        app.use(config.rootAPI + 'members', MembersRouter)

        // On écoute sur le port indiqué
        app.listen(config.port, () => {
            console.log('Start on port ' + config.port)
        })
    }

})

// Fonction qui permet de vérifier si l'id existe
function getIndex(id) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].id == id)
            return i
    }
    return 'wrong id';
}

// Fonction qui retourne le numéro du dernier id + 1
function createID() {
    return members[members.length - 1].id + 1
}