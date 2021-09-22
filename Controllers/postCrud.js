const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const config = require('../config.json');
const fs = require('fs')

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

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
}).single('filename')


function deleteimage(filename) {
    const filename1 = filename.split("/").pop();
    fs.unlink('upload/images/' + filename1, function (err) {
    })
    return filename;
}

router.post('/insertdata', upload, (req, res) => {
    console.log(typeof (req.body.tag));
    const now = new Date();
    let sql = 'INSERT INTO `files` (`title`, `description`, `file_name`,`tag`, `account`,`createdAt`,`updatedAt`) VALUES (?, ?, ?, ?,?, ?, ?)';
    conn.query(sql, [req.body.title, req.body.description, 'filename/' + req.file.filename, req.body.tag, req.body.account, now, now], (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify({ message: "Insert Successfully", status: 200, result }));
    })
})

router.post('/updatedata/:id', upload, (req, res) => {
    const id = req.params.id;
    console.log(req.body, req.file.filename);

    let sql = 'SELECT * from files where id = ?';
    conn.query(sql, [id], (err, result) => {
        const filename = result[0]['file_name'];
        deleteimage(filename);
        const now = new Date();
        let sql = 'UPDATE `files` SET `title` = ? , `description` = ? , `file_name` = ?, `account`= ?, `tag` = ?, `createdAt` = ? , `updatedAt` = ?  WHERE id = ?';
        conn.query(sql, [req.body.title, req.body.description, 'filename/' + req.file.filename, req.body.account, req.body.tag, now, now, id], (err, result) => {
            if (err) throw err;
            // res.write("Updated");
            res.end(JSON.stringify({ message: "Update Successfully", status: 200, result }));
        })
    })

})

router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    let sql = 'SELECT * from files where id = ?';
    conn.query(sql, [id], (err, result) => {
        const filename = result[0]['file_name'];
        deleteimage(filename)
        let sql = 'DELETE from files where id = ?';
        conn.query(sql, [id], (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify({ message: "Delete successfully", status: 200 }));
        })
    })
})


module.exports = router;