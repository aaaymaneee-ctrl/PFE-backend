const express = require("express");
const cors = require("cors");
const User = require("./models/usermodel");
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require("multer");
const Offre = require("./models/offremodel");
const pdfParse = require('pdf-parse');
const fs = require('fs');
const cron = require('node-cron');
const crypto = require('crypto');
const nlpService = require('./nlpService');
const Creneau = require("./models/creneaumodel");
require('dotenv').config();
console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "YES ✅" : "NO ❌");

const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

const DB_URL = process.env.ATLAS_URL;
mongoose.connect(DB_URL)
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.error("connection error", err));

// Exécuter tous les jours à 00:01
cron.schedule('1 0 * * *', async () => {
    console.log('⏰ Exécution du cron job : Vérification des dates limites des offres...');
    try {
        const now = new Date();
        
        // Trouver et mettre à jour toutes les offres actives dont la date limite est passée
        const result = await Offre.updateMany(
            {
                statut: 'active',
                dateLimite: { $lt: now } // $lt signifie "less than" (inférieur à la date/heure actuelle)
            },
            {
                $set: { statut: 'fermée' }
            }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`✅ Cron terminé : ${result.modifiedCount} offres ont été fermées automatiquement.`);
        }
    } catch (error) {
        console.error("❌ Erreur lors de la fermeture automatique des offres :", error);
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fs = require("fs");
        const dir = "./uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Seuls les fichiers PDF sont acceptés"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// ===== ROBUST SCHEDULER WITH FLEXIBLE DATE/TIME MATCHING =====
let schedulerRunning = true;

function startScheduler() {
    console.log('✅ Interview scheduler started - checking every minute');
    
    const task = cron.schedule('* * * * *', async () => {
        if (!schedulerRunning) return;
        
        try {
            const now = new Date();
            
            // Get current time in HH:MM format
            const currentHour = String(now.getHours()).padStart(2, '0');
            const currentMinute = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${currentHour}:${currentMinute}`;
            
            // Get current date in YYYY-MM-DD format
            // Get current date strictly in LOCAL YYYY-MM-DD format (Fixes UTC mismatch)
            const currentYear = now.getFullYear();
            const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
            const currentDay = String(now.getDate()).padStart(2, '0');
            const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
            
            console.log(`\n🔍 [${now.toLocaleTimeString()}] Current time: ${currentDate} ${currentTime}`);
            
            // ===== STEP 1: Get ALL creneaux (no filter) =====
            const allCreneaux = await Creneau.find({
                etapeEntretien: 'creneau_choisi',
                lienVisio: { $ne: null, $ne: '' }
            });
            
            console.log(`📋 Found ${allCreneaux.length} creneaux with status 'creneau_choisi'`);
            
            // ===== STEP 2: Manual filtering with flexible comparison =====
            const matchingCreneaux = [];
            
            for (const creneau of allCreneaux) {
                // Normalize date to YYYY-MM-DD string
                let creneauDate;
                if (creneau.dateCreneau instanceof Date) {
                    creneauDate = creneau.dateCreneau.toISOString().split('T')[0];
                } else if (typeof creneau.dateCreneau === 'string') {
                    creneauDate = creneau.dateCreneau.split('T')[0]; // Handle ISO strings
                } else {
                    creneauDate = String(creneau.dateCreneau);
                }
                
                // Normalize time to HH:MM format
                let creneauHeure = String(creneau.heureDebut).trim();
                // Ensure 2-digit hour (9:00 → 09:00)
                if (creneauHeure.match(/^\d:\d{2}$/)) {
                    creneauHeure = '0' + creneauHeure;
                }
                
                console.log(`   Checking: "${creneauDate}" "${creneauHeure}" vs "${currentDate}" "${currentTime}"`);
                
                // Compare
                if (creneauDate === currentDate && creneauHeure === currentTime) {
                    console.log(`   ✅ MATCH! Creneau ${creneau._id}`);
                    matchingCreneaux.push(creneau);
                }
            }
            
            // ===== STEP 3: Activate matching creneaux =====
            if (matchingCreneaux.length > 0) {
                console.log(`\n🎯 Activating ${matchingCreneaux.length} interview(s)`);
                
                for (const creneau of matchingCreneaux) {
                    try {
                        // Update creneau status
                        await Creneau.findByIdAndUpdate(creneau._id, {
                            etapeEntretien: 'visio_en_cours'
                        });
                        
                        // Update candidature in offre
                        const offre = await Offre.findOne({ 
                            'candidatures._id': creneau.idCandidature 
                        });
                        
                        if (offre) {
                            const candidature = offre.candidatures.id(creneau.idCandidature);
                            if (candidature) {
                                candidature.etapeEntretien = 'visio_en_cours';
                                await offre.save();
                                console.log(`   ✅ Activated candidature ${creneau.idCandidature}`);
                            }
                        }
                    } catch (err) {
                        console.error(`   ❌ Error activating creneau ${creneau._id}:`, err.message);
                    }
                }
            } else {
                console.log(`   ℹ️ No interviews to activate at this time`);
            }
            
            // ===== STEP 4: Clean up expired interviews =====
            const expiredCreneaux = await Creneau.find({
                visioExpiresAt: { $lt: now },
                etapeEntretien: 'visio_en_cours'
            });
            
            if (expiredCreneaux.length > 0) {
                console.log(`\n🧹 Expiring ${expiredCreneaux.length} interview(s)`);
                
                for (const creneau of expiredCreneaux) {
                    await Creneau.findByIdAndUpdate(creneau._id, {
                        etapeEntretien: 'termine'
                    });
                    
                    // Update candidature
                    try {
                        const offre = await Offre.findOne({ 
                            'candidatures._id': creneau.idCandidature 
                        });
                        if (offre) {
                            const candidature = offre.candidatures.id(creneau.idCandidature);
                            if (candidature) {
                                candidature.etapeEntretien = 'termine';
                                await offre.save();
                            }
                        }
                    } catch (err) {
                        console.error(`   ⚠️ Error expiring candidature: ${err.message}`);
                    }
                }
            }
            
        } catch (err) {
            console.error('❌ Scheduler error:', err.message);
            console.error('Stack:', err.stack);
        }
    });
    
    return task;
}

const isRecruiterBlocked = async (recruiterId) => {
    const recruiter = await User.findById(recruiterId);
    return recruiter ? recruiter.isBlocked : false;
};

// Status endpoint
app.get('/scheduler/status', (req, res) => {
    res.json({
        running: schedulerRunning,
        message: 'Scheduler is running. Checking every minute.',
        serverTime: new Date().toISOString()
    });
});

// Debug endpoint to see all creneaux with time comparison
app.get('/scheduler/debug', async (req, res) => {
    try {
        const now = new Date();
        const currentHour = String(now.getHours()).padStart(2, '0');
        const currentMinute = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;
        const currentDate = now.toISOString().split('T')[0];
        
        const allCreneaux = await Creneau.find({}).sort({ dateCreneau: -1, heureDebut: 1 });
        
        const analysis = allCreneaux.map(c => {
            let creneauDate;
            if (c.dateCreneau instanceof Date) {
                creneauDate = c.dateCreneau.toISOString().split('T')[0];
            } else if (typeof c.dateCreneau === 'string') {
                creneauDate = c.dateCreneau.split('T')[0];
            } else {
                creneauDate = String(c.dateCreneau);
            }
            
            let creneauHeure = String(c.heureDebut).trim();
            if (creneauHeure.match(/^\d:\d{2}$/)) {
                creneauHeure = '0' + creneauHeure;
            }
            
            return {
                id: c._id,
                rawDate: c.dateCreneau,
                rawDateType: typeof c.dateCreneau,
                normalizedDate: creneauDate,
                rawHeure: c.heureDebut,
                rawHeureType: typeof c.heureDebut,
                normalizedHeure: creneauHeure,
                etapeEntretien: c.etapeEntretien,
                lienVisio: c.lienVisio ? 'YES' : 'NO',
                matchesNow: creneauDate === currentDate && creneauHeure === currentTime,
                comparison: {
                    serverDate: currentDate,
                    serverTime: currentTime,
                    dateMatch: creneauDate === currentDate,
                    timeMatch: creneauHeure === currentTime
                }
            };
        });
        
        res.json({
            serverTime: { currentDate, currentTime, iso: now.toISOString() },
            totalCreneaux: allCreneaux.length,
            matchingNow: analysis.filter(a => a.matchesNow).length,
            creneaux: analysis
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Manual trigger - activate interviews for current time
app.post('/scheduler/trigger-now', async (req, res) => {
    try {
        const now = new Date();
        const currentHour = String(now.getHours()).padStart(2, '0');
        const currentMinute = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;
        const currentDate = now.toISOString().split('T')[0];
        
        const allCreneaux = await Creneau.find({
            etapeEntretien: 'creneau_choisi',
            lienVisio: { $ne: null, $ne: '' }
        });
        
        const activated = [];
        
        for (const creneau of allCreneaux) {
            let creneauDate = typeof creneau.dateCreneau === 'string' 
                ? creneau.dateCreneau.split('T')[0]
                : creneau.dateCreneau instanceof Date 
                    ? creneau.dateCreneau.toISOString().split('T')[0]
                    : String(creneau.dateCreneau);
            
            let creneauHeure = String(creneau.heureDebut).trim();
            if (creneauHeure.match(/^\d:\d{2}$/)) {
                creneauHeure = '0' + creneauHeure;
            }
            
            if (creneauDate === currentDate && creneauHeure === currentTime) {
                await Creneau.findByIdAndUpdate(creneau._id, {
                    etapeEntretien: 'visio_en_cours'
                });
                activated.push(creneau._id);
            }
        }
        
        res.json({
            message: `Activated ${activated.length} interviews`,
            serverTime: { currentDate, currentTime },
            activated
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the scheduler
const schedulerTask = startScheduler();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received');
    schedulerRunning = false;
    if (schedulerTask) schedulerTask.stop();
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received');
    schedulerRunning = false;
    if (schedulerTask) schedulerTask.stop();
});


app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


app.post("/users", async (req, res) => {
  try {
    console.log("=== NEW SIGNUP REQUEST ===");
    console.log("Received body:", req.body);
    
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
      console.log("Missing fields!");
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: "Cet email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const newUser = new User({
      prenom,
      nom,
      email,
      password: hashedPassword,
      dateCreation: new Date(),
      role,
    });

    await newUser.save();
    console.log("User saved to database:", newUser._id);

    res.status(201).json({ 
      message: "User added successfully",
      user: {
        id: newUser._id,
        prenom: newUser.prenom,
        nom: newUser.nom,
        email: newUser.email,
        dateCreation: newUser.dateCreation,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("ERROR SAVING USER:", err);
    res.status(500).json({ error: err.message });
  }
});


// Replace your existing login endpoint with this updated version:

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ error: "Email n'existe pas" });
    }

    // CHECK IF USER IS BLOCKED
    if (user.isBlocked === true) {
      console.log("Blocked user attempted login:", email);
      return res.status(403).json({ 
        error: "Votre compte a été bloqué",
        isBlocked: true,
        blockedReason: user.blockedReason || "Aucune raison spécifiée",
        blockedAt: user.blockedAt
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    res.json({ 
      message: "Login successful", 
      user: {
        id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        dateCreation: user.dateCreation,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/users/:userId/cv", upload.single("cv"), async (req, res) => {
    try {
        const userId = req.params.userId;
    
        // SECTION A: Validation
        if (!userId || userId === 'undefined') {
            return res.status(400).json({ error: "ID utilisateur invalide" });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier PDF fourni" });
        }

        console.log("Upload attempt:", {
            userId,
            file: req.file.filename,
            size: req.file.size
        });

        // SECTION B: PDF Parsing - NEW CODE
        // Read the uploaded file from disk into memory (buffer)
        const pdfBuffer = fs.readFileSync(req.file.path);
        
        // Parse the PDF to extract all text content
        let extractedText = '';
        let pdfInfo = {};
        let numPages = 0;
        
        try {
            const pdfData = await pdfParse(pdfBuffer);
            extractedText = pdfData.text;        // The actual CV text content
            numPages = pdfData.numpages;          // How many pages the PDF has
            pdfInfo = pdfData.info;               // Metadata (author, title, etc.)
            
            console.log("PDF parsed successfully:");
            console.log("- Pages:", numPages);
            console.log("- Text length:", extractedText.length, "characters");
            console.log("- First 200 chars:", extractedText.substring(0, 200));
        } catch (parseError) {
            console.error("PDF parsing failed:", parseError);
            // If parsing fails, still upload the file but without extracted text
            extractedText = '';
        }

        // SECTION C: Save to Database - UPDATED
        const user = await User.findByIdAndUpdate(
            userId,
            {
                cv: {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    path: req.file.path,
                    uploadDate: new Date(),
                    extractedText: extractedText,  // NEW: Store the parsed text
                    numPages: numPages,              // NEW: Store page count
                    metadata: pdfInfo                // NEW: Store PDF metadata
                }
            },
            { new: true }
        );

        // SECTION D: Error handling if user not found
        if (!user) {
            // Delete the uploaded file since user doesn't exist
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // SECTION E: Send success response
        res.json({
            message: "CV uploaded and parsed successfully",
            cv: user.cv,
            extractedPreview: extractedText.substring(0, 500)  // Send first 500 chars as preview
        });

    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Erreur lors du téléchargement" });
    }
});
// Add this new endpoint
app.get("/stats/etudiant/:etudiantId", async (req, res) => {
    try {
        const offres = await Offre.find({});
        
        let activeApplications = 0;
        let upcomingInterviews = 0;
        
        offres.forEach(offre => {
            if (offre.candidatures) {
                offre.candidatures.forEach(c => {
                    if (c.etudiantId.toString() === req.params.etudiantId) {
                        if (c.statut === 'en attente') {
                            activeApplications++;
                        }
                        if (c.statut === 'acceptée' && 
                            (!c.scoreEntretien || c.scoreEntretien === null)) {
                            upcomingInterviews++;
                        }
                    }
                });
            }
        });
        
        res.json({
            activeApplications,
            upcomingInterviews,
            totalOffres: offres.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: "Le fichier ne doit pas dépasser 5MB" });
        }
    }
    res.status(500).json({ error: error.message });
});

app.get("/users/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const userData = {
            _id: user._id,
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            dateCreation: user.dateCreation,
            role: user.role,
            cv: user.cv
        };

        console.log("Sending user data:", userData);
        
        res.json(userData);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get("/users/:userId/cv", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user || !user.cv || !user.cv.path) {
            return res.status(404).json({ error: "Aucun CV trouvé" });
        }

        res.sendFile(path.resolve(user.cv.path));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/offres", async (req, res) => {
    try {
        const offres = await Offre.find({ statut: 'active' })
            .populate('recruteurId', 'prenom nom email isBlocked')
            .sort({ dateCreation: -1 });
        
        // Add a flag to each offer indicating if its recruiter is blocked
        const offresWithBlockStatus = offres.map(offre => {
            const offreObj = offre.toObject();
            // Check BOTH: user's isBlocked flag AND the temporary recruiterBlocked flag
            offreObj.recruteurBlocked = (offre.recruteurId?.isBlocked === true) || (offreObj.recruiterBlocked === true);
            return offreObj;
        });
        
        res.json(offresWithBlockStatus);
    } catch (err) {
        console.error("Error fetching offers:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Get recruiter status (blocked or not)
app.get("/recruteur/:recruteurId/status", async (req, res) => {
    try {
        const recruiter = await User.findById(req.params.recruteurId);
        
        if (!recruiter) {
            return res.status(404).json({ error: "Recruteur non trouvé" });
        }
        
        res.json({ 
            isBlocked: recruiter.isBlocked || false,
            blockedReason: recruiter.blockedReason,
            blockedAt: recruiter.blockedAt
        });
    } catch (err) {
        console.error("Error fetching recruiter status:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post("/offres", async (req, res) => {
    try {
        const { titre, description, entreprise, localisation, typeContrat, salaire, competences, recruteurId, dateLimite } = req.body;
        
        if (!titre || !description || !entreprise || !localisation || !typeContrat || !recruteurId) {
            return res.status(400).json({ error: "Tous les champs obligatoires sont requis" });
        }
        
        const nouvelleOffre = new Offre({
            titre,
            description,
            entreprise,
            localisation,
            typeContrat,
            salaire,
            competences,
            recruteurId,
            dateLimite,
        });
        
        await nouvelleOffre.save();
        res.status(201).json({ message: "Offre créée avec succès", offre: nouvelleOffre });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get all candidatures for a specific student
app.get("/candidatures/etudiant/:etudiantId", async (req, res) => {
    try {
        const offres = await Offre.find({
            "candidatures.etudiantId": req.params.etudiantId
        });
        
        const mesCandidatures = [];
        
        offres.forEach(offre => {
            if (offre.candidatures && offre.candidatures.length > 0) {
                const maCandidature = offre.candidatures.find(
                    c => c.etudiantId.toString() === req.params.etudiantId
                );
                
                if (maCandidature) {
                    mesCandidatures.push({
                        offreId: offre._id,
                        offreTitre: offre.titre,
                        offreDescription: offre.description,
                        entreprise: offre.entreprise,
                        localisation: offre.localisation,
                        typeContrat: offre.typeContrat,
                        salaire: offre.salaire,
                        competences: offre.competences,
                        offreStatut: offre.statut,
                        dateLimite: offre.dateLimite,
                        candidatureId: maCandidature._id,
                        statutCandidature: maCandidature.statut,
                        dateCandidature: maCandidature.dateCandidature,
                        lettreMotivation: maCandidature.lettreMotivation,
                        commentaireRecruteur: maCandidature.commentaire || '',
                        scoreEntretien: maCandidature.scoreEntretien,
                        commentaireEntretien: maCandidature.commentaireEntretien,
                        scores: maCandidature.scores,
                    });
                }
            }
        });
        
        res.json(mesCandidatures);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get all offers for a specific recruiter (for the recruiter's own view)
app.get("/offres/recruteur/:recruteurId", async (req, res) => {
    try {
        const recruteurId = req.params.recruteurId;
        
        // Get recruiter info to check block status
        const recruiter = await User.findById(recruteurId);
        const isRecruiterBlocked = recruiter ? recruiter.isBlocked : false;
        
        // Get all offers for this recruiter (including blocked ones - they still need to see them)
        const offres = await Offre.find({ recruteurId: recruteurId })
            .sort({ dateCreation: -1 });
        
        // Add block status to each offer for frontend display
        const offresWithStatus = offres.map(offre => {
            const offreObj = offre.toObject();
            offreObj.recruteurBlocked = isRecruiterBlocked;
            return offreObj;
        });
        
        res.json(offresWithStatus);
    } catch (err) {
        console.error("Error fetching recruiter offers:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get recruiter stats (for dashboard) - shows 0 if blocked
app.get("/stats/recruteur/:recruteurId", async (req, res) => {
    try {
        const recruteurId = req.params.recruteurId;
        
        // Check if recruiter is blocked
        const recruiter = await User.findById(recruteurId);
        const isBlocked = recruiter ? recruiter.isBlocked : false;
        
        // If blocked, return zeros (they can't do anything anyway)
        if (isBlocked) {
            return res.json({
                activeOffres: 0,
                totalCandidates: 0,
                scheduledInterviews: 0,
                positionsFilled: 0,
                isBlocked: true,
                blockedReason: recruiter.blockedReason
            });
        }
        
        const offres = await Offre.find({ recruteurId: recruteurId });
        
        const activeOffres = offres.filter(o => o.statut === 'active').length;
        
        let totalCandidates = 0;
        let interviewsCount = 0;
        let filledPositions = 0;
        
        offres.forEach(offre => {
            totalCandidates += offre.candidatures?.length || 0;
            interviewsCount += offre.candidatures?.filter(c => c.statut === 'acceptée').length || 0;
            if (offre.statut === 'fermée') filledPositions++;
        });
        
        res.json({
            activeOffres,
            totalCandidates,
            scheduledInterviews: interviewsCount,
            positionsFilled: filledPositions,
            isBlocked: false
        });
        
    } catch (err) {
        console.error("Error fetching recruiter stats:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get available offers for students (excludes offers from blocked recruiters)
app.get("/offres/available/:etudiantId", async (req, res) => {
    try {
        // Find all offers where the student has applied
        const appliedOffers = await Offre.find({
            "candidatures.etudiantId": req.params.etudiantId
        }).select('_id');
        
        const appliedOfferIds = appliedOffers.map(offer => offer._id);
        
        // Get all active offers, populate recruiter info to check block status
        const allActiveOffers = await Offre.find({
            statut: 'active',
            _id: { $nin: appliedOfferIds }
        }).populate('recruteurId', 'isBlocked');
        
        // Filter out offers from blocked recruiters
        const availableOffres = allActiveOffers.filter(offre => 
            offre.recruteurId && offre.recruteurId.isBlocked !== true
        );
        
        res.json(availableOffres);
    } catch (err) {
        console.error("Error fetching available offers:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.put("/offres/:id", async (req, res) => {
    try {
        const offre = await Offre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        res.json({ message: "Offre modifiée", offre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user profile
app.put("/users/:id", async (req, res) => {
    try {
        const { prenom, nom } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { prenom, nom }, 
            { new: true }
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "Profile updated", user: { prenom: user.prenom, nom: user.nom, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Change password
app.put("/users/:id/change-password", async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ error: "User not found" });
        
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) return res.status(401).json({ error: "Erreur : mot de passe actuel incorrect" });
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        
        res.json({ message: "Mot de passe changé avec succès!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/offres/:id", async (req, res) => {
    try {
        const offre = await Offre.findByIdAndDelete(req.params.id);
        
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        res.json({ message: "Offre supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/offres/:offreId/candidatures/:candidatureId", async (req, res) => {
    try {
        const offre = await Offre.findById(req.params.offreId);
        
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        // Find the candidature
        const candidature = offre.candidatures.id(req.params.candidatureId);
        if (!candidature) {
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        // Remove the candidature using pull
        offre.candidatures.pull(req.params.candidatureId);
        await offre.save();
        
        console.log("Candidature deleted successfully");
        
        res.json({ message: "Candidature supprimée avec succès" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get available offers for a student (excluding already applied)
app.get("/offres/available/:etudiantId", async (req, res) => {
    try {
        // Find all offers where the student has applied
        const appliedOffers = await Offre.find({
            "candidatures.etudiantId": req.params.etudiantId
        }).select('_id');
        
        // Extract the IDs of applied offers
        const appliedOfferIds = appliedOffers.map(offer => offer._id);
        
        // Get all active offers excluding the applied ones
        const availableOffres = await Offre.find({
            statut: 'active',
            _id: { $nin: appliedOfferIds }
        })
            .populate('recruteurId', 'prenom nom email')
            .sort({ dateCreation: -1 });
        
        res.json(availableOffres);
    } catch (err) {
        console.error("Error fetching available offers:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post("/offres/:id/postuler", async (req, res) => {
    try {
        const { etudiantId, lettreMotivation } = req.body;
        
        const offre = await Offre.findById(req.params.id).populate('recruteurId', 'isBlocked');
        
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        // CHECK IF RECRUITER IS BLOCKED
        if (offre.recruteurId && offre.recruteurId.isBlocked === true) {
            return res.status(403).json({ 
                error: "Désolé, cette offre n'est pas disponible pour le moment. Le recruteur est temporairement indisponible.",
                recruiterBlocked: true
            });
        }
        
        const dejaPostule = offre.candidatures.find(
            c => c.etudiantId.toString() === etudiantId
        );
        
        if (dejaPostule) {
            return res.status(400).json({ error: "Vous avez déjà postulé à cette offre" });
        }
        
        offre.candidatures.push({
            etudiantId,
            lettreMotivation,
        });
        
        await offre.save();
        res.json({ message: "Candidature envoyée avec succès" });
        
    } catch (err) {
        console.error("Postuler error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Add this helper function at the top of server.js
const handleGeminiError = (error, res) => {
    console.error("Gemini API Error:", error);
    
    if (error.code === 429) {
        return res.status(429).json({ 
            error: "API quota exceeded. Please try again later.",
            code: 429,
            retryAfter: error.details?.[2]?.retryDelay || "60s"
        });
    }
    
    return res.status(500).json({ 
        error: "AI service temporarily unavailable",
        code: 500
    });
};

// Update the interview endpoint
app.post("/chat/interview", async (req, res) => {
    try {
        const { message, offreTitre, entreprise, competences, typeContrat, historique } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;
        
        if (!API_KEY) {
            return res.status(500).json({ error: "API key not configured" });
        }
        
        console.log("Message received:", message);
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Tu es un recruteur professionnel qui conduit un entretien d'embauche.

POSTE: ${offreTitre}
ENTREPRISE: ${entreprise}
TYPE DE CONTRAT: ${typeContrat}
COMPÉTENCES REQUISES: ${competences?.join(', ') || 'Non spécifiées'}

HISTORIQUE DE LA CONVERSATION:
${historique || 'Début de l\'entretien'}

DERNIER MESSAGE DU CANDIDAT:
${message}

INSTRUCTIONS:
- Tu es le recruteur, pas un assistant
- Pose UNE seule question à la fois
- Réponds TOUJOURS en français
- Si c'est le premier message, commence par te présenter comme recruteur
- Sois professionnel mais bienveillant
- Ne dis jamais que tu es une IA`
                        }]
                    }]
                })
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            return handleGeminiError(errorData.error, res);
        }
        
        const data = await response.json();
        console.log("Gemini response received successfully");
        
        if (data.candidates && data.candidates[0]) {
            res.json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "No response from AI" });
        }
        
    } catch (err) {
        console.error("Chat error:", err);
        handleGeminiError(err, res);
    }
});

