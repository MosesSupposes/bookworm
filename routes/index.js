var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET /
router.get('/', (req, res, next) => {
    return res.render('index', { title: 'Home' });
});


// GET /register
router.get('/register', (req, res, next) => {
    return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', (req, res, next) => {
    if (req.body.email &&
        req.body.name &&
        req.body.favoriteBook &&
        req.body.password &&
        req.body.confirmPassword) {
            // confirm that user typed same password twice
            if (req.body.password !== req.body.confirmPassword) {
                let err = new Error('Passwords do not match');
                err.status = 400;
                return next(err);
            }
            // create object with form input
            let userData = {
                email: req.body.email,
                name: req.body.name,
                favoriteBook: req.body.favoriteBook,
                password: req.body.password
            };

            // insert document into Mongo
            User.create(userData, (error, user) => {
                if (error) {
                    return next(error);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/profile');    
                } 
            });

    } else {
        let err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

// GET /login
router.get('/login', (req, res, next) => {
    return res.render('login', { title: 'Log In' });
});

// POST /login
router.post('/login', (req, res, next) => {
    if (req.body.email && req.body.password) {
        User.authenticate(req,body.email, req.body.password, (error, user) => {
            if (error || !user) {
                let err = new Error('Incorrect email or password.');
                err.status = 401;
                return next(err)
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        let err = new Error('Email and password are required.');
        err.status = 401;
        return next(err);
    }
});

// GET /profile
router.get('/profile', (req, res, next) => {
    if (!req.session.userId) {
        let err = new Error('You are authorized to view this page');
        err.status = 403;
        return next(err);
    } 
    User.findById(req.session.userId)
        .exec((error, user) => {
            if (error) 
                return next(error)
            else 
                return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });                
        });
});

// GET /about
router.get('/about', (req, res, next) => {
    return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', (req, res, next) => {
    return res.render('contact', { title: 'Contact' });
});

module.exports = router;
