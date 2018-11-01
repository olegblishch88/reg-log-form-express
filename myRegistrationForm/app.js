const express = require('express');
const path = require('path');
const session = require('express-session');
const User = require('./models/User');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'qwe',
    resave: false,
    saveUninitialized: false
}));

const users = [];

app.get('/', (req, res) => {
    res.render('index', {
        users,
        principal: req.session.principal && req.session.principal.login ? req.session.principal : null 
    });
});

app.post('/register', (req, res) => {
    const user = new User(req.body.login, req.body.password);
    users.push(user);
    res.redirect('/');
});

app.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    let principalIndex = users.findIndex((value, index, arr) => {
        return value.login === login && value.password === password;
    });   
    if(principalIndex > -1){
        req.session.principal = users[principalIndex];
    }
    res.redirect('/');
});

app.get('/Logout', (req, res) => {
    req.session.principal = null;
    res.redirect('/');
});

app.get('/user/:login', (req, res) => {
    const principalIndex = users.findIndex((value, index, arr) => {
        return value.login === req.params.login;
    });
    res.json(users[principalIndex]);
});





app.listen(3000, () => { console.log('Listening...') })