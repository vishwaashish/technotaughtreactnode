//  register and login

const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const config = require('../config.json');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('../_helpers/db');

router.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

router.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
})

const { host, user, password, database } = config.database;
const conn =  mysql.createConnection({ host, user, password, database });

conn.connect((err)=>{
    if (err) {
        throw err;
    }
    console.log('Mysql Connected');
})

router.post('/register',(req,res)=>{
    sql = 'Select count(*) as ema from users where email = ?';
    console.log(req.body)
    
    conn.query(sql,[req.body.email], async (err,result)=>{
        if(result[0].ema > 0){
            // res.write("Email is already there")
            res.end(JSON.stringify({message: "Email is already there",status:403}))
        }else{
            const now = new Date();
            hashpassword = await bcrypt.hash(req.body.password,10);
            sql = 'INSERT INTO users (name,email,password,createdAt,updatedAt) VALUES (?,?,?,?,?)';
            conn.query(sql,[req.body.name,req.body.email,hashpassword,now,now],(err,result)=>{
                // res.write({message: "Inserted successfully", data:res });
                res.end(JSON.stringify({message: "Inserted successfully",status:200, data:result }));
            })
        }
    })
})

router.post('/updateusername',(req , res)=>{
    sql = 'Update users set name = ? where email = ? ';
    console.log(req.body)
    conn.query(sql,[req.body.name,req.body.email],(err,result)=>{
        if(err) throw err
        res.end(JSON.stringify({message: "Updated successfully",status:200, data:result }));
    })
})

// router.post('/updatepassword',async (req , res)=>{
    // sql = 'Select * from users where email = ? ';
    // console.log(req.body)
    // hashpassword = await bcrypt.hash(req.body.password,10);
    // conn.query(sql,[req.body.email],(err,result)=>{
    //     console.log(hashpassword,"hashpassword")
    //     console.log(result[0].password,"password")
    //     console.log(hashpassword,"hashpassword")
    //     if(hashpassword === result[0].password){
    //         console.log(hashpassword,"hash")
    //         res.end(JSON.stringify({message: "Smae successfully",status:200, data:result }));
    //     }else{
            
    //         res.end(JSON.stringify({message: "NOT successfully",status:200, data:result }));
    //     }
    // })
    // email = req.body.password;
    // const user = await db.User.scope('withHash').findOne({ where: { email } });
    // console.log(user)
    // if (!user || !(await bcrypt.compare(req.bod.password, user.password))){
    //     // throw 'Username or password is incorrect';
    //     return { msg:'Username or password is incorrect', status:401 };
    // }
// })

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

