const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require("multer");
const fs = require('fs');

var storage = multer.diskStorage({
   destination: function(req, file, cb){
    cb(null,'./uploads');
   },
   filename: function(req, file, cb){
    cb(null,file.fieldname + "_" + Date.now() + "_" + file.originalname);
   }
});

var upload = multer({
    storage: storage,
}).single("image");

router.post("/add", upload, (req,res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
  user.save().then(() => {
    req.session.message = {
        type: 'success',
        message: 'User Added Successfully!'
    };
    res.redirect("/");
  })
  .catch((err) => {
    res.json({message: err.message, type: 'danger'});
  });

});


router.get("/", (req,res) => {
   User.find().then((users) =>{
        res.render('index', {
            title: "Home Page",
            users: users,
        });
    })
    .catch((err) => {
        res.json({message: err.message});
    });
});


router.get("/add", (req,res) => {
    res.render("add_users", {title: "Add Users"} );
})

router.get('/edit/:id' , (req,res) => {
    const id = req.params.id;
    User.findById(id).then(function(user) {
        res.render("edit_users", {
            title: "Edit User",
            user: user,
        });
    })
    .catch(function(error){
        res.redirect("/"); // Failure
    });
   
});

 router.post('/update/:id' , upload, (req,res) => {
    res.redirect("/");  
});


router.get('/delete/:id', (req,res) => {

 res.redirect("/");
});
module.exports = router;