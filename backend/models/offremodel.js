const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offreSchema = new Schema({
    titre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    entreprise: {
        type: String,
        required: true,
    },
    localisation: {
        type: String,
        required: true,
    },
    typeContrat: {
        type: String,
        enum: ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'],
        required: true,
    },
    salaire: {
        type: String,
    },
    competences: {
        type: [String],
        default: [],
    },
    statut: {
        type: String,
        enum: ['active', 'fermée'],
        default: 'active',
    },
    recruteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    candidatures: [{
        etudiantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        statut: {
            type: String,
            enum: [
                'en attente', 
                'acceptée', 
                'refusée', 
                'evaluation_en_cours', 
                'embauché', 
                'refusée_final',
                'proposition_envoyee',
                'embauche_acceptee',
                'embauche_refusee'
            ],
            default: 'en attente',
        },
        dateCandidature: {
            type: Date,
            default: Date.now
        },
        lettreMotivation: String,
        commentaire: String,
        typeCandidature: {
            type: String,
            enum: ['manuelle', 'automatique'],
            default: 'manuelle'
        },
        scoreEntretien: Number,
        commentaireEntretien: String,
        scores: {
            pertinence: Number,
            technique: Number,
            communication: Number,
            motivation: Number,
            professionnalisme: Number
        },
        interviewType:{
            type: String,
            enum: ['ai' , 'reel'],
            default: 'ai'
        },
        interviewDeployee: {
        type: Boolean,
        default: false
        },
        dateDeploiementInterview: {
        type: Date
        },
        statutInterview: {
        type: String,
        enum: ['non_deployee', 'deployee', 'en_cours', 'terminee'],
        default: 'non_deployee'
        },
        entretienReelActive: {
            type: Boolean,
            default: false
        },
        dateActivationEntretien: Date,
        etapeEntretien: {
            type: String,
            enum: ['non_debute', 'attente_creneau', 'creneau_choisi', 'visio_en_cours', 'termine'],
            default: 'non_debute'
        },
        creneauChoisi: {
            date: Date,
            heureDebut: String,
            heureFin: String
        },
        lienVisio: String,
        alerteEtudiant: {
            type: Boolean,
            default: false
        },
        alerteRecruteur: {
            type: Boolean,
            default: false
        }
    }],
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateLimite: {
        type: Date,
    },
    nombrePostes: {
        type: Number,
        default: 1,
        required: true
    }
});

const Offre = mongoose.model("Offre", offreSchema);
module.exports = Offre;