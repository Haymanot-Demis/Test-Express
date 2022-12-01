const express = require('express');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const Users = require('../models/users');

userRouter.use(bodyParser.json());


userRouter.post('/signup', (req, res, next) => {
    console.log("From sign up of user router");
    const {username , password} = req.body;
    console.log(username, password);
    Users.findOne({username})
    .then(user => {
        if (user !== null){
            const err = new Error("Username " + username + "already exists")
            res.statusCode = 403
            return next(err)
        }
        return Users.create({username,password})
    })
    .then(user => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.json(user)
    })
    .catch(err => {
        next(err)
    })
})

userRouter.post('/signin', (req, res, next) => {
    if(!req.session.user){
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
            return;
        }

        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        Users.findOne({username:user, password:pass})
        .then(user => {
            if(user === null) {
                const err = new Error("Username or Password is incorrect please check it again");
                return next(err)
            }
            else{
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-type','texp/plain');
                res.end("You are successfully authenticated");
            }  
        })
        .catch(err => {
            // console.log(err);
            next(err)
        })
    }else{
        res.statusCode = 200;
        res.setHeader('Content-type','texp/plain');
        res.end("You are successfully authenticated"); 
    }
})

module.exports = userRouter;