// Update the scoring endpoint with proper error handling
app.post("/chat/score-interview", async (req, res) => {
    try {
        const { conversation, offreTitre, entreprise, competences, offreId, candidatureId } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;
        
        if (!API_KEY) {
            return res.status(500).json({ error: "API key not configured" });
        }
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Tu es un évaluateur d'entretien. Analyse cette conversation et donne un score.

POSTE: ${offreTitre}
ENTREPRISE: ${entreprise}
COMPÉTENCES REQUISES: ${competences?.join(', ') || 'Non spécifiées'}

CONVERSATION COMPLÈTE:
${conversation}

Évalue sur 100 points:
- Pertinence des réponses (30 points)
- Connaissances techniques (25 points)
- Communication et clarté (20 points)
- Motivation et attitude (15 points)
- Professionnalisme (10 points)

IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après. Le format doit être exactement:
{
  "scoreTotal": 85,
  "scores": {
    "pertinence": 25,
    "technique": 22,
    "communication": 18,
    "motivation": 12,
    "professionnalisme": 8
  },
  "commentaire": "Commentaire détaillé sur la performance"
}`
                        }]
                    }]
                })
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            // Return a default score instead of error
            return res.json({
                scoreTotal: 70,
                scores: {
                    pertinence: 20,
                    technique: 18,
                    communication: 14,
                    motivation: 10,
                    professionnalisme: 8
                },
                commentaire: "L'entretien s'est bien déroulé. L'évaluation détaillée sera disponible ultérieurement."
            });
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error("Invalid response from Gemini");
        }
        
        let evaluationText = data.candidates[0].content.parts[0].text;
        
        // Clean the response
        evaluationText = evaluationText.trim();
        evaluationText = evaluationText.replace(/```json\n?/g, '').replace(/```/g, '');
        
        // Find the JSON object
        const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }
        
        const evaluation = JSON.parse(jsonMatch[0]);
        
        // Always provide a safe structure
        const safeEvaluation = {
            scoreTotal: evaluation.scoreTotal || 70,
            scores: {
                pertinence: evaluation.scores?.pertinence || 20,
                technique: evaluation.scores?.technique || 18,
                communication: evaluation.scores?.communication || 14,
                motivation: evaluation.scores?.motivation || 10,
                professionnalisme: evaluation.scores?.professionnalisme || 8
            },
            commentaire: evaluation.commentaire || "Bonne performance générale."
        };
        
        // Save to database if IDs provided
        if (offreId && candidatureId) {
            try {
                const offre = await Offre.findById(offreId);
                if (offre) {
                    const candidature = offre.candidatures.id(candidatureId);
                    if (candidature) {
                        candidature.scoreEntretien = safeEvaluation.scoreTotal;
                        candidature.commentaireEntretien = safeEvaluation.commentaire;
                        await offre.save();
                    }
                }
            } catch (dbErr) {
                console.error("Database save error:", dbErr);
            }
        }
        
        res.json(safeEvaluation);
        
    } catch (err) {
        console.error("Scoring error:", err);
        // Always return a valid score object
        res.json({
            scoreTotal: 65,
            scores: {
                pertinence: 18,
                technique: 16,
                communication: 13,
                motivation: 10,
                professionnalisme: 8
            },
            commentaire: "L'entretien s'est déroulé correctement. Continuez vos efforts pour les prochains entretiens."
        });
    }
});


app.put("/offres/:offreId/candidatures/:candidatureId", async (req, res) => {
    try {
        const { statut, commentaire } = req.body;
        console.log("Received:", { statut, commentaire }); // Debug log
        
        const offre = await Offre.findById(req.params.offreId);
        
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        const candidature = offre.candidatures.id(req.params.candidatureId);
        if (!candidature) {
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        candidature.statut = statut;
        if (commentaire !== undefined) {
            candidature.commentaire = commentaire;
        }
        
        await offre.save();
        console.log("Updated candidature:", candidature); // Debug log
        
        res.json({ message: "Statut mis à jour", candidature });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

    // SECTION A: Helper function to get CV text for matching
async function extractCVText(userId) {
    try {
        // Find the user in database
        const user = await User.findById(userId);
        
        // Check if user exists and has a CV
        if (!user || !user.cv || !user.cv.path) {
            console.log("No CV found for user:", userId);
            return null;
        }
        
        // If we already extracted text before, use that (fast!)
        if (user.cv.extractedText) {
            console.log("Using cached text for user:", userId);
            return user.cv.extractedText;
        }
        
        // If no cached text, parse the PDF now (slow - only happens once)
        console.log("Parsing PDF for user:", userId);
        
        // Check if file still exists on disk
        if (!fs.existsSync(user.cv.path)) {
            console.error("CV file not found on disk:", user.cv.path);
            return null;
        }
        
        // Read file and parse
        const pdfBuffer = fs.readFileSync(user.cv.path);
        const pdfData = await pdfParse(pdfBuffer);
        
        // Save the extracted text for next time (cache it)
        user.cv.extractedText = pdfData.text;
        await user.save();
        
        console.log("PDF text cached successfully");
        return pdfData.text;
        
    } catch (err) {
        console.error("Error extracting CV text:", err);
        return null;
    }
}

// SECTION B: Endpoint that uses the helper function
app.get("/cv-text/:userId", async (req, res) => {
    try {
        const text = await extractCVText(req.params.userId);
        
        if (!text) {
            return res.status(404).json({ error: "Aucun CV trouvé ou texte non disponible" });
        }
        
        res.json({ 
            text: text,
            length: text.length,
            preview: text.substring(0, 300) + "..." 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/cv/analyze/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Get CV text using existing function
        const cvText = await extractCVText(userId);
        
        if (!cvText) {
            return res.status(404).json({ error: "Aucun CV trouvé pour cet utilisateur" });
        }
        
        // Perform analysis
        const analysis = {
            skills: nlpService.extractSkills(cvText),
            contactInfo: nlpService.extractContactInfo(cvText),
            education: nlpService.extractEducation(cvText),
            experienceYears: nlpService.extractExperienceYears(cvText),
            languages: nlpService.extractLanguages(cvText),
            cvScore: nlpService.calculateCVScore(cvText),
            suggestions: nlpService.generateSuggestions(cvText),
            summary: nlpService.getSummary(cvText)
        };
        
        res.json(analysis);
    } catch (err) {
        console.error("CV analysis error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Match CV against job offer requirements
app.post("/cv/match/:userId/:offreId", async (req, res) => {
    try {
        const { userId, offreId } = req.params;
        
        // Get CV text
        const cvText = await extractCVText(userId);
        if (!cvText) {
            return res.status(404).json({ error: "CV non trouvé" });
        }
        
        // Get job offer
        const offre = await Offre.findById(offreId);
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        // Extract CV skills
        const cvSkills = nlpService.extractSkills(cvText);
        const cvSkillsSet = new Set(cvSkills.map(s => s.toLowerCase()));
        
        // Get required skills from offer
        const requiredSkills = offre.competences || [];
        
        // Calculate match
        const matchedSkills = requiredSkills.filter(skill => 
            cvSkillsSet.has(skill.toLowerCase())
        );
        
        const missingSkills = requiredSkills.filter(skill => 
            !cvSkillsSet.has(skill.toLowerCase())
        );
        
        const matchPercentage = requiredSkills.length > 0 
            ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
            : 0;
        
        // Get additional analysis
        const cvExperience = nlpService.extractExperienceYears(cvText);
        const cvLanguages = nlpService.extractLanguages(cvText);
        
        res.json({
            matchPercentage,
            matchedSkills,
            missingSkills,
            cvExperience,
            cvLanguages,
            totalSkills: requiredSkills.length,
            cvScore: nlpService.calculateCVScore(cvText)
        });
    } catch (err) {
        console.error("CV matching error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Quick analysis - just skills extraction
app.post("/cv/skills/:userId", async (req, res) => {
    try {
        const cvText = await extractCVText(req.params.userId);
        
        if (!cvText) {
            return res.status(404).json({ error: "CV non trouvé" });
        }
        
        const skills = nlpService.extractSkills(cvText);
        
        res.json({ skills, count: skills.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Analyze CV from text directly (for testing or direct input)
app.post("/cv/analyze-text", async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: "Texte du CV requis" });
        }
        
        const analysis = {
            skills: nlpService.extractSkills(text),
            contactInfo: nlpService.extractContactInfo(text),
            education: nlpService.extractEducation(text),
            experienceYears: nlpService.extractExperienceYears(text),
            languages: nlpService.extractLanguages(text),
            cvScore: nlpService.calculateCVScore(text),
            suggestions: nlpService.generateSuggestions(text),
            summary: nlpService.getSummary(text)
        };
        
        res.json(analysis);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auto-apply endpoint - analyzes CV and applies to matching offers
// Dans server.js - Modifiez la partie auto-apply
app.post("/offres/auto-apply/:etudiantId", async (req, res) => {
    try {
        const etudiantId = req.params.etudiantId;
        
        // Get CV text
        const cvText = await extractCVText(etudiantId);
        if (!cvText) {
            return res.status(404).json({ error: "Aucun CV trouvé." });
        }
        
        const cvSkills = nlpService.extractSkills(cvText);
        const cvSkillsSet = new Set(cvSkills.map(s => s.toLowerCase()));
        
        // Get offers the student already applied to
        const appliedOffers = await Offre.find({
            "candidatures.etudiantId": etudiantId
        }).select('_id');
        
        const appliedOfferIds = appliedOffers.map(offer => offer._id);
        
        // Get all active offers, populate recruiter info to check block status
        const availableOffres = await Offre.find({
            statut: 'active',
            _id: { $nin: appliedOfferIds }
        }).populate('recruteurId', 'isBlocked');
        
        const results = {
            total: availableOffres.length,
            applied: 0,
            skipped: 0,
            details: []
        };
        
        for (const offre of availableOffres) {
            // SKIP OFFERS FROM BLOCKED RECRUITERS
            if (offre.recruteurId && offre.recruteurId.isBlocked === true) {
                results.skipped++;
                results.details.push({
                    offreId: offre._id,
                    titre: offre.titre,
                    entreprise: offre.entreprise,
                    status: 'skipped',
                    reason: 'Recruteur temporairement indisponible (compte bloqué)'
                });
                continue;
            }
            
            const requiredSkills = offre.competences || [];
            
            if (requiredSkills.length === 0) {
                results.skipped++;
                results.details.push({
                    offreId: offre._id,
                    titre: offre.titre,
                    status: 'skipped',
                    reason: 'Aucune compétence requise spécifiée'
                });
                continue;
            }
            
            const matchedSkills = requiredSkills.filter(skill => 
                cvSkillsSet.has(skill.toLowerCase())
            );
            
            const matchPercentage = requiredSkills.length > 0 
                ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
                : 0;
            
            if (matchPercentage >= 70) {
                offre.candidatures.push({
                    etudiantId,
                    lettreMotivation: `[Candidature Automatique IA] Basée sur l'analyse du CV - Taux de correspondance: ${matchPercentage}%\nCompétences correspondantes: ${matchedSkills.join(', ')}`,
                    statut: 'en attente',
                    typeCandidature: 'automatique',
                    scoreAuto: matchPercentage
                });
                
                await offre.save();
                results.applied++;
                results.details.push({
                    offreId: offre._id,
                    titre: offre.titre,
                    entreprise: offre.entreprise,
                    status: 'applied',
                    matchPercentage,
                    matchedSkills,
                    missingSkills: requiredSkills.filter(skill => !cvSkillsSet.has(skill.toLowerCase()))
                });
            } else {
                results.skipped++;
                results.details.push({
                    offreId: offre._id,
                    titre: offre.titre,
                    status: 'skipped',
                    matchPercentage,
                    reason: `Taux de correspondance insuffisant (${matchPercentage}% < 70%)`
                });
            }
        }
        
        res.json({
            message: `Candidature automatique terminée: ${results.applied} offre(s) ciblée(s)`,
            results
        });
        
    } catch (err) {
        console.error("Auto-apply error:", err);
        res.status(500).json({ error: err.message });
    }
});
// Dans server.js - Ajoutez cet endpoint
app.put("/offres/accept-all-ai/:recruteurId", async (req, res) => {
    try {
        const recruteurId = req.params.recruteurId;
        const { commentaire } = req.body;
        
        // Trouver toutes les offres du recruteur
        const offres = await Offre.find({ recruteurId });
        
        let totalAccepted = 0;
        
        for (const offre of offres) {
            let modified = false;
            
            // Parcourir les candidatures de l'ofddd
            for (const candidature of offre.candidatures) {
                // Accepter seulement les candidatures automatiques "en attente"
                if (candidature.typeCandidature === 'automatique' && 
                    candidature.statut === 'en attente') {
                    
                    candidature.statut = 'acceptée';
                    candidature.commentaire = commentaire || 'Acceptée automatiquement via le système IA';
                    modified = true;
                    totalAccepted++;
                }
            }
            
            if (modified) {
                await offre.save();
            }
        }
        
        res.json({
            message: `${totalAccepted} candidature(s) automatique(s) acceptée(s) avec succès`,
            totalAccepted
        });
        
    } catch (err) {
        console.error("Accept all AI error:", err);
        res.status(500).json({ error: err.message });
    }
});
// Get matching analysis without applying
app.get("/offres/match-analysis/:etudiantId", async (req, res) => {
    try {
        const etudiantId = req.params.etudiantId;
        
        // Get CV text
        const cvText = await extractCVText(etudiantId);
        if (!cvText) {
            return res.status(404).json({ error: "Aucun CV trouvé" });
        }
        
        // Extract CV skills
        const cvSkills = nlpService.extractSkills(cvText);
        const cvSkillsSet = new Set(cvSkills.map(s => s.toLowerCase()));
        
        // Get all active offers
        const appliedOffers = await Offre.find({
            "candidatures.etudiantId": etudiantId
        }).select('_id');
        
        const appliedOfferIds = appliedOffers.map(offer => offer._id);
        
        const availableOffres = await Offre.find({
            statut: 'active',
            _id: { $nin: appliedOfferIds }
        }).populate('recruteurId', 'prenom nom email');
        
        // Analyze each offer
        const analyzedOffers = availableOffres.map(offre => {
            const requiredSkills = offre.competences || [];
            const matchedSkills = requiredSkills.filter(skill => 
                cvSkillsSet.has(skill.toLowerCase())
            );
            const matchPercentage = requiredSkills.length > 0 
                ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
                : 0;
            const willAutoApply = matchPercentage >= 70;
            
            return {
                _id: offre._id,
                titre: offre.titre,
                entreprise: offre.entreprise,
                localisation: offre.localisation,
                typeContrat: offre.typeContrat,
                salaire: offre.salaire,
                competences: offre.competences,
                recruteurId: offre.recruteurId,
                dateLimite: offre.dateLimite,
                matchAnalysis: {
                    matchPercentage,
                    matchedSkills,
                    missingSkills: requiredSkills.filter(skill => !cvSkillsSet.has(skill.toLowerCase())),
                    willAutoApply,
                    cvSkillsFound: cvSkills.length
                }
            };
        });
        
        // Sort by match percentage
        analyzedOffers.sort((a, b) => b.matchAnalysis.matchPercentage - a.matchAnalysis.matchPercentage);
        
        res.json({
            cvSkills,
            offers: analyzedOffers,
            summary: {
                totalOffers: analyzedOffers.length,
                offersAboveThreshold: analyzedOffers.filter(o => o.matchAnalysis.willAutoApply).length,
                highestMatch: analyzedOffers[0]?.matchAnalysis.matchPercentage || 0
            }
        });
        
    } catch (err) {
        console.error("Match analysis error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Déployer une interview AI pour une candidature acceptée
app.post("/interview/deploy", async (req, res) => {
    try {
        const { candidatureId, offreId, etudiantId } = req.body;
        
        const offre = await Offre.findById(offreId);
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        const candidature = offre.candidatures.id(candidatureId);
        if (!candidature) {
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        // Marquer l'interview comme déployée
        candidature.interviewType = 'ai';
        candidature.interviewDeployee = true;
        candidature.dateDeploiementInterview = new Date();
        candidature.statutInterview = 'deployee';
        
        await offre.save();
        
        res.json({ 
            message: "Interview AI déployée avec succès",
            candidature: {
                id: candidature._id,
                interviewDeployee: candidature.interviewDeployee,
                dateDeploiementInterview: candidature.dateDeploiementInterview
            }
        });
    } catch (err) {
        console.error("Erreur déploiement interview:", err);
        res.status(500).json({ error: err.message });
    }
});

// ===== NOUVEAUX ENDPOINTS POUR L'INTERVIEW RÉEL =====

// ===== ENDPOINT ENTRETIEN RÉEL =====
// MODIFIER CET ENDPOINT - Ne pas générer de lien immédiatement
app.post("/entretien/deployer-reel", async (req, res) => {
    try {
        console.log('📡 /entretien/deployer-reel appelé');
        console.log('Body reçu:', req.body);
        
        const { idCandidature, idOffre, idEtudiant, idRecruteur } = req.body;
        
        // Trouver l'offre
        const offre = await Offre.findById(idOffre);
        if (!offre) {
            console.error('❌ Offre non trouvée:', idOffre);
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        // Trouver la candidature
        const candidature = offre.candidatures.id(idCandidature);
        if (!candidature) {
            console.error('❌ Candidature non trouvée:', idCandidature);
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        console.log('✅ Candidature trouvée, statut actuel:', candidature.statut);
        
        // Mettre à jour les champs pour l'entretien réel
        candidature.interviewType = 'reel';
        candidature.entretienReelActive = true;
        candidature.dateActivationEntretien = new Date();
        candidature.etapeEntretien = 'attente_creneau';  // En attente que le RECRUTEUR choisisse le créneau
        candidature.alerteEtudiant = false;  // Pas encore, le recruteur n'a pas choisi
        candidature.alerteRecruteur = true;  // Le recruteur doit agir
        
        await offre.save();
        
        console.log('✅ Entretien réel activé, en attente du choix de créneau par le recruteur');
        console.log('Nouvelle étape:', candidature.etapeEntretien);
        
        res.json({ 
            message: "Entretien réel activé. Le recruteur va maintenant choisir un créneau.",
            idCandidature: idCandidature,
            etape: candidature.etapeEntretien
        });
        
    } catch (err) {
        console.error("❌ Erreur deployer-reel:", err);
        res.status(500).json({ error: err.message });
    }
});


// In server.js, add this new endpoint:
app.post("/creneaux/planifier-recruteur", async (req, res) => {
    try {
        const { date, heureDebut, heureFin, idRecruteur, idOffre, idCandidature, idEtudiant } = req.body;
        
        console.log('📅 Planification recruteur:', { date, heureDebut, heureFin, idRecruteur, idOffre, idCandidature, idEtudiant });
        
        // Step 1: Create the creneau (Safe manual parsing)
        const [year, month, day] = date.split('-');
        const creneauDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (creneauDate < today) {
            return res.status(400).json({ error: "Impossible de créer un créneau à une date passée" });
        }

        // --- VÉRIFICATION ANTI-DOUBLON ---
        // On cherche s'il existe déjà un créneau pour ce recruteur à cette date et à cette heure précise
        const conflit = await Creneau.findOne({
            idRecruteur: idRecruteur,
            dateCreneau: date,
            heureDebut: heureDebut 
        });

        if (conflit) {
            return res.status(400).json({ error: "❌ Vous avez déjà un entretien planifié à cette date et heure exacte." });
        }
        // ---------------------------------
        
        // Create the slot
        const nouveauCreneau = new Creneau({
            dateCreneau: date,
            heureDebut,
            heureFin,
            idRecruteur,
            idCandidature,
            idOffre,
            idEtudiant,
            etatCreneau: 'reserve',
            etapeEntretien: 'creneau_choisi'
        });
        
        // Generate video link immediately
        const crypto = require('crypto'); // Assurez-vous que crypto est bien importé en haut de votre fichier
        const roomId = crypto.randomBytes(12).toString('hex');
        const videoLink = `https://meet.jit.si/entretien-${roomId}`;
        
        const startDateTime = new Date(`${date}T${heureDebut}:00`);
        const expirationTime = new Date(startDateTime.getTime() + 60 * 60000);
        
        nouveauCreneau.lienVisio = videoLink;
        nouveauCreneau.visioGeneratedAt = new Date();
        nouveauCreneau.visioExpiresAt = expirationTime;
        
        await nouveauCreneau.save();
        
        // Step 2: Update the candidature in the offre
        const offre = await Offre.findById(idOffre);
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        const candidature = offre.candidatures.id(idCandidature);
        if (!candidature) {
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        // Update candidature
        candidature.statut = 'acceptée';
        candidature.interviewType = 'reel';
        candidature.etapeEntretien = 'creneau_choisi';
        candidature.creneauChoisi = {
            date: date,
            heureDebut: heureDebut,
            heureFin: heureFin
        };
        candidature.lienVisio = videoLink;
        candidature.commentaire = `Acceptée - Entretien planifié le ${date} à ${heureDebut}`;
        candidature.alerteEtudiant = true;
        candidature.alerteRecruteur = false;
        
        await offre.save();
        
        console.log(`✅ Entretien planifié avec succès. Lien: ${videoLink}`);
        
        res.json({
            message: "Entretien planifié avec succès",
            creneau: {
                _id: nouveauCreneau._id,
                dateCreneau: date,
                heureDebut,
                heureFin,
                lienVisio: videoLink
            }
        });
        
    } catch (err) {
        console.error("❌ Erreur planification:", err);
        res.status(500).json({ error: err.message });
    }
});

// Récupérer les détails d'une candidature avec son créneau (pour le recruteur)
app.get("/candidatures/:candidatureId/details", async (req, res) => {
    try {
        const { candidatureId } = req.params;
        
        const offre = await Offre.findOne({
            "candidatures._id": candidatureId
        });
        
        if (!offre) {
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        const candidature = offre.candidatures.id(candidatureId);
        
        if (!candidature) {
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        // Récupérer le créneau associé si existant
        const creneau = await Creneau.findOne({
            idCandidature: candidatureId
        });
        
        res.json({
            candidature: {
                _id: candidature._id,
                etudiantId: candidature.etudiantId,
                statut: candidature.statut,
                interviewType: candidature.interviewType,
                etapeEntretien: candidature.etapeEntretien,
                creneauChoisi: candidature.creneauChoisi,
                lienVisio: candidature.lienVisio
            },
            offre: {
                _id: offre._id,
                titre: offre.titre,
                entreprise: offre.entreprise
            },
            creneau: creneau ? {
                _id: creneau._id,
                dateCreneau: creneau.dateCreneau,
                heureDebut: creneau.heureDebut,
                heureFin: creneau.heureFin,
                lienVisio: creneau.lienVisio
            } : null
        });
    } catch (err) {
        console.error("Erreur:", err);
        res.status(500).json({ error: err.message });
    }
});



// Récupérer les créneaux déjà réservés pour un recruteur
app.get("/creneaux/recruteur/:idRecruteur", async (req, res) => {
    try {
        const creneauxReserves = await Creneau.find({ 
            idRecruteur: req.params.idRecruteur,
            etatCreneau: { $in: ['reserve', 'confirme'] }
        }).select('dateCreneau heureDebut heureFin');
        
        res.json(creneauxReserves);
    } catch (err) {
        console.error("Erreur chargement créneaux:", err);
        res.status(500).json({ error: err.message });
    }
});

// Récupérer les créneaux disponibles d'un recruteur (uniquement les dates futures)
app.get("/creneaux/recruteur/:recruteurId/disponibles", async (req, res) => {
    try {
        const recruteurId = req.params.recruteurId;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début de journée
        
        // Récupérer les créneaux non réservés ou réservés par l'étudiant
        // mais qui ne sont pas encore confirmés/expirés
        const creneauxDisponibles = await Creneau.find({
            idRecruteur: recruteurId,
            dateCreneau: { $gte: today.toISOString().split('T')[0] }, // Date >= aujourd'hui
            etatCreneau: { $in: ['disponible', 'reserve'] },
            $or: [
                { etapeEntretien: { $ne: 'visio_en_cours' } },
                { etapeEntretien: { $exists: false } }
            ]
        }).sort({ dateCreneau: 1, heureDebut: 1 });
        
        // Filtrer aussi les dates passées manuellement (double sécurité)
        const now = new Date();
        const validCreneaux = creneauxDisponibles.filter(creneau => {
            const creneauDate = new Date(creneau.dateCreneau);
            const [hours, minutes] = creneau.heureDebut.split(':');
            creneauDate.setHours(parseInt(hours), parseInt(minutes), 0);
            return creneauDate > now;
        });
        
        res.json(validCreneaux);
    } catch (err) {
        console.error("Erreur récupération créneaux disponibles:", err);
        res.status(500).json({ error: err.message });
    }
});
// Route pour terminer un entretien visio manuellement
app.put("/offres/:offreId/candidatures/:candidatureId/terminer-visio", async (req, res) => {
    try {
        const { offreId, candidatureId } = req.params;
        const offre = await Offre.findById(offreId);
        
        if (!offre) return res.status(404).json({ error: "Offre non trouvée" });

        const candidature = offre.candidatures.id(candidatureId);
        if (!candidature) return res.status(404).json({ error: "Candidature non trouvée" });

        // On passe le statut en évaluation
        candidature.statut = "evaluation_en_cours";
        
        await offre.save();
        res.json({ message: "Entretien terminé, en attente de décision finale", candidature });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Dans server.js

// 1. Le recruteur envoie la proposition d'embauche définitive
app.put('/candidatures/:offreId/:etudiantId/proposition', async (req, res) => {
    try {
        const { offreId, etudiantId } = req.params;
        const offre = await Offre.findOneAndUpdate(
            { _id: offreId, "candidatures.etudiantId": etudiantId },
            { $set: { "candidatures.$.statut": "proposition_envoyee" } },
            { new: true }
        );
        res.json({ message: "Proposition d'embauche envoyée avec succès", offre });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'envoi de la proposition" });
    }
});

// L'étudiant répond à la proposition (accepte ou refuse)
app.put('/candidatures/:offreId/:etudiantId/decision', async (req, res) => {
    try {
        const { offreId, etudiantId } = req.params;
        const { decision } = req.body; // 'embauche_acceptee' ou 'embauche_refusee'
        
        // 1. Enregistrer la décision de l'étudiant
        let offre = await Offre.findOneAndUpdate(
            { _id: offreId, "candidatures.etudiantId": etudiantId },
            { $set: { "candidatures.$.statut": decision } },
            { new: true } // Renvoie le document mis à jour
        );

        // 2. Si l'étudiant accepte, on vérifie si l'offre est complète
        if (decision === 'embauche_acceptee') {
            // Compter combien d'étudiants ont le statut 'embauche_acceptee' pour cette offre
            const acceptesCount = offre.candidatures.filter(c => c.statut === 'embauche_acceptee').length;
            
            // Si le nombre requis est atteint, on ferme l'offre
            if (offre.nombrePostes && acceptesCount >= offre.nombrePostes) {
                offre.statut = 'fermée';
                await offre.save();
                console.log(`🔒 Offre ${offreId} fermée automatiquement : quota atteint (${acceptesCount}/${offre.nombrePostes}).`);
            }
        }

        res.json({ message: "Votre décision a été enregistrée", offre });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'enregistrement de la décision" });
    }
});

// Créer un créneau pour un recruteur
app.post("/creneaux/recruteur/:recruteurId", async (req, res) => {
    try {
        const recruteurId = req.params.recruteurId;
        const { date, heureDebut, heureFin } = req.body;
        
        // Vérifier que la date n'est pas passée
        // Step 1: Create the creneau (Safe manual parsing)
        const [year, month, day] = date.split('-');
        const creneauDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (creneauDate < today) {
            return res.status(400).json({ error: "Impossible de créer un créneau à une date passée" });
        }
        
        // Vérifier qu'il n'y a pas de conflit
        const conflit = await Creneau.findOne({
            idRecruteur: recruteurId,
            dateCreneau: date,
            heureDebut: heureDebut,
            etatCreneau: { $in: ['disponible', 'reserve'] }
        });
        
        if (conflit) {
            return res.status(400).json({ error: "Un créneau existe déjà à cette date et heure" });
        }
        
        const nouveauCreneau = new Creneau({
            dateCreneau: date,
            heureDebut,
            heureFin,
            idRecruteur: recruteurId,
            etatCreneau: 'disponible',
            etapeEntretien: 'disponible'
        });
        
        await nouveauCreneau.save();
        
        res.status(201).json(nouveauCreneau);
    } catch (err) {
        console.error("Erreur création créneau:", err);
        res.status(500).json({ error: err.message });
    }
});


// Assigner directement un créneau à une candidature (recruteur choisit)
app.post("/creneaux/assigner-direct", async (req, res) => {
    try {
        const { candidatureId, offreId, etudiantId, slotId, recruteurId } = req.body;
        
        console.log("🎯 Assignation directe:", { candidatureId, offreId, etudiantId, slotId, recruteurId });
        
        // Vérifier que le créneau existe et est disponible
        const creneau = await Creneau.findById(slotId);
        
        if (!creneau) {
            return res.status(404).json({ error: "Créneau non trouvé" });
        }
        
        // Vérifier que la date n'est pas passée
        const creneauDate = new Date(creneau.dateCreneau);
        const now = new Date();
        const [hours, minutes] = creneau.heureDebut.split(':');
        creneauDate.setHours(parseInt(hours), parseInt(minutes), 0);
        
        if (creneauDate <= now) {
            return res.status(400).json({ error: "Ce créneau est déjà passé. Veuillez choisir un autre." });
        }
        
        if (creneau.etatCreneau !== 'disponible' && creneau.etatCreneau !== 'reserve') {
            return res.status(400).json({ error: "Ce créneau n'est plus disponible" });
        }
        
        // Générer le lien de visioconférence IMMÉDIATEMENT
        const roomId = crypto.randomBytes(12).toString('hex');
        const videoLink = `https://meet.jit.si/entretien-${roomId}`;
        
        // Calculer l'expiration (1 heure après le début)
        const startDateTime = new Date(`${creneau.dateCreneau}T${creneau.heureDebut}:00`);
        const expirationTime = new Date(startDateTime.getTime() + 60 * 60000);
        
        // Mettre à jour le créneau
        creneau.idCandidature = candidatureId;
        creneau.idOffre = offreId;
        creneau.idEtudiant = etudiantId;
        creneau.etatCreneau = 'reserve';
        creneau.etapeEntretien = 'creneau_choisi';
        creneau.lienVisio = videoLink;
        creneau.visioGeneratedAt = new Date();
        creneau.visioExpiresAt = expirationTime;
        await creneau.save();
        
        // Mettre à jour la candidature dans l'offre
        const offre = await Offre.findById(offreId);
        
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        const candidature = offre.candidatures.id(candidatureId);
        if (!candidature) {
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        candidature.creneauChoisi = {
            date: creneau.dateCreneau,
            heureDebut: creneau.heureDebut,
            heureFin: creneau.heureFin
        };
        candidature.etapeEntretien = 'creneau_choisi';
        candidature.interviewType = 'reel';
        candidature.lienVisio = videoLink;
        candidature.alerteEtudiant = true;
        candidature.alerteRecruteur = false;
        
        await offre.save();
        
        console.log(`✅ Créneau assigné avec succès. Lien visio: ${videoLink}`);
        
        res.json({
            message: "Créneau assigné avec succès. L'étudiant a été notifié.",
            creneau: {
                _id: creneau._id,
                dateCreneau: creneau.dateCreneau,
                heureDebut: creneau.heureDebut,
                heureFin: creneau.heureFin,
                lienVisio: videoLink,
                visioExpiresAt: expirationTime
            }
        });
        
    } catch (err) {
        console.error("❌ Erreur assignation directe:", err);
        res.status(500).json({ error: err.message });
    }
});



// Middleware to validate video link access
app.get('/validate-link/:creneauId', async (req, res) => {
    try {
        const creneau = await Creneau.findById(req.params.creneauId);
        
        if (!creneau) {
            return res.status(404).json({ 
                canJoin: false, 
                error: 'Creneau non trouvé' 
            });
        }
        
        // Check if link exists
        if (!creneau.lienVisio) {
            return res.json({ 
                canJoin: false, 
                error: 'Le lien de visioconférence n\'est pas encore disponible' 
            });
        }
        
        const now = new Date();
        const startTime = new Date(`${creneau.dateCreneau}T${creneau.heureDebut}:00`);
        const endTime = new Date(startTime.getTime() + 60 * 60000); // +1 hour
        
        // Allow access 5 minutes early
        const earlyAccess = new Date(startTime.getTime() - 5 * 60000);
        
        if (now < earlyAccess) {
            const minutesUntilStart = Math.ceil((startTime - now) / 60000);
            return res.json({ 
                canJoin: false, 
                error: `L'entretien commence dans ${minutesUntilStart} minutes.`,
                startsAt: startTime.toISOString(),
                minutesUntilStart
            });
        }
        
        if (now > endTime) {
            return res.json({ 
                canJoin: false, 
                error: 'L\'entretien est terminé.',
                expired: true
            });
        }
        
        const minutesRemaining = Math.ceil((endTime - now) / 60000);
        
        res.json({ 
            canJoin: true, 
            lienVisio: creneau.lienVisio,
            timeRemaining: minutesRemaining,
            expiresAt: endTime.toISOString()
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single offer by ID
// Get a single offer by ID (with recruiter block status)
app.get("/offres/:id", async (req, res) => {
    try {
        const offre = await Offre.findById(req.params.id)
            .populate('recruteurId', 'prenom nom email isBlocked blockedReason');
        
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        const offreObj = offre.toObject();
        // Add a flag indicating if the recruiter is blocked
        offreObj.recruteurBlocked = offre.recruteurId?.isBlocked === true;
        
        res.json(offreObj);
    } catch (err) {
        console.error("Error fetching offer:", err);
        res.status(500).json({ error: err.message });
    }
});


// Récupérer les entretiens pour un étudiant (pour l'espace entretien)
app.get("/entretiens/etudiant/:idEtudiant", async (req, res) => {
    try {
        const offres = await Offre.find({
            "candidatures.etudiantId": req.params.idEtudiant,
            "candidatures.etapeEntretien": { 
                $in: ['attente_creneau', 'creneau_choisi', 'visio_en_cours'] 
            }
        }).populate('recruteurId', 'prenom nom email');
        
        const entretiens = [];
        
        offres.forEach(offre => {
            offre.candidatures.forEach(c => {
                if (c.etudiantId.toString() === req.params.idEtudiant &&
                    ['attente_creneau', 'creneau_choisi', 'visio_en_cours'].includes(c.etapeEntretien)) {
                    
                    entretiens.push({
                        idOffre: offre._id,
                        offreTitre: offre.titre,
                        entreprise: offre.entreprise,
                        localisation: offre.localisation,
                        idCandidature: c._id,
                        etapeEntretien: c.etapeEntretien,
                        creneauChoisi: c.creneauChoisi,
                        lienVisio: c.lienVisio,
                        alerteEtudiant: c.alerteEtudiant,
                        recruteurInfo: offre.recruteurId ? {
                            prenom: offre.recruteurId.prenom,
                            nom: offre.recruteurId.nom,
                            email: offre.recruteurId.email
                        } : null
                    });
                }
            });
        });
        
        res.json(entretiens);
    } catch (err) {
        console.error("Erreur chargement entretiens:", err);
        res.status(500).json({ error: err.message });
    }
});

// Récupérer les entretiens planifiés pour un recruteur
app.get("/entretiens/recruteur/:idRecruteur", async (req, res) => {
    try {
        const offres = await Offre.find({
            recruteurId: req.params.idRecruteur,
            "candidatures.etapeEntretien": { 
                $in: ['creneau_choisi', 'visio_en_cours'] 
            }
        });
        
        const entretiens = [];
        
        offres.forEach(offre => {
            offre.candidatures.forEach(c => {
                if (['creneau_choisi', 'visio_en_cours'].includes(c.etapeEntretien)) {
                    entretiens.push({
                        idOffre: offre._id,
                        offreTitre: offre.titre,
                        entreprise: offre.entreprise,
                        idCandidature: c._id,
                        idEtudiant: c.etudiantId,
                        etapeEntretien: c.etapeEntretien,
                        creneauChoisi: c.creneauChoisi,
                        lienVisio: c.lienVisio,
                        alerteRecruteur: c.alerteRecruteur
                    });
                }
            });
        });
        
        // Trier par date
        entretiens.sort((a, b) => {
            if (!a.creneauChoisi?.date) return 1;
            if (!b.creneauChoisi?.date) return -1;
            return new Date(a.creneauChoisi.date) - new Date(b.creneauChoisi.date);
        });
        
        res.json(entretiens);
    } catch (err) {
        console.error("Erreur chargement entretiens recruteur:", err);
        res.status(500).json({ error: err.message });
    }
});

// Générer le lien de visioconférence
app.post("/entretien/visio/generer", async (req, res) => {
    try {
        const { idCandidature, idOffre } = req.body;
        
        // Générer un nom de salle unique
        const nomSalle = `entretien-${idOffre}-${idCandidature}-${Date.now()}`;
        const urlVisio = `https://meet.jit.si/${nomSalle}`;
        
        // Mettre à jour la candidature
        const offre = await Offre.findById(idOffre);
        const candidature = offre.candidatures.id(idCandidature);
        candidature.lienVisio = urlVisio;
        candidature.etapeEntretien = 'visio_en_cours';
        candidature.alerteEtudiant = true;
        
        await offre.save();
        
        // Mettre à jour le créneau
        await Creneau.findOneAndUpdate(
            { idCandidature, idOffre },
            { 
                urlVisio: urlVisio, 
                etatCreneau: 'confirme' 
            }
        );
        
        console.log(`✅ Lien visio généré: ${urlVisio}`);
        
        res.json({ 
            message: "Lien de visioconférence généré",
            urlVisio,
            nomSalle 
        });
    } catch (err) {
        console.error("Erreur génération lien visio:", err);
        res.status(500).json({ error: err.message });
    }
});

// Marquer l'entretien comme terminé
app.put("/entretien/terminer", async (req, res) => {
    try {
        const { idCandidature, idOffre } = req.body;
        
        const offre = await Offre.findById(idOffre);
        const candidature = offre.candidatures.id(idCandidature);
        candidature.etapeEntretien = 'termine';
        candidature.entretienReelActive = false;
        
        await offre.save();
        
        // Mettre à jour le créneau
        await Creneau.findOneAndUpdate(
            { idCandidature, idOffre },
            { etatCreneau: 'termine' }
        );
        
        res.json({ message: "Entretien marqué comme terminé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/offres/:offreId/candidatures/:candidatureId/score", async (req, res) => {
    try {
        const { scoreEntretien, commentaireEntretien, scores } = req.body;
        
        const offre = await Offre.findById(req.params.offreId);
        
        if (!offre) {
            return res.status(404).json({ error: "Offre non trouvée" });
        }
        
        const candidature = offre.candidatures.id(req.params.candidatureId);
        if (!candidature) {
            return res.status(404).json({ error: "Candidature non trouvée" });
        }
        
        // Save interview scores
        candidature.scoreEntretien = scoreEntretien;
        candidature.commentaireEntretien = commentaireEntretien;
        candidature.scores = scores;
        
        await offre.save();
        
        res.json({ 
            message: "Score d'entretien sauvegardé avec succès",
            candidature: {
                scoreEntretien: candidature.scoreEntretien,
                commentaireEntretien: candidature.commentaireEntretien,
                scores: candidature.scores
            }
        });
    } catch (err) {
        console.error("Error saving interview score:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==================== ADMIN USER MANAGEMENT ENDPOINTS ====================

// Get all users with optional filters (Admin only)
app.get("/admin/users", async (req, res) => {
    try {
        const { search, role, status } = req.query;
        
        let query = {};
        
        // Filter by role
        if (role && role !== 'all') {
            query.role = role;
        }
        
        // Filter by status (blocked/active)
        if (status === 'blocked') {
            query.isBlocked = true;
        } else if (status === 'active') {
            query.isBlocked = false;
        }
        
        // Search filter (prenom, nom, email)
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { prenom: searchRegex },
                { nom: searchRegex },
                { email: searchRegex }
            ];
        }
        
        const users = await User.find(query).sort({ dateCreation: -1 });
        
        // Get stats for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const stats = {};
            
            if (user.role === 'Etudiant') {
                // Get student's applications
                const offers = await Offre.find({ "candidatures.etudiantId": user._id });
                stats.applicationsCount = offers.reduce((total, offre) => 
                    total + (offre.candidatures?.filter(c => c.etudiantId.toString() === user._id.toString()).length || 0), 0);
                
                // Get accepted applications (interviews)
                stats.interviewsCount = offers.reduce((total, offre) => 
                    total + (offre.candidatures?.filter(c => 
                        c.etudiantId.toString() === user._id.toString() && 
                        c.statut === 'acceptée'
                    ).length || 0), 0);
                
                stats.hasCV = !!(user.cv && user.cv.filename);
                
            } else if (user.role === 'Recruteur') {
                // Get recruiter's offers
                const recruiterOffers = await Offre.find({ recruteurId: user._id });
                stats.offersCount = recruiterOffers.length;
                stats.candidatesCount = recruiterOffers.reduce((total, offre) => 
                    total + (offre.candidatures?.length || 0), 0);
                stats.activeOffers = recruiterOffers.filter(o => o.statut === 'active').length;
            }
            
            return {
                _id: user._id,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email,
                role: user.role,
                dateCreation: user.dateCreation,
                isBlocked: user.isBlocked,
                blockedAt: user.blockedAt,
                blockedReason: user.blockedReason,
                stats
            };
        }));
        
        res.json({
            users: usersWithStats,
            total: usersWithStats.length,
            filters: { search, role, status }
        });
        
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete user and all related data
app.delete("/admin/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Get user before deletion to know their role
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        // Prevent deleting the last admin
        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ error: "Impossible de supprimer le dernier administrateur" });
            }
        }
        
        // Delete user's CV file if exists
        if (user.cv && user.cv.path) {
            try {
                if (fs.existsSync(user.cv.path)) {
                    fs.unlinkSync(user.cv.path);
                }
            } catch (err) {
                console.error("Error deleting CV file:", err);
            }
        }
        
        // If user is a recruiter, delete all their offers
        if (user.role === 'Recruteur') {
            await Offre.deleteMany({ recruteurId: userId });
        }
        
        // If user is a student, remove their applications from offers
        if (user.role === 'Etudiant') {
            await Offre.updateMany(
                { "candidatures.etudiantId": userId },
                { $pull: { candidatures: { etudiantId: userId } } }
            );
        }
        
        // Delete the user
        await User.findByIdAndDelete(userId);
        
        res.json({ 
            message: `Utilisateur ${user.prenom} ${user.nom} supprimé avec succès`,
            deletedUser: { id: userId, email: user.email, role: user.role }
        });
        
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: err.message });
    }
});

// Block user and suspend all their activities
// Block user and suspend all their activities (but DON'T close offers)
app.put("/admin/users/:userId/block", async (req, res) => {
    try {
        const userId = req.params.userId;
        const { reason } = req.body;
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        // Prevent blocking the last admin
        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin', isBlocked: false });
            if (adminCount <= 1) {
                return res.status(400).json({ error: "Impossible de bloquer le dernier administrateur actif" });
            }
        }
        
        // Block the user
        user.isBlocked = true;
        user.blockedAt = new Date();
        user.blockedReason = reason || "Aucune raison fournie";
        await user.save();
        
        // For Recruiters: DO NOT close offers, just mark them as blocked
        if (user.role === 'Recruteur') {
            // Instead of closing offers, just add a blocked flag to each offer
            // We'll keep statut as 'active' but add a temporary field
            await Offre.updateMany(
                { recruteurId: userId, statut: 'active' },
                { 
                    $set: { 
                        recruiterBlocked: true  // Add this temporary field
                    }
                }
            );
            
            // Cancel pending applications and interviews (but keep the offers)
            const recruiterOffers = await Offre.find({ recruteurId: userId });
            for (const offre of recruiterOffers) {
                let modified = false;
                for (const candidature of offre.candidatures) {
                    if (candidature.statut === 'en attente') {
                        candidature.statut = 'refusée';
                        candidature.commentaire = `Candidature annulée car le compte recruteur a été bloqué.`;
                        modified = true;
                    }
                    if (candidature.etapeEntretien && candidature.etapeEntretien !== 'termine') {
                        candidature.etapeEntretien = 'termine';
                        candidature.commentaireEntretien = `Entretien annulé - compte recruteur bloqué.`;
                        modified = true;
                    }
                }
                if (modified) {
                    await offre.save();
                }
            }
        }
        
        if (user.role === 'Etudiant') {
            // Cancel all pending applications and interviews for this student
            const offers = await Offre.find({ "candidatures.etudiantId": userId });
            for (const offre of offers) {
                let modified = false;
                for (const candidature of offre.candidatures) {
                    if (candidature.etudiantId.toString() === userId.toString()) {
                        if (candidature.statut === 'en attente') {
                            candidature.statut = 'refusée';
                            candidature.commentaire = `Candidature annulée car votre compte a été bloqué. Contactez l'administrateur.`;
                            modified = true;
                        }
                        if (candidature.etapeEntretien && candidature.etapeEntretien !== 'termine') {
                            candidature.etapeEntretien = 'termine';
                            candidature.commentaireEntretien = `Entretien annulé - compte bloqué.`;
                            modified = true;
                        }
                    }
                }
                if (modified) {
                    await offre.save();
                }
            }
        }
        
        res.json({
            message: `Utilisateur ${user.prenom} ${user.nom} bloqué avec succès`,
            user: {
                id: user._id,
                isBlocked: user.isBlocked,
                blockedAt: user.blockedAt,
                blockedReason: user.blockedReason
            }
        });
        
    } catch (err) {
        console.error("Error blocking user:", err);
        res.status(500).json({ error: err.message });
    }
});

// Unblock user
// Unblock user and restore their offers
app.put("/admin/users/:userId/unblock", async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        user.isBlocked = false;
        user.blockedAt = null;
        user.blockedReason = null;
        await user.save();
        
        // For Recruiters: Remove the blocked flag from offers
        if (user.role === 'Recruteur') {
            await Offre.updateMany(
                { recruteurId: userId },
                { 
                    $unset: { recruiterBlocked: "" }  // Remove the temporary blocked flag
                }
            );
            // Note: Offers remain active with statut: 'active'
        }
        
        res.json({
            message: `Utilisateur ${user.prenom} ${user.nom} débloqué avec succès. Les offres sont de nouveau disponibles.`,
            user: {
                id: user._id,
                isBlocked: user.isBlocked
            }
        });
        
    } catch (err) {
        console.error("Error unblocking user:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get user statistics for admin dashboard
app.get("/admin/stats", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'Etudiant' });
        const totalRecruiters = await User.countDocuments({ role: 'Recruteur' });
        const blockedUsers = await User.countDocuments({ isBlocked: true });
        
        const totalOffers = await Offre.countDocuments();
        const activeOffers = await Offre.countDocuments({ statut: 'active' });
        
        let totalApplications = 0;
        const allOffers = await Offre.find();
        allOffers.forEach(offre => {
            totalApplications += offre.candidatures?.length || 0;
        });
        
        const recentUsers = await User.find()
            .sort({ dateCreation: -1 })
            .limit(5)
            .select('prenom nom email role dateCreation');
        
        res.json({
            users: {
                total: totalUsers,
                students: totalStudents,
                recruiters: totalRecruiters,
                blocked: blockedUsers
            },
            offers: {
                total: totalOffers,
                active: activeOffers
            },
            applications: {
                total: totalApplications
            },
            recentUsers
        });
        
    } catch (err) {
        console.error("Error fetching admin stats:", err);
        res.status(500).json({ error: err.message });
    }
});

// Check if user is blocked (middleware to be used in other endpoints)
const checkUserBlocked = async (req, res, next) => {
    try {
        const userId = req.body.userId || req.params.userId || req.query.userId;
        
        if (userId) {
            const user = await User.findById(userId);
            if (user && user.isBlocked) {
                return res.status(403).json({ 
                    error: "Votre compte a été bloqué. Veuillez contacter l'administrateur.",
                    isBlocked: true
                });
            }
        }
        next();
    } catch (err) {
        next();
    }
};

// Apply block check to sensitive endpoints (optional - can be added to routes)

app.use("/uploads", express.static("uploads"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});