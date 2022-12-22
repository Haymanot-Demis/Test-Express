const express = require('express');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const Users = require('../models/users');
const passport = require('passport');
const { getToken, verifyAdmin, verifyUser } = require('../controller/authenticate');

userRouter.use(bodyParser.json());

userRouter.route('/')
.get(passport.authenticate('local'), verifyAdmin, (req, res, next) => {
  console.log(req.user);
  Users.find({})
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    res.json(users)
  })
  .catch(err => next(err))
})

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

           if(req.body.firstname){
            user.firstname = req.body.firstname
           }
           
           if(req.body.lastname){
            user.lastname = req.body.lastname
           }
           user.save()
           .then(user => {
              res.statusCode = 200;
              res.contentType('application/json');
              res.send({"success":"true", "status":"Registration successfull"});  
           })
           .catch(err => next(err))
                         
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

userRouter.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }

    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-type','application/json');
      res.json({"success" : false, "status":"Login Unsuccesful", info}); 
    }else{
      req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader('Content-type','application/json');
          res.json({"success" : false, "status":"Login Unsuccesful", err}); 
        }
        const token = getToken(req.user)
        console.log(token);
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json({"success" : "true", token,"status":"You are successfully authenticated"}); 
      })
    }

  }) (req, res, next);
   
})

userRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if(req.user) {
    const token = getToken({_id:req.user._id})
    console.log(token);
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    res.json({"success" : "true", token,"status":"You are successfully authenticated"}); 
  }
});


module.exports = userRouter;