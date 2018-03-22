var express = require('express');
var session = require('express-session');
var passwordHash = require('password-hash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var Person = require('../models/persons');
var User = require('../models/user')

// Use the session middleware

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(session({
  secret: 'Your secret key',
  saveUninitialized: false,
  resave: true,
  maxAge: 99999999999999999999
}));

router.get('/admin', function(req, res, next) {
  if(req.session.active == "" || req.session.active == null || req.session.active == "0"){
    res.redirect('/admin/signin');
  } else {
    res.redirect('/admin/addperson');
  }
});


/* Date */
var today = new Date();
var dd = today.getDate();
var months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
var mm = months[today.getMonth()]; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

today = dd + ' ' + mm + ' ' + yyyy;

/* GET home page. */
router.get('/', function(req, res, next) {
    Person.find(function(err, persons) {
        res.render('index', { persons: persons, today: today });
    });
});

/* GET admin addperson page. */
router.get('/admin/addperson', function(req, res, next) {
    if(req.session.active == "" || req.session.active == null || req.session.active == "0"){
    res.redirect('/admin/signin');
  } else {
    Person.find(function(err, persons) {
        res.render('add-person', {  today: today });
    })};
});

/* GET login page. */
router.get('/admin/signin', function(req, res, next) {
        res.render('login', {  title: 'Login - Personal Locator' });
});

/* Signin User */
router.post('/admin/signin', function(req, res, next){
    User.findOne({username: req.body.username}, function(err, doc){
        if (err) {
            return res.status(404).json({
                title: 'An error occured',
                error: err
            });
        } else if (!doc) {
            res.render('login', {message: "Invalid Username!"});
        } else if (!passwordHash.verify(req.body.password, doc.password)){
            res.render('login', {message: "Invalid Password!"});
        } else {
        if (!req.session.active) {
            req.session.active = req.body.username
        }
            res.redirect('/admin/addperson');
        }
    })
});

/* Signout User */
router.get('/admin/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/admin/signin');
});

/* Signup User */
router.post('/admin/signup', function(req, res){
   if(!req.body.username || !req.body.email || !req.body.password || !req.body.name){
      res.status("400");
      res.send("Invalid details!");
   } else {
        var user = new User({
        username: req.body.username,
        email: req.body.email,
        password : passwordHash.generate(req.body.password),
        name : req.body.name,
      })
      user.save(function(err, result) {
        if (err) {
          return res.status(404).json({
            title: "An error occurred",
            error: err
          });
        }
        res.status(201).json({
          message: "User Saved",
          obj: result
        });
      });
   }
});

module.exports = router;
