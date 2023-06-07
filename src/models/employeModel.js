const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema({
    photo: {
        type: String,
    },
    nom: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        validator: {
            validate: function (value) {
                return /^[a-zA-Z]+$/.test(value);
            }
        }
    },
    fonction: {
        type: String,
        required: [true, 'La fonction est obligatoire'],
        validator: {
            validate: function (value) {
                return /^[a-zA-Z]+$/.test(value);
            }
        }
    },
    blame: {
        type: Number,
        default: 0,
    },
    entreprise: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

const employeModel = mongoose.model('employes', employeSchema);

module.exports = employeModel;