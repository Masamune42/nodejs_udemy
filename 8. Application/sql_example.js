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
        db.query('SELECT * FROM members', (err, res) => {
            if (err)
                console.log(err.message)
            else
                console.log(res[0].name);
        })
    }
})

