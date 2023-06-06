const express = require('express');
const registerRouter = express.Router();
const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');

// route pour afficher la page d'inscription
registerRouter.get('/register', (req, res) => {
    try {
        res.render('pages/register.twig');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

// route pour enregistrer un nouvel utilisateur
registerRouter.post('/inscription', async (req, res) => {
    try {
        let newUser = new userModel(req.body);
        let err = newUser.validateSync();
        if (err) {
            console.log(err);
            res.render('pages/register.twig', { error: err.errors });
            return;
        }
        newUser.password = bcrypt.hashSync(req.body.password, 10);
        await newUser.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('pages/register.twig', { error: error });
    }
});

module.exports = registerRouter;