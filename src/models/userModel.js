const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Veuillez entrer votre nom'],
        trim: true, // supprime les espaces avant et après
        validate: {
            validator: function (value) {
                // regex avec Au moins une lettre minuscule ((?=.*[a-z]))
                // Au moins une lettre majuscule ((?=.*[A-Z]))
                // regex avec les accents ((?=.*[À-ÿ]))
                return /^[a-zA-ZÀ-ÿ]+$/.test(value);
            },
            message: 'Le nom doit contenir uniquement des lettres'
        }
    },
    email: {
        type: String,
        required: [true, 'Veuillez entrer votre adresse email'],
        unique: true,
        lowercase: true,
        trim: true, // supprime les espaces avant et après
        validate: {
            validator: function (value) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
            },
            message: 'L\'email n\'est pas valide, il doit contenir un @ et un .'
        }
    },
    siret: {
        type: String,
        required: [true, 'Veuillez entrer votre numéro de SIRET'],
        unique: true,
        trim: true, // supprime les espaces avant et après
        validate: {
            validator: function (value) {
                return /^[0-9]{14}$/.test(value);
            },
            message: 'Le numéro de SIRET doit contenir 14 chiffres'
        }
    },
    directeur: {
        type: String,
        required: [true, 'Veuillez entrer le nom du directeur'],
        trim: true, // supprime les espaces avant et après
        validate: {
            validator: function (value) {
                return /^[a-zA-Z]+$/.test(value);
            },
            message: 'Le nom du directeur doit contenir uniquement des lettres'
        }
    },
    password: {
        type: String,
        required: [true, 'Veuillez entrer votre mot de passe'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
        validate: {
            validator: function (value) {
                // regex avec Au moins une lettre minuscule ((?=.*[a-z]))
                // Au moins une lettre majuscule ((?=.*[A-Z]))
                // Au moins un chiffre ((?=.*\d))
                // Au moins un caractère spécial parmi @#$%^&+=. ((?=.*[@#$%^&+=.]))
                // Longueur minimale de 8 caractères ({8,})
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=.])[a-zA-Z\d@#/$%^&+=.]{8,}$/.test(value);
            },
            message: 'Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre, un caractère spécial et au moins 8 caractères'
        }
    }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;