const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema({
    photo: {
        type: String,
    },
    nom: {
        type: String,
    },
    fonction: {
        type: String,
    },
    entreprise: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

const employeModel = mongoose.model('employes', employeSchema);

module.exports = employeModel;