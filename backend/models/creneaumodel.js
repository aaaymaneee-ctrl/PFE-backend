// models/Creneau.js
const mongoose = require('mongoose');

const creneauSchema = new mongoose.Schema({
    dateCreneau: {
        type: String,
        required: true
    },
    heureDebut: {
        type: String,
        required: true
    },
    heureFin: {
        type: String,
        required: true
    },
    idRecruteur: {
        type: String,
        required: true
    },
    idOffre: {
        type: String,
        required: true
    },
    idCandidature: {
        type: String,
        required: true
    },
    idEtudiant: {
        type: String,
        required: true
    },
    lienVisio: {
        type: String,
        default: null
    },
    etapeEntretien: {
        type: String,
        default: 'creneau_choisi',
        enum: ['attente_creneau', 'creneau_choisi', 'visio_en_cours', 'termine']
    },
    visioGeneratedAt: {
        type: Date,
        default: null
    },
    etatCreneau: {
        type: String,
        default: 'reserve'
    }
}, {
    timestamps: true,
    minimize: false
});

module.exports = mongoose.model('Creneau', creneauSchema);