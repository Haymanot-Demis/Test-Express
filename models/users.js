const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    firstname : {
        type:String,
        default :''
    },
    lastname : {
        type:String,
        default :''
    },
    facebookID :{
        type:String
    },
    admin : {
        type : Boolean,
        default : false
    }
})

User.plugin(passportLocalMongoose);

const Users = mongoose.model('user', User);

module.exports = Users;