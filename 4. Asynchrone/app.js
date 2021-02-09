// 1. Callbacks
// Pour gérer les attentes, on effectue un système d'imbrications
// console.log('Début')
// // 2e paramètre = fonction next() dans getMember
// getMember((member) => {
//     console.log(member);
//     // 2e paramètre = fonction next() dans getArticle
//     getArticle(member, (articles) => {
//         console.log(articles)
//     })
// })
// console.log('Fin')


// function getMember(next) {
//     setTimeout(() => {
//         next('Member 1')
//     }, 1500)
// }

// function getArticle(member, next) {
//     setTimeout(() => {
//         next([1, 2, 3])
//     }, 1500)
// }

// 2. Promise
// Exemple
// console.log('Début')
// // Déclaration de la promise
// // resolve et reject sont des fonctions que l'on va écouter en cas de succès et d'erreur
// new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // Succès
//         resolve('All good.')
//         // Echec
//         // reject(new Error('Error during...'))
//     }, 1500)

// })
//     // En cas de succès
//     .then((message) => console.log(message))
//     // En cas d'erreur
//     .catch((err) => console.log(err.message))
// console.log('Fin')

// Exemple 2 : Promise simple
// console.log('Début')
// getMember()
//     .then((member) => getArticle(member))
//     .then((articles) => console.log(articles))
//     .catch(err => console.log(err.message))

// function getMember() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('Member 1')
//             resolve('Member 1')
//         }, 1500)
//     })
// }

// function getArticle(member) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve([1, 2, 3])
//         }, 1500)
//     })
// }
// console.log('Fin')

// Exemple 2 : Promise en parallèle
// console.log('Début')
// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('Promise 1')
//     }, 1500)
// })
// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('Promise 2')
//     }, 3000)
// })

// // On attend que toutes les Promise soient finies
// // .race pour comparer la vitesse des promesses et renvoyer la plus rapide
// Promise.all([p1, p2])
//     .then(result => console.log(result))
// console.log('Fin')

// Async / Await
console.log('Début');
// Appel 1
// async function viewArticles() {
//     let member = await getMember()
//     let articles = await getArticle(member)
//     console.log(articles);
// }
// viewArticles()

// Appel 2
// On doit placer un ; avant d'utiliser ce style d'appel
(async () => {
    try {
        let member = await getMember()
        let articles = await getArticle(member)
        console.log(articles)
    } catch (error) {
        console.log(error.message);
    }
})()

function getMember() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Member 1')
            resolve('Member 1')
        }, 1500)
    })
}

function getArticle(member) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([1, 2, 3])
        }, 1500)
    })
}
console.log('Fin')