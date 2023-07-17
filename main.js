require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
mongoose.connect("mongodb://0.0.0.0:27017/node_crud",{useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open',()=> console.log("connected to Database"));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
}));

app.use((req,res,next) => {
    res.locals.message = req.session.mesaage;
    delete req.session.mesaage;
    next();
})

app.set("view engine", "ejs");
app.use(express.static("uploads"));


app.use("", require('./routes/routes'));

app.listen(3000, () => {
  console.log("Server started Succesfully");
});