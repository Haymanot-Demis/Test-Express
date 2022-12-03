const User = require('../models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const jwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { ExtractJwt } = require('passport-jwt');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const timeS = 3600*24;
const getToken = (user) => {
    const token = jwt.sign(user._id.valueOf(), config.secrecOrKey);
    console.log("user",user);
    console.log("token",token);
    return token;
}

passport.use(new jwtStrategy({jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(), 
             secretOrKey:config.secrecOrKey}, (jwt_payload, done) => {
                // console.log("payload", jwt_payload);
                User.findOne({_id:jwt_payload},(err, user) => {
                    if (err) {
                        console.log("error ", err);
                        return done(err,false, "Internal verification error occured");
                    }
                    else if(user){
                        console.log("user id = ",jwt_payload);
                        return done(null, user);
                    }
                    else{
                        console.log("the token is incorrect");
                        return done(null,false,"the token is incorrect")
                    }
                })
             }))

const verifyToken = passport.authenticate('jwt', {session:false});

module.exports = {getToken, verifyToken}