const express = require('express');
const promoRouter = express.Router();
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
const { verifyToken, verifyAdmin, verifyOrdinaryUser } =require('../controller/authenticate');

promoRouter.use(bodyParser.json())

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(verifyToken, (req, res, next) => {
        Promotions.find({})
            .then(promotions => {
                res.send(promotions)
            })
            .catch(err => {
                console.log(err.message);
            })
    })
    .post(verifyToken, verifyAdmin, (req, res, next) => {
        Promotions.create(req.body)
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                console.log(err.message);
            })
    })
    .put(verifyToken, verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(verifyToken, verifyAdmin, (req, res, next) => {
        Promotions.deleteMany({})
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                console.log(err.message);
            })
    });

promoRouter.route('/:id')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(async(req, res) => {
        let promotion = await Promotions.findById(req.params.id, 'name price')
        console.log(promotion);
        res.send(promotion)
    })
    .post(verifyToken, verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.send("POST operation not supported on /promotions/" + req.params.id);
    })
    .put(verifyToken, verifyAdmin, (req, res) => {
        Promotions.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true, returnDocument: 'after' })
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                res.statusCode = 401
                res.send(err.message)
                console.log(err);
            })
    })
    .delete(verifyToken, verifyAdmin, (req, res) => {
        Promotions.deleteOne({ _id: req.params.id })
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.statusCode = 401
                res.send(err.message)
                console.log(err);
            })
    })

module.exports = promoRouter;