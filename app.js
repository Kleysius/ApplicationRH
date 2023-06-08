const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const projetRouter = require('./src/routes/projetRoutes.js');
const loginRouter = require('./src/routes/loginRoutes.js');
const registerRouter = require('./src/routes/registerRoutes.js');

require('dotenv').config();

const app = express();

app.set('views', path.join(__dirname, '/src/views'));

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuration de la session avec la clé secrète générée
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

app.use(function (req, res, next) {
    // res.locals.session = req.session;
    req.session.userId = "6481872fcda42d1de19af1bf";
    next();
});

app.use(projetRouter);
app.use(loginRouter);
app.use(registerRouter);

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is listening on port ${process.env.PORT}`);
    }

    try {
        mongoose.connect(process.env.BDD_MDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
});

