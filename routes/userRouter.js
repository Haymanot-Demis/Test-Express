const express = require('express');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const Users = require('../models/users');
const passport = require('passport');
userRouter.use(bodyParser.json());


userRouter.post('/signup', (req, res, next) => {
    console.log("body", req.body);
    Users.register({username:req.body.username}, req.body.password, function(err, user) {
        if (err) {
            return res.send({"err":err})
        }
            
        const authenticate = Users.authenticate();
        authenticate(req.body.username, req.body.password, function(err, result) {
          if (err) { 
            console.log("result", result);
            return res.send({"err":err})
           }

           res.statusCode = 200;
           res.contentType('application/json');
           res.send({"success":"true", "status":"Registration successfull"});                 
        });


      });

    // Users.register(new Users({username:req.body.username}, "req.body.password", (err, user) => {
    //     if(err){
    //     console.log("in if part");
    //         // res.statusCode = 500
    //         // res.setHeader('Content-Type', 'application/json');
    //         // console.log("body", req.body);
    //         res.send({err:err})
    //     }else{
    
    //         console.log("in else part");
    //         const authenticate = Users.authenticate();
    //         authenticate("hayme", 'password', function(err, result) {
    //           if (err) { 
    //             console.log("result", result);
    //             return res.send({"err":err})
    //            }

    //            res.statusCode = 200;
    //            res.contentType('application/json');
    //            res.send({"success":"true", "status":"Registration successfull"});  
    //      });
    //     }
    // }))
})

userRouter.post('/signin', passport.authenticate('local'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type','texp/plain');
    res.end("You are successfully authenticated"); 
})

module.exports = userRouter;