const express = require('express');
const projetRouter = express.Router();
const userModel = require('../models/userModel.js');
const upload = require('../services/multer.js');
const fs = require('fs');
const path = require('path');


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
projetRouter.get('/dashboard', authGuard, async (req, res) => {
    try {
        let employes = null
        if (req.query.search) {
            // rechercher les employés par nom ou fonction
            employes = await employeModel.find({
                entreprise: req.session.userId,
                $or: [
                    { nom: { $regex: req.query.search, $options: 'i' } },
                    { fonction: { $regex: req.query.search, $options: 'i' } }
                ]
            })
        } else {
            employes = await employeModel.find({ entreprise: req.session.userId });
        }
        let user = await userModel.findById(req.session.userId);
        res.render('pages/dashboard.twig', { employes: employes, user: user, action: "dashboard" });
    } catch (error) {
        console.log(error);
    }
});

// route pour ajouter un employé
projetRouter.post('/addEmploye', upload.single('photo'), (req, res) => {
    try {
        let newEmploye = new employeModel(req.body);
        if (req.file) {
            newEmploye.photo = req.file.filename;
        }
        // Assigner l'entreprise à l'employé
        let entrepriseId = req.session.userId;
        newEmploye.entreprise = entrepriseId;

        let err = newEmploye.validateSync();
        if (err) {
            console.log(err);
            res.render('pages/dashboard.twig', { error: err.errors });
            return;
        }
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
        res.send(error);
    }
});

projetRouter.post('/updateEmploye/:id', upload.single('photo'), async (req, res) => {
    try {
        // Mettre à jour la photo si elle est modifiée
        if (req.file) {
            let employe = await employeModel.findById(req.params.id);
            if (employe.photo) {
                const photoFileName = employe.photo;
                fs.unlinkSync(path.join(`src/public/photo/${photoFileName}`));
            }
            await employeModel.updateOne({ _id: req.params.id }, { photo: req.file.filename });
        }
        res.redirect('/dashboard');
    } catch (error) {
        res.send(error);
    }
});

// route pour blamer un employé
projetRouter.get('/blame/:id', async (req, res) => {
    try {
        let employe = await employeModel.findById(req.params.id);
        let nbBlame = employe.blame + 1;
        if (nbBlame >= 3) {
            await employeModel.deleteOne({ _id: req.params.id });
            fs.unlinkSync(path.join(`src/public/photo/${employe.photo}`));
        } else {
            await employeModel.updateOne({ _id: req.params.id }, { blame: nbBlame });
        }
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

// route pour supprimer un employé
projetRouter.get('/deleteEmploye/:id', async (req, res) => {
    try {
        let employe = await employeModel.findById(req.params.id);
        if (employe.photo) {
            const photoFileName = employe.photo;
            fs.unlinkSync(path.join(`src/public/photo/${photoFileName}`));
        }
        await employeModel.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        res.send(error);
    }
});

module.exports = projetRouter;