const express = require('express');
const projetRouter = express.Router();
const userModel = require('../models/userModel.js');
const upload = require('../services/multer.js');
const fs = require('fs');

const employeModel = require('../models/employeModel.js');
const authGuard = require('../services/authGuard.js');

// route pour afficher la page d'accueil
projetRouter.get('/', (req, res) => {
    try {
        res.render('pages/home.twig');
    } catch (error) {
        console.log(error);
    }
});

// route pour afficher le dashboard
projetRouter.get('/dashboard', authGuard ,async (req, res) => {
    try {
        let employes = await employeModel.find({ entreprise: req.session.userId});
        let user = await userModel.findById(req.session.userId);
        res.render('pages/dashboard.twig', { employes: employes, user: user, action:"dashboard" });
    } catch (error) {
        console.log(error);
    }
});

// route pour ajouter un employé
projetRouter.post('/addEmploye', upload.single('photo'), (req, res) => {
    try {
        let newEmploye = new employeModel(req.body);
        newEmploye.photo = req.file.filename;

        // Assigner l'entreprise à l'employé
        let entrepriseId = req.session.userId;
        newEmploye.entreprise = entrepriseId;

        newEmploye.validateSync();
        newEmploye.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

// routes pour modifier un employé
projetRouter.get('/updateEmploye/:id', async (req, res) => {
    try {
        let employe = await employeModel.findById(req.params.id);
        res.render('pages/dashboard.twig', { employe: employe });
    } catch (error) {
        console.log(error);
    }
});

projetRouter.post('/updateEmploye/:id', upload.single('photo'), async (req, res) => {
    try {
        await employeModel.updateOne({ _id: req.params.id }, req.body);
        res.redirect('/dashboard');
    } catch (error) {
        res.send(error);
    }
});

// route pour supprimer un employé
projetRouter.get('/deleteEmploye/:id', async (req, res) => {
    try {
        let employe = await employeModel.findById(req.params.id);
        const photoFileName = employe.photo;
        fs.unlinkSync(`C:/Users/sebas/OneDrive/Bureau/Formation  - Ecole Ri7/Projet RH/Code projet RH/src/public/photo/${photoFileName}`);
        
        await employeModel.deleteOne({ _id: req.params.id });

        res.redirect('/dashboard');
    } catch (error) {
        res.send(error);
    }
});

module.exports = projetRouter;