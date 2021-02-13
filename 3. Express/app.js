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

// Déclaration des membres
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

// On déclare notre router
let MembersRouter = express.Router()

// Utilisation du Middleware = module qui sera lu avant chaque requête
// Exemple 1: Utilisation classique
// next : fonction qu'on va utiliser pour indiquer que le Middleware est fini
// app.use((req, res, next) => {
//     console.log('URL : ' + req.url);
//     next()
// })
// Exemple 2: Utilisation d'un package
app.use(morgan('dev'))

// On utilise le body-parser
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// On utilise le routeur pour nos éléments
MembersRouter.route('/:id')
    // Fonction GET pour récupérer un membre avec son ID
    .get((req, res) => {
        let index = getIndex(req.params.id)
        if (typeof (index) === 'string') {
            res.json(error(index))
        } else {
            res.json(success(members[index]))
        }
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
            res.json(success(members.slice(0, req.query.max)))
        } else if (req.query.max != undefined) {
            res.json(error('Wrong max value !'))
        } else {
            res.json(success(members))
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