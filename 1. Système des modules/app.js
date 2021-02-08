// Module en rapport avec le système d'exploitation
const os = require('os');
// Module pour lire et écrire sur un fichier
const fs = require('fs');
const http = require('http');

// Module os
// Affiche l'architecture (x64)
// console.log(os.arch());
// Affiche le dossier actuel
// console.log(os.homedir());
// Affiche les infos du CPU
// console.log(os.cpus());

// Module fs
// Lecture d'un fichier
// fs.readFile('test.txt', 'utf-8', (err, data) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data);
//         // Ecriture d'un fichier
//         fs.writeFile('test.txt', 'Hello World!', 'utf-8', (err) => {
//             if (err)
//                 console.log(err);
//             // Lecture du fichier
//             fs.readFile('test.txt', 'utf-8', (err, data) => {
//                 console.log(data);
//             })
//         });
//     }
// });

// Module http
// http.createServer((req, res) => {
//     // Si on a rien ajouté à la requête
//     if (req.url == '/') {
//         res.writeHead(200, { 'Content-type': 'text/html' });
//         res.write('<h1>Accueil</h1>\n');
//     } else {
//         res.writeHead(404, { 'Content-type': 'text/html' })
//         res.write('<span style="color:red">Erreur 404</span>');
//     }
//     res.end();
// }).listen(8080);

// Http + module
http.createServer((req, res) => {
    // Si on a rien ajouté à la requête
    if (req.url == '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.write('<h1>Accueil</h1>\n');
        res.end();
    } else if (req.url == '/test') {
        fs.readFile('./test.txt', 'utf-8', (err, data) => {
            if (err) {
                send404(res);
            } else {
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.write(data);
                res.end();
            }
        });
    } else {
        send404(res);
    }

}).listen(8080);

function send404(res) {
    res.writeHead(404, { 'Content-type': 'text/html' })
    res.write('<span style="color:red">Erreur 404</span>');
    res.end();
}