var express = require('express');
var router = express.Router();


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
    return res.send('User created!');
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
