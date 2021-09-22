//  register and login

const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const config = require('../config.json');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('../_helpers/db');
var fs = require('fs');
router.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));

router.use((req, res, next) => {
    res.header({ "Access-Control-Allow-Origin": "*" });
    next();
})

const { host, user, password, database } = config.database;
const conn = mysql.createConnection({ host, user, password, database });

conn.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql Connected');
})

router.post('/register', (req, res) => {
    // data = new Array();
    // data.push(req.body)
    
    // console.log(data,"obj1")
    // fs.writeFile('./user.json', JSON.stringify(data), 'utf8', (err) => {
    //     if (err) console.log('Error writing file:', err);
    // })
    // fs.readFile('./user.json', 'utf8', (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         data = JSON.parse(result);
    //         data.push(req.body);
    //         json = JSON.stringify(data,null,2);
    //         fs.writeFile('user.json',json,'utf8',(err) => {
    //             if (err) console.log('Error writing file:', err);
    //         })
    //         // console.log(obj.data,"obj")
    //     }
    //     })


    sql = 'Select count(*) as ema from users where email = ?';
    console.log(req.body)

    conn.query(sql, [req.body.email], async (err, result) => {
        if (result[0].ema > 0) {
            // res.write("Email is already there")
            res.end(JSON.stringify({ message: "Email is already there", status: 403 }))
        } else {
            const now = new Date();
            hashpassword = await bcrypt.hash(req.body.password,10);
            sql = 'INSERT INTO users (name,email,password,createdAt,updatedAt) VALUES (?,?,?,?,?)';
            conn.query(sql,[req.body.name,req.body.email,hashpassword,now,now],(err,result)=>{
                res.end(JSON.stringify({message: "Inserted successfully",status:200, data:result }));
            })
            res.end()
        }
    })
})

router.post('/updateusername', (req, res) => {
    sql = 'Update users set name = ? where email = ? ';
    console.log(req.body)
    conn.query(sql, [req.body.name, req.body.email], (err, result) => {
        if (err) throw err
        res.end(JSON.stringify({ message: "Updated successfully", status: 200, data: result }));
    })
})

router.post('/updatepassword', authenticatepassword);
function authenticatepassword(req, res, next) {
    userService.authenticatepassword(req.body)
        .then(user => res.json(user))
        .catch(next);
}

// routes
router.post('/login', authenticate);

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}
module.exports = router;

