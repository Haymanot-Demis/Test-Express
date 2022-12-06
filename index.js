const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors =  require('cors');

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const cookieParser = require('cookie-parser');
const expresession = require('express-session');
const userRouter = require('./routes/userRouter');
const uploadRouter = require('./routes/uploadRouter');
const FileStore = require('express-file-store');
const passport = require('passport');
const {verifyToken} = require('./controller/authenticate')

app.use(cors())
app.use(cookieParser('haymanot'));
app.use(expresession({
    name:"session_name",
    secret:'haymanot',
    saveUninitialized:false,
    resave:false
}));

app.use(passport.initialize())
// app.use(passport.session())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRouter)

// // user auth
// app.use((req, res, next) => {
//     if(!req.user){
//         var err = new Error('You are not authenticated!');
//         err.status = 403;
//         next(err);
//     }else{
//       next();
//     }
// })

mongoose.connect('mongodb://127.0.0.1:27017/ConFusion', (err) => { // callback based
    if (err) {
        console.log("DB connection error");
        console.log(err);
    } else
        console.log("Connected Successfully");
})

/* OR */
// mongoose.connect('mongodb://localhost/ConFusion') //promise based
//     .then((db) => {
//         console.log("connected successfully");
//     }).catch((err) => {
//         console.log("Error ", err.message);
//     });

// verifying the user before accessing the routes
// app.use(verifyToken);

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)
app.use('/imageUpload', uploadRouter)

app.get("/", (req, res) => {
    res.redirect('/home.html');
});


app.listen(5000, () => {
    console.log("Server is running on port 5000","secPort", app.get('secPort'));
    
});

module.exports = app



// // multiple dishes
// app.get("/dishes", (req, res) => {
//     res.send("You wil get all the dishes info");
// })
// app.post("/dishes", (req, res) => {
//     res.send("All the dishes will be saved to the database dishes listed below");
// })
// app.put("/dishes", (req, res) => {
//     res.statusCode = 403;
//     res.send("This operaion is forbidden you can't update multiple items once");
// })
// app.delete("/dishes/", (req, res) => {
//     res.send("All the dishes will be deleted");
// })

// // specific dish
// app.get("/dishes/:id", (req, res) => {
//     res.send('you gonna get all the of the dish with id ' + req.params.id);
// })

// app.post("/dishes/:id", (req, res) => {
//     res.statusCode = 403;
//     res.send("This operaion is forbidden you can't post an already existed item");
// })

// app.put("/dishes/:id", (req, res) => {
//     res.send("The dish with id " + req.params.id + " will be updated");
// })

// app.delete("/dishes/:id", (req, res) => {
//     res.send("The dish with id " + req.params.id + " will be deleted");
// })
