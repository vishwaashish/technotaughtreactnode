const { verify } = require('jsonwebtoken');
const config = require('../config.json');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));

    // "secret": "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
module.exports = {
    checkToken: (req,res,next) => {
        const token  = req.get("authorization");
        console.log(token);
        if(token){
            token1 = token.slice(7);
            console.log(token1);
            // token = token.split(' ')[1];
            verify(token1,config.secret,(err, decoded)=>{
                if(err){
                    res.json({
                        status:403,
                        message: "Invalid token"
                    })
                }else{
                    next();
                }
            })
        }else{
            res.json({
                status:403,
                message:"Access denied! unautorized user"
            });
        }
    }
},router;