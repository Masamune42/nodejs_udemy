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

            // Méthode PUT pour modifier un membre avec son ID
            .put((req, res) => {

                if (req.body.name) {
                    db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            if (result[0] != undefined)
                                db.query('SELECT * FROM members WHERE name = ? AND id != ?', [req.body.name, req.params.id], (err, result) => {
                                    if (err) {
                                        res.json(error(err.message))
                                    } else {
                                        if (result[0] != undefined)
                                            res.json(error('same name'))
                                        else {
                                            db.query('UPDATE members SET name = ? WHERE id = ?', [req.body.name, req.params.id], (err, result) => {
                                                if (err) {
                                                    res.json(error(err.message))
                                                } else {
                                                    res.json(success(true))
                                                }
                                            })
                                        }
                                    }
                                })
                            else
                                res.json(error('Wrong id !'))
                        }
                    })
                } else {
                    res.json(error('no name value'))
                }
            })

            // Méthode DELETE : Suppression d'un membre avec son ID
            .delete((req, res) => {
                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                    if (err) {
                        res.json(error(err.message))
                    } else {
                        if (result[0] != undefined) {
                            db.query('DELETE FROM members WHERE id = ?', [req.params.id], (err, result) => {
                                if (err) {
                                    res.json(error(err.message))
                                } else {
                                    res.json(success(true))
                                }
                            })
                        } else
                            res.json(error('Wrong id !'))
                    }
                })
            })

        MembersRouter.route('/')
            // Fonction GET pour récupérer le nom des membres avec un paramètre sur le nombre
            .get((req, res) => {
                if (req.query.max != undefined && req.query.max > 0) {
                    db.query('SELECT * FROM members ORDER BY id LIMIT 0, ?', [parseInt(req.query.max)], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            res.json(success(result))
                        }
                    })
                } else if (req.query.max != undefined) {
                    res.json(error('Wrong max value !'))
                } else {
                    db.query('SELECT * FROM members ORDER BY id', (err, result) => {
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
                    db.query('SELECT * FROM members WHERE name = ?', [req.body.name], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            if (result[0] != undefined) {
                                res.json(error('name already taken'))
                            } else {
                                db.query('INSERT INTO members(name) VALUES(?)', [req.body.name], (err, result) => {
                                    if (err) {
                                        res.json(error(err.message))
                                    } else {
                                        res.json(success({
                                            id: result.insertId,
                                            name: req.body.name
                                        }))
                                    }
                                })
                            }
                        }
                    })
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