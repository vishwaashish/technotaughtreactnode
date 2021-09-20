const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const config = require('../config.json');
const fs = require('fs')
const { promisify } = require('util')

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


// showfile
// router.get('/showfilesdropdown', (req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/json' });
//     sql = 'Select * from files';
//     conn.query(sql, (err, result) => {
//         if (err) {
//             console.log(err);
//         };
//         res.write(JSON.stringify(result));
//         res.end();
//     })
// })
router.get('/showfiles', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    sql = 'Select * from files';
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        };
        res.write(JSON.stringify(result));
        res.end();
    })
})

router.get('/showfiles/user/:id', (req, res) => {
    let account = req.params.id;
    res.writeHead(200, { 'Content-Type': 'text/json' });
    sql = 'Select * from files where account =?';
    conn.query(sql,[account], (err, result) => {
        if (err) {
            console.log(err);
        };
        res.write(JSON.stringify(result));
        res.end();
    })
})
router.get('/showfiles/:id', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    let id = req.params.id;
    sql = 'Select * from files WHERE id = ? ';
    conn.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        };
        res.end(JSON.stringify(result));
    })
})
router.get('/showfiles/count/:id', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    let count = Number(req.params.id);
    sql = 'SELECT * FROM files LIMIT ?;'
    conn.query(sql, [count], (err, result) => {
        if (err) { console.log(err) };
        res.end(JSON.stringify(result));
    })
})

router.post('/search', (req, res) => {
    let sql = 'Select count(*) as ema from files where tag like ?';
    conn.query(sql, ['%' + req.body.search + '%'], (err, result) => {
        console.log(result[0].ema)
        if (result[0].ema > 0) {
            let sql = 'Select * from files where tag like ?';
            // let sql = 'Select * from files';
            conn.query(sql, ['%' + req.body.search + '%'], (error, result) => {
                if (error) throw error;
                res.end(JSON.stringify(result));
            })
        } else {
            res.end(JSON.stringify([{ status: 404, message: "Not Found" }]))
        }
    })
})

router.use('/filename', express.static('./upload/images'));

// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req, file, callback) => {
//         return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({
//     storage: storage
// }).single('filename')


// function deleteimage(filename) {
//     const filename1 = filename.split("/").pop();
//     fs.unlink('upload/images/' + filename1, function (err) {
//     })
//     return filename;
// }


// router.post('/insertdata', upload, (req, res) => {

//     console.log(typeof (req.body.tag));
//     const now = new Date();
//     let sql = 'INSERT INTO `files` (`title`, `description`, `file_name`,`tag`, `account`,`createdAt`,`updatedAt`) VALUES (?, ?, ?, ?,?, ?, ?)';
//     conn.query(sql, [req.body.title, req.body.description, 'filename/' + req.file.filename, req.body.tag, req.body.account, now, now], (err, result) => {
//         if (err) throw err;
//         res.end(JSON.stringify({ message: "Insert Successfully", status: 200, result }));
//     })
// })

// router.post('/updatedata/:id', upload, (req, res) => {
//     const id = req.params.id;
//     console.log(req.body, req.file.filename);

//     let sql = 'SELECT * from files where id = ?';
//     conn.query(sql, [id], (err, result) => {
//         const filename = result[0]['file_name'];
//         deleteimage(filename);
//         const now = new Date();
//         let sql = 'UPDATE `files` SET `title` = ? , `description` = ? , `file_name` = ?, `account`= ?, `tag` = ?, `createdAt` = ? , `updatedAt` = ?  WHERE id = ?';
//         conn.query(sql, [req.body.title, req.body.description, 'filename/' + req.file.filename, req.body.account, "ashish,neetesh", now, now, id], (err, result) => {
//             if (err) throw err;
//             // res.write("Updated");
//             res.end(JSON.stringify({ message: "Update Successfully", status: 200, result }));
//         })
//     })

// })




// router.get('/delete/:id', (req, res) => {
//     const id = req.params.id;
//     let sql = 'SELECT * from files where id = ?';
//     conn.query(sql, [id], (err, result) => {
//         const filename = result[0]['file_name'];
//         deleteimage(filename)
//         let sql = 'DELETE from files where id = ?';
//         conn.query(sql, [id], (err, result) => {
//             if (err) throw err;
//             res.end(JSON.stringify({ message: "Delete successfully", status: 200 }));
//         })

//     })

// // 

// })


module.exports = router;