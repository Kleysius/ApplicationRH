const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');

const userModel = require('../models/userModel.js');

// route pour afficher la page de connexion
loginRouter.get('/login', async (req, res) => {
        try {
            res.render('pages/login.twig');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
});

// route pour connecter un utilisateur
loginRouter.post('/login', async (req, res) => {
    try {
        let errors = {};
        let user = await userModel.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.userId = user._id;
                res.redirect('/dashboard');
            } else {
                errors.password = 'Le mot de passe est incorrect';
                throw errors;
            }
        } else {
            errors.email = 'L\'email est incorrect';
            throw errors;
        }
    } catch (error) {
        console.log(error);
        res.render('pages/login.twig', { error: error });
    }
});

// route pour déconnecter un utilisateur
loginRouter.get('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

module.exports = loginRouter;