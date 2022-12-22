const express = require('express');
const favouriteRouter = express.Router();
const bodyParser = require('body-parser');
const Favourites = require('../models/favourites');
const { verifyToken,verifyAdmin,verifyOrdinaryUser } =require('../controller/authenticate');


favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.get(verifyToken, (req, res, next) => {
    Favourites.find({user:req.user._id})
    .populate(['user', 'dishes'])
    .then(dishes => {
            res.statusCode = 200;
            res.contentType('application/json');
            res.json(dishes)
    })
    .catch(err => {
        console.log(err)
    })
})
.post(verifyToken, (req, res, next) => {
    Favourites.findOne({user : req.user._id})
    .then(fav => {
        if(fav){
            console.log(fav);
            console.log(req.body);
            for(dishid of req.body){
                if (fav.dishes.find(IDObj => IDObj._id.valueOf() === dishid._id)){
                    continue;
                }
                console.log(dishid);
                fav.dishes.push(dishid);
            }
            console.log(fav.dishes);
            fav.save()
            .then(dishes => {
                res.statusCode = 200;
                res.contentType('application/json');
                res.json(dishes)
            })
            .catch(err => {
                console.log(err)
            })
        }
        else if(!fav){
            Favourites.create({user: req.user._id, dishes: req.body})
            .then(dishes => {
                res.statusCode = 200;
                res.contentType('application/json');
                res.json(dishes)
            })
            .catch(err => {
                console.log(err)
            })
        }
       
    })
    .catch(err => {
        console.log(err)
    })
})
.delete(verifyToken, (req, res , next) => {
    Favourites.deleteMany({user : req.user._id})
    .then(result => {
        res.statusCode = 200;
        res.contentType('application/json');
        res.json(result)
        }
    )
    .catch(err => {
        console.log(err)
    })
})


favouriteRouter.route('/:dishId')
.get(verifyToken, (req, res, next) => {
    Favourites.findOne({user:req.user._id}, {dishes : 1, _id : 0 })
    .populate('dishes')
    .then(dish => {
       if(dish != null) {
        const favDish = dish.dishes.find((d) => d._id.valueOf() == req.params.dishId)
        if (favDish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favDish);
        }
        else if (favDish == null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.send('Dish with id ' + req.params.dishId + ' not  in your favourite dishes list');
            return next();
        }
       }
        else if(dish == null){
            res.setHeader('Content-Type', 'text/html');
            res.send("You have no favourite dish");
            return next();
        }
    })
})
.post(verifyToken, (req, res, next) => {
    Favourites.findOne({user : req.user._id})
    .then(favdishes => {
        if(favdishes){
            console.log(favdishes.dishes);
            const index = favdishes.dishes.indexOf(req.params.dishId);
            if(index == -1){
                favdishes.dishes.indexOf(req.params.dishId);
            }else{
                res.statusCode = 200;
               return res.send("This dish already exists in your favourites")
            }
            favdishes.save()
            .then(newdishes => {
                res.statusCode = 200;
                res.contentType('application/json');
                res.json(newdishes)
            })
            .catch(err => {
                console.log(err)
            })
        }
        else if(!favdishes){
            Favourites.create({user: req.user._id, dishes: req.params.dishId})
            .then(favdishes => {
                res.statusCode = 200;
                res.contentType('application/json');
                res.json(favdishes)
            })
            .catch(err => {
                console.log(err)
            })
        }
    })
    .catch(err => {
        console.log(err)
    })
})
.delete(verifyToken, (req, res, next) => {
    Favourites.findOne({user:req.user._id}, {dishes : 1})
    .then(dish => {

        // res.statusCode = 200;
        // res.contentType('application/json');
        // res.json(dish)
        console.log(dish);

        dish.dishes = dish.dishes.filter((favDish) => {
            // console.log(favDish.valueOf() !== req.params.dishId);
            return favDish.valueOf() !== req.params.dishId
        });

        console.log(dish.dishes);
      
        dish.save()
        .then(result => {
            res.statusCode = 200;
            res.contentType('application/json');
            res.json(result)
        })
        .catch(err => {
            console.log("error",err)
            res.statusCode = 400;
            res.contentType('application/json');
            res.json(err)
        })


    })
    .catch(err => {
        console.log(err)
        next()
    })
})


module.exports = favouriteRouter