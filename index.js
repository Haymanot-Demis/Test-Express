const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

app.use(bodyParser.json());
const publicfolder = path.join(__dirname, 'public');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

// app.all('/dishes', (req, res, next) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/html');
//         next();
//     })
// get request 
app.get("/", (req, res) => {
    res.redirect('/home.html');
})

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

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})