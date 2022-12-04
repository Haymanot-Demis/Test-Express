const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const dishRouter = express.Router();
const mongoose = require('mongoose');
const { verifyToken, verifyAdmin, verifyOrdinaryUser } = require('../controller/authenticate');

dishRouter.use(bodyParser.json())

dishRouter.route('/')
    .get((req, res) => {
        Dishes.find({})
            .populate('comments.author')
            .then((dishes) => {
                console.log("d", dishes);
                res.json(dishes)
            }, (err) => {
                console.log("Error ", err.message);
            }).catch(err => {
                console.log(err)
            })
    })
    .post(verifyToken, verifyAdmin,(req, res) => {
        Dishes.create(req.body)
            .then(result => {
                console.log(result);
                res.json(result)
            })
    })
    .put(verifyToken, verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
        next()
    })
    .delete(verifyToken, verifyAdmin, (req, res) => {
        Dishes.deleteMany({})
            .then((result) => {
                console.log(result);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.send(result)
            })
            .catch(err => console.log(err))
    });


dishRouter.route('/:id')
    .all((req, res, next) => {
        next();
    })
    .get((req, res) => {
        Dishes.findOne({ _id: req.params.id })
            .populate('comments.author')
            .then(dish => {
                res.json(dish)
            })
    })
    .post(verifyToken, verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.send("POST operation not supported on /dishes/" + req.params.id);
    })
    .put(verifyToken, verifyAdmin, (req, res) => {
        Dishes.updateOne({ _id: req.params.id }, {
                $set: req.body
            }, { new: true })
            .then(dish => {
                res.json(dish)
            })
    })
    .delete(verifyToken, verifyAdmin, (req, res) => {
        Dishes.deleteOne({ _id: req.params.id })
            .then(result => {
                console.log(result);
                res.send(result)
            })
    })


dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(verifyToken, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(verifyToken, (req, res, next) => {
    res.statusCode = 403;
    res.send("POST operation not supported on /dishes/" + req.params.dishId);
})
.delete(verifyToken, verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            dish.comments = []
            dish.save()
            .then((result => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.send(result);
            }))
            .catch(err => next(err))
        }
    })
    .catch(err => next(err))
})

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')    
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(verifyToken, (req, res, next) => {
    res.statusCode = 403;
    res.send("POST operation not supported on /dishes/" + req.params.dishId);
})
.put(verifyToken, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        console.log(req.user._id.equals(dish.comments.id(req.params.commentId).author._id));
       if(req.user._id.equals(dish.comments.id(req.params.commentId).author._id))
       {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                
                if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment
                }
                if(req.body.rating !== null){
                    dish.comments.id(req.params.commentId).rating = req.body.rating
                }
                dish.save()
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                })
                .catch(err => next(err))
                
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
        }else{
            err = new Error("You cannot modify a comment that doesn't belongs to you");
            err.status = 403;
            return next(err); 
        }
    })
    .catch(err => next(err))
})
.delete(verifyToken, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(req.user._id.equals(dish.comments.id(req.params.commentId).author._id)){
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then(dish => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                })
                .catch(err => next(err))
                
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
        }else{
            err = new Error("You cannot delete a comment that doesn't belongs to you");
            err.status = 403;
            return next(err); 
        }
    })
    .catch(err => next(err))
})




module.exports = dishRouter;