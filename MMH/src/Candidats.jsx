import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';
import CalendrierEntretien from './CalendrierEntretien.jsx';

function Candidats() {
    const { isDark } = useTheme();
    // SVG Icons
const icons = {
    spinner: (<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>),
    lock: (<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
    users: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:4}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
    robot: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="12" y1="2" x2="12" y2="5"/><circle cx="8" cy="12" r="1"/><circle cx="16" cy="12" r="1"/><path d="M8 16h8"/></svg>),
    person: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
    clock: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
    checkCircle: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
    xCircle: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>),
    clipboard: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>),
    search: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:'absolute',left:15,top:'50%',transform:'translateY(-50%)'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
    chart: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
    mail: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
    calendar: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
    building: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/></svg>),
    mapPin: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
    document: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
    target: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
    eye: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
    trash: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle'}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
    video: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>),
    refresh: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:3}}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>),
    inbox: (<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>),
    thumbsUp: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:4}}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>),
    warning: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:4}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
};
    const [user, setUser] = useState(null);
    const [offres, setOffres] = useState([]);
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedOffre, setSelectedOffre] = useState('all');
    const [selectedStatut, setSelectedStatut] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCandidature, setSelectedCandidature] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [commentaire, setCommentaire] = useState('');
    const [cvLoading, setCvLoading] = useState({});
    const [activeTab, setActiveTab] = useState('toutes');
    const [isAcceptingAll, setIsAcceptingAll] = useState(false);
    const [showAcceptAllModal, setShowAcceptAllModal] = useState(false);
    const [acceptAllComment, setAcceptAllComment] = useState('');
    
    const [isAutoProcessing, setIsAutoProcessing] = useState(false);
    const [showAutoProcessModal, setShowAutoProcessModal] = useState(false);
    const [autoProcessResults, setAutoProcessResults] = useState(null);
    const [autoProcessProgress, setAutoProcessProgress] = useState(0);
    const [showDeployModal, setShowDeployModal] = useState(false);
    const [deployAction, setDeployAction] = useState(null);
    const [deployData, setDeployData] = useState(null);
    const [showSingleDeployModal, setShowSingleDeployModal] = useState(false);
    const [singleDeployCandidature, setSingleDeployCandidature] = useState(null);

    // Theme-aware style helpers
    const textPrimary = isDark ? 'white' : '#0f172a';
    const textSecondary = isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b';
    const textTertiary = isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b';
    const textMuted = isDark ? 'rgba(255, 255, 255, 0.4)' : '#94a3b8';
    const cardBg = isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff';
    const cardBgAlt = isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc';
    const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0';
    const cardShadow = isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.04)';
    const modalBg = isDark ? 'linear-gradient(135deg, #1e1e3f, #2c2c54)' : '#ffffff';
    const modalBorder = isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e2e8f0';
    const modalShadow = isDark ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.1)';
    const inputBg = isDark ? 'rgba(255, 255, 255, 0.06)' : '#f8fafc';
    const inputBorder = isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1';
    const inputColor = isDark ? 'white' : '#1e293b';
    const btnSecondaryBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9';
    const btnSecondaryBorder = isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1';
    const btnSecondaryColor = isDark ? 'rgba(255, 255, 255, 0.7)' : '#475569';
    const sectionBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0';
    const overlayBg = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)';

const [showRecruiterCalendarModal, setShowRecruiterCalendarModal] = useState(false);
const [selectedCandidatureForCreneau, setSelectedCandidatureForCreneau] = useState(null);
const [availableSlots, setAvailableSlots] = useState([]);
const [loadingSlots, setLoadingSlots] = useState(false);

const [customConfirm, setCustomConfirm] = useState({ show: false, message: '', onConfirm: null });

// Fonction pour récupérer les créneaux disponibles du recruteur
const fetchRecruiterSlots = async (recruteurId) => {
    setLoadingSlots(true);
    try {
        const res = await fetch(`https://pfe-backend-five.vercel.app/creneaux/recruteur/${recruteurId}/disponibles`);
        const data = await res.json();
        setAvailableSlots(data.filter(slot => new Date(slot.date) > new Date())); // Filtrer les dates passées
    } catch (err) {
        console.error("Erreur récupération créneaux:", err);
        setMessage("Impossible de charger les créneaux disponibles.");
    } finally {
        setLoadingSlots(false);
    }
};

// Fonction pour créer un créneau (si le recruteur n'en a pas)
// Fonction pour créer un créneau (si le recruteur n'en a pas)
const createRecruiterSlot = async (recruteurId, date, heureDebut, heureFin) => {
    try {
        // Format date properly for backend
        const formattedDate = typeof date === 'string' ? date.split('T')[0] : 
                             date instanceof Date ? date.toISOString().split('T')[0] : date;
        
        console.log('Creating slot with:', { recruteurId, date: formattedDate, heureDebut, heureFin });
        
        const res = await fetch(`https://pfe-backend-five.vercel.app/creneaux/recruteur/${recruteurId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                date: formattedDate, 
                heureDebut: heureDebut, 
                heureFin: heureFin 
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            setAvailableSlots(prev => [...prev, data]);
            setMessage("Créneau créé avec succès !");
            setTimeout(() => setMessage(''), 3000);
            return data;
        } else {
            setMessage("Erreur lors de la création du créneau");
            setTimeout(() => setMessage(''), 4000);
            return null;
        }
    } catch (err) {
        console.error("Erreur création créneau:", err);
        setMessage("Impossible de se connecter au serveur.");
        return null;
    }
};

// Fonction pour assigner un créneau à une candidature (sans attendre l'étudiant)
const planifierEntretien = async (candidatureId, offreId, etudiantId, creneauData) => {
    try {
        const res = await fetch('https://pfe-backend-five.vercel.app/creneaux/planifier-recruteur', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: creneauData.date,
                heureDebut: creneauData.heureDebut,
                heureFin: creneauData.heureFin,
                idRecruteur: user.id,
                idOffre: offreId,
                idCandidature: candidatureId,
                idEtudiant: etudiantId
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            setMessage("Entretien planifié avec succès !");
            setTimeout(() => setMessage(''), 5000);
            fetchRecruiterData(user.id);
            return true;
        } else {
            setMessage("Erreur lors de la planification");
            setTimeout(() => setMessage(''), 4000);
            return false;
        }
    } catch (err) {
        console.error("Erreur:", err);
        setMessage("Impossible de se connecter au serveur.");
        setTimeout(() => setMessage(''), 4000);
        return false;
    }
};

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                if (parsedUser.role === 'Recruteur') {
                    fetchRecruiterData(parsedUser.id);
                }
            } catch (error) {
                console.error("Erreur lors de l'analyse des données utilisateur:", error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);


    // Gestion de la notification éphémère (Toast)
    useEffect(() => {
        // S'il n'y a pas de message, on ne fait rien
        if (!message) return;

        // 1. Faire disparaître le message après 3 secondes (3000 ms)
        const timer = setTimeout(() => {
            setMessage(null);
        }, 3000);

        // 2. Fonction pour fermer au clic
        const closeOnOutsideClick = () => {
            setMessage(null);
        };

        // On attend un tout petit peu (10ms) avant d'écouter les clics, 
        // sinon le clic sur le bouton qui a déclenché le message va le fermer instantanément !
        const clickTimer = setTimeout(() => {
            window.addEventListener('click', closeOnOutsideClick);
        }, 10);

        // Nettoyage de sécurité quand le composant se démonte ou que le message change
        return () => {
            clearTimeout(timer);
            clearTimeout(clickTimer);
            window.removeEventListener('click', closeOnOutsideClick);
        };
    }, [message]);


    const accepterCandidatureDirect = async (offreId, candidatureId, statut, commentaireText) => {
    try {
        const res = await fetch(`https://pfe-backend-five.vercel.app/offres/${offreId}/candidatures/${candidatureId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                statut: statut, 
                commentaire: commentaireText 
            })
        });
        const data = await res.json();

        if (res.ok) {
            setMessage("Candidature mise à jour avec succès.");
            setCandidatures(prevCandidatures =>
                prevCandidatures.map(c =>
                    c._id === candidatureId ? { ...c, statut: statut, commentaire: commentaireText } : c
                )
            );
            setTimeout(() => setMessage(''), 3000);
            return true;
        } else {
            setMessage(data.error || "Erreur lors de la mise à jour.");
            return false;
        }
    } catch (err) {
        console.error("Erreur:", err);
        setMessage("Impossible de se connecter au serveur.");
        return false;
    }
};

    const fetchRecruiterData = async (recruiterId) => {
        try {
            const offresRes = await fetch(`https://pfe-backend-five.vercel.app/offres/recruteur/${recruiterId}`);
            const offresData = await offresRes.json();
            setOffres(offresData);

            const allCandidatures = [];
            
            for (const offre of offresData) {
                if (offre.candidatures && offre.candidatures.length > 0) {
                    for (const candidature of offre.candidatures) {
                        let etudiantInfo = { prenom: 'Inconnu', nom: '', email: '' };
                        try {
                            const etudiantRes = await fetch(`https://pfe-backend-five.vercel.app/users/${candidature.etudiantId}`);
                            if (etudiantRes.ok) {
                                etudiantInfo = await etudiantRes.json();
                            }
                        } catch (err) {
                            console.error("Erreur récupération étudiant:", err);
                        }
                        
                        allCandidatures.push({
                            ...candidature,
                            _id: candidature._id,
                            etudiantInfo: etudiantInfo,
                            offreTitre: offre.titre,
                            offreId: offre._id,
                            offreDescription: offre.description,
                            offreEntreprise: offre.entreprise,
                            offreLocalisation: offre.localisation,
                            offreTypeContrat: offre.typeContrat,
                            offreSalaire: offre.salaire,
                            offreCompetences: offre.competences,
                            offreStatut: offre.statut,
                            offreDateLimite: offre.dateLimite
                        });
                    }
                }
            }
            
            allCandidatures.sort((a, b) => new Date(b.dateCandidature) - new Date(a.dateCandidature));
            
            const candidaturesActives = allCandidatures.filter(c => 
                !['proposition_envoyee', 'embauche_acceptee', 'embauche_refusee'].includes(c.statut)
            );

            setCandidatures(candidaturesActives);
        } catch (err) {
            console.error("Erreur:", err);
            setMessage("Impossible de charger les candidatures.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (offreId, candidatureId, nouveauStatut) => {
    // If trying to accept without going through the calendar flow for real interviews
    if (nouveauStatut === 'acceptée' && !commentaire.trim()) {
        setMessage("Veuillez utiliser le bouton \"Accepter\" dans la carte de candidature pour planifier l'entretien.");
        setTimeout(() => setMessage(''), 4000);
        return;
    }
    
    if (nouveauStatut === 'refusée' && !commentaire.trim()) {
        setMessage("Veuillez ajouter un commentaire avant de refuser.");
        setTimeout(() => setMessage(''), 4000);
        return;
    }
    
    setIsSubmitting(true);
    try {
        const res = await fetch(`https://pfe-backend-five.vercel.app/offres/${offreId}/candidatures/${candidatureId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                statut: nouveauStatut, 
                commentaire: commentaire || `Statut changé à "${nouveauStatut}"`
            })
        });
        const data = await res.json();

        if (res.ok) {
            setMessage("Statut mis à jour avec succès.");
            setCandidatures(prevCandidatures =>
                prevCandidatures.map(c =>
                    c._id === candidatureId ? { ...c, statut: nouveauStatut, commentaire: commentaire } : c
                )
            );
            setShowDetailModal(false);
            setCommentaire('');
            setSelectedCandidature(null);
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(data.error || "Erreur lors de la mise à jour.");
        }
    } catch (err) {
        console.error("Erreur:", err);
        setMessage("Impossible de se connecter au serveur.");
    } finally {
        setIsSubmitting(false);
    }
};

    const deployerInterviewAI = async (candidatureId, offreId, etudiantId) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/interview/deploy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidatureId,
                    offreId,
                    etudiantId
                })
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log(' Interview AI déployée:', data);
                return true;
            } else {
                console.error("Erreur déploiement interview AI");
                return false;
            }
        } catch (err) {
            console.error("Erreur:", err);
            return false;
        }
    };

    const deployerEntretienReel = async (candidatureId, offreId, etudiantId) => {
    console.log('🚀 deployerEntretienReel appelé avec:', { candidatureId, offreId, etudiantId });
    
    try {
        const res = await fetch(`https://pfe-backend-five.vercel.app/entretien/deployer-reel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idCandidature: candidatureId,
                idOffre: offreId,
                idEtudiant: etudiantId,
                idRecruteur: user.id
            })
        });
        
        const data = await res.json();
        console.log('📡 Réponse serveur deployer-reel:', data);
        
        if (res.ok) {
            console.log("Entretien réel activé - étape:", data.etape);
            setMessage("Entretien réel activé ! Choisissez maintenant un créneau.");
            setTimeout(() => setMessage(''), 5000);
            fetchRecruiterData(user.id);
            return true;
        } else {
            console.error('❌ Erreur serveur:', data.error);
            setMessage(data.error || 'Erreur lors de l\'activation');
            return false;
        }
    } catch (err) {
        console.error('❌ Erreur réseau:', err);
        setMessage("Impossible de se connecter au serveur.");
        return false;
    }
};

const handleTerminerEntretienReel = async (offreId, candidatureId) => {
        setCustomConfirm({
        show: true,
        message: "Voulez-vous vraiment terminer cet entretien ? Cette action est irréversible.",
        onConfirm: async () => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/entretien/terminer`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idOffre: offreId, idCandidature: candidatureId })
            });
            if (res.ok) {
                setMessage(<>${icons.checkCircle} Entretien terminé ! Vous pouvez maintenant prendre votre décision finale.</>);
                // Mise à jour immédiate de l'interface sans attendre
                setCandidatures(prevCandidatures => 
                    prevCandidatures.map(c => 
                        c._id === candidatureId ? { ...c, etapeEntretien: 'termine' } : c
                    )
                );
                setTimeout(() => setMessage(''), 4000);
            } else {
                setMessage(" Erreur lors de la clôture.");
            }
        } catch(e) {
            setMessage(" Erreur de connexion au serveur.");
        }
    }
});
};

    const updateCandidatureStatus = async (offreId, candidatureId, statut, commentaire) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/offres/${offreId}/candidatures/${candidatureId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statut, commentaire })
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error(<>   ${icons.xCircle} Erreur mise à jour statut (${res.status}): ${errorText}</>);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }
            
            const data = await res.json();
            console.log("   " + icons.checkCircle + " Statut mis à jour: " + statut);
            return data;
        } catch (err) {
            console.error("   " + icons.xCircle + " Exception mise à jour: " + err);
            throw err;
        }
    };

    const handleAutoProcessManuel = async (deployInterview_ai = true) => {
        setIsAutoProcessing(true);
        setShowAutoProcessModal(true);
        setAutoProcessResults(null);
        setAutoProcessProgress(0);
        
        const manuellesEnAttente = candidaturesManuelles.filter(c => c.statut === 'en attente');
        const total = manuellesEnAttente.length;
        
        console.log(`🚀 Début analyse de ${total} candidatures manuelles`);
        
        const results = {
            total: total,
            acceptees: 0,
            refusees: 0,
            erreurs: 0,
            details: []
        };
        
        for (let i = 0; i < manuellesEnAttente.length; i++) {
            const candidature = manuellesEnAttente[i];
            
            const etudiantId = candidature.etudiantId?._id || candidature.etudiantId?.toString() || candidature.etudiantInfo?._id;
            const candidatureId = candidature._id?.toString() || candidature._id;
            const offreId = candidature.offreId;
            const etudiantName = `${candidature.etudiantInfo?.prenom || 'Inconnu'} ${candidature.etudiantInfo?.nom || ''}`;
            
            console.log(<>${icons.clipboard} [${i+1}/${total}] ${etudiantName} - ${candidature.offreTitre}</>);
            console.log(<>   etudiantId: {etudiantId}</>);
            console.log(<>   candidatureId: {candidatureId}</>);
            console.log(<>   offreId: {offreId}</>);
            
            setAutoProcessProgress(Math.round(((i + 1) / total) * 100));
            
            if (!etudiantId || !candidatureId || !offreId) {
                console.error(" IDs manquants");
                results.erreurs++;
                results.details.push({
                    nom: etudiantName,
                    offre: candidature.offreTitre || 'Inconnue',
                    statut: 'erreur',
                    raison: 'IDs manquants',
                    match: 0
                });
                continue;
            }
            
            try {
                console.log(<>   Vérification CV pour utilisateur: {etudiantId}</>);
                
                const checkUserRes = await fetch(`https://pfe-backend-five.vercel.app/users/${etudiantId}`);
                
                if (!checkUserRes.ok) {
                    console.error(<>   ${icons.xCircle} Utilisateur non trouvé (status: {checkUserRes.status})</>);
                    await updateCandidatureStatus(offreId, candidatureId, 'refusée', 
                        `${icons.xCircle} Refusée automatiquement : Profil étudiant inaccessible.`);
                    results.refusees++;
                    results.details.push({
                        nom: etudiantName,
                        offre: candidature.offreTitre,
                        statut: 'refusée',
                        raison: 'Profil inaccessible',
                        match: 0
                    });
                    continue;
                }
                
                const userData = await checkUserRes.json();
                
                if (!userData.cv || !userData.cv.filename) {
                    console.log(`   ${icons.xCircle} Pas de CV`);
                    await updateCandidatureStatus(offreId, candidatureId, 'refusée', 
                        `${icons.xCircle} Refusée automatiquement : Aucun CV téléchargé.`);
                    results.refusees++;
                    results.details.push({
                        nom: etudiantName,
                        offre: candidature.offreTitre,
                        statut: 'refusée',
                        raison: 'Aucun CV',
                        match: 0
                    });
                    continue;
                }
                
                console.log(`   ${icons.checkCircle} CV trouvé: ${userData.cv.originalName || userData.cv.filename}`);
                console.log(`   Appel API: POST /cv/match/${etudiantId}/${offreId}`);
                
                const matchRes = await fetch(`https://pfe-backend-five.vercel.app/cv/match/${etudiantId}/${offreId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                console.log(`   Status réponse: ${matchRes.status}`);
                
                if (!matchRes.ok) {
                    const errorText = await matchRes.text();
                    console.error(<>   ${icons.xCircle} Erreur API match: ${matchRes.status} - ${errorText}</>);
                    
                    console.log(`   Tentative fallback avec cv-text...`);
                    const cvTextRes = await fetch(`https://pfe-backend-five.vercel.app/cv-text/${etudiantId}`);
                    
                    if (!cvTextRes.ok) {
                        console.error(<>   ${icons.xCircle} Fallback aussi en erreur</>);
                        results.erreurs++;
                        results.details.push({
                            nom: etudiantName,
                            offre: candidature.offreTitre,
                            statut: 'erreur',
                            raison: `Erreur analyse CV (${matchRes.status})`,
                            match: 0
                        });
                        continue;
                    }
                    
                    const cvData = await cvTextRes.json();
                    console.log(`   ${icons.checkCircle} CV texte récupéré (${cvData.length} chars), score par défaut`);
                    
                    const scoreParDefaut = 70;
                    
                    await updateCandidatureStatus(offreId, candidatureId, 'acceptée',
                        `${icons.checkCircle} Acceptée automatiquement. CV analysé avec succès. Score estimé: ${scoreParDefaut}%.`);
                    results.acceptees++;
                    const detail = {
                        nom: etudiantName,
                        offre: candidature.offreTitre,
                        statut: 'acceptée',
                        raison: `CV analysé (score estimé: ${scoreParDefaut}%)`,
                        match: scoreParDefaut
                    };
                    if (deployInterview_ai) {
                        await deployerInterviewAI(candidatureId, offreId, etudiantId);
                        detail.deployed = true;
                    }
                    results.details.push(detail);
                    continue;
                }
                
                const matchData = await matchRes.json();
                console.log(`   ${icons.checkCircle} Résultat match:`, matchData);
                
                const matchPercentage = matchData.matchPercentage || 0;
                const seuilAcceptation = 70;
                
                let nouveauStatut, commentaireText;
                
                if (matchPercentage >= seuilAcceptation) {
                    nouveauStatut = 'acceptée';
                    commentaireText = `${icons.checkCircle} Acceptée automatiquement après analyse IA du CV. Taux de correspondance: ${matchPercentage}%. ` +
                        `Compétences trouvées: ${(matchData.matchedSkills || []).join(', ') || 'Aucune'}. ` +
                        `Compétences manquantes: ${(matchData.missingSkills || []).join(', ') || 'Aucune'}.`;
                    results.acceptees++;
                } else {
                    nouveauStatut = 'refusée';
                    commentaireText = `${icons.xCircle} Refusée automatiquement après analyse IA du CV. Taux de correspondance: ${matchPercentage}% ` +
                        `(seuil minimum: ${seuilAcceptation}%). ` +
                        `Compétences trouvées: ${(matchData.matchedSkills || []).join(', ') || 'Aucune'}. ` +
                        `Compétences manquantes: ${(matchData.missingSkills || []).join(', ') || 'Aucune'}.`;
                    results.refusees++;
                }
                
                console.log(`   Mise à jour statut: ${nouveauStatut}`);
                
                await updateCandidatureStatus(offreId, candidatureId, nouveauStatut, commentaireText);
                
                const detailItem = {
                    nom: etudiantName,
                    offre: candidature.offreTitre,
                    statut: nouveauStatut,
                    raison: matchPercentage >= seuilAcceptation 
                        ? `Correspondance ${matchPercentage}%` 
                        : `Correspondance insuffisante (${matchPercentage}% < ${seuilAcceptation}%)`,
                    match: matchPercentage,
                    skillsFound: matchData.matchedSkills || [],
                    skillsMissing: matchData.missingSkills || []
                };
                if (nouveauStatut === 'acceptée' && deployInterview_ai) {
                    await deployerInterviewAI(candidatureId, offreId, etudiantId);
                    detailItem.deployed = true;
                }
                results.details.push(detailItem);
            } catch (err) {
                console.error(`   ${icons.xCircle} Exception:`, err);
                results.erreurs++;
                results.details.push({
                    nom: etudiantName,
                    offre: candidature.offreTitre || 'Inconnue',
                    statut: 'erreur',
                    raison: `Exception: ${err.message}`,
                    match: 0
                });
            }
        }
        
        console.log(`\n${icons.chart} RÉSULTATS FINAUX:`, results);
        console.log(`   Acceptées: ${results.acceptees}`);
        console.log(`   Refusées: ${results.refusees}`);
        console.log(`   Erreurs: ${results.erreurs}`);
        
        setAutoProcessResults(results);
        setIsAutoProcessing(false);
        
        setTimeout(() => {
            fetchRecruiterData(user.id);
        }, 1500);
    };

    const handleAcceptAllAI = async (deployInterview_ai) => {
        setIsAcceptingAll(true);
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/offres/accept-all-ai/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    commentaire: acceptAllComment || 'Acceptée automatiquement - Décision IA',
                    deployInterview: deployInterview_ai
                })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(" " + icons.checkCircle + " " + data.totalAccepted + " candidature(s) AI acceptée(s) avec succès!");
                
                if (deployInterview_ai && data.acceptedIds) {
                    for (const item of data.acceptedIds) {
                        await deployerInterviewAI(item.candidatureId, item.offreId, item.etudiantId);
                    }
                    setMessage(" " + icons.checkCircle + " " + data.totalAccepted + " candidature(s) acceptée(s) et interviews déployées!");
                }
                
                setShowAcceptAllModal(false);
                setAcceptAllComment('');
                fetchRecruiterData(user.id);
                setTimeout(() => setMessage(''), 4000);
            } else {
                setMessage(data.error || "Erreur lors de l'acceptation en masse.");
            }
        } catch (err) {
            console.error("Erreur:", err);
            setMessage(" " + icons.xCircle + " Impossible de se connecter au serveur.");
        } finally {
            setIsAcceptingAll(false);
        }
    };

    const handleDeleteCandidature = async (offreId, candidatureId) => {
        setCustomConfirm({
        show: true,
        message: "Voulez-vous vraiment supprimer cette candidature ? Cette action est irréversible.",
        onConfirm: async () => {

        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/offres/${offreId}/candidatures/${candidatureId}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(" Candidature supprimée avec succès");
                setCandidatures(prevCandidatures =>
                    prevCandidatures.filter(c => c._id !== candidatureId)
                );
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(data.error || "Erreur lors de la suppression.");
            }
        } catch (err) {
            console.error("Erreur:", err);
            setMessage(" Impossible de se connecter au serveur.");
        }
    }
});};

    const handleDownloadCV = async (etudiantId, etudiantName) => {
        setCvLoading(prev => ({ ...prev, [etudiantId]: true }));
        try {
            const checkRes = await fetch(`https://pfe-backend-five.vercel.app/users/${etudiantId}`);
            const userData = await checkRes.json();
            
            if (!userData.cv || !userData.cv.filename) {
                setMessage(" " + icons.xCircle + " " + etudiantName + " n'a pas encore téléchargé de CV.");
                setTimeout(() => setMessage(''), 4000);
                setCvLoading(prev => ({ ...prev, [etudiantId]: false }));
                return;
            }
            
            const response = await fetch(`https://pfe-backend-five.vercel.app/users/${etudiantId}/cv`);
            if (!response.ok) {
                throw new Error('CV non trouvé');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = userData.cv.originalName || `CV_${etudiantName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            setMessage(" " + icons.checkCircle + " CV de " + etudiantName + " téléchargé avec succès.");
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error("Erreur:", err);
            setMessage(" " + icons.xCircle + " Impossible de télécharger le CV de " + etudiantName + ".");
            setTimeout(() => setMessage(''), 4000);
        } finally {
            setCvLoading(prev => ({ ...prev, [etudiantId]: false }));
        }
    };

    const handleOpenDetailModal = (candidature) => {
        setSelectedCandidature(candidature);
        setCommentaire(candidature.commentaire || '');
        setShowDetailModal(true);
    };

    const candidaturesAutomatiques = candidatures.filter(c => c.typeCandidature === 'automatique');
    const candidaturesManuelles = candidatures.filter(c => c.typeCandidature !== 'automatique');

    let candidaturesToFilter;
    switch (activeTab) {
        case 'automatiques':
            candidaturesToFilter = candidaturesAutomatiques;
            break;
        case 'manuelles':
            candidaturesToFilter = candidaturesManuelles;
            break;
        default:
            candidaturesToFilter = candidatures;
    }

    const filteredCandidatures = candidaturesToFilter.filter(c => {
        const matchOffre = selectedOffre === 'all' || c.offreId === selectedOffre;
        const matchStatut = selectedStatut === 'all' || c.statut === selectedStatut;
        const searchLower = searchTerm.toLowerCase();
        const matchSearch = !searchTerm || 
            c.etudiantInfo?.prenom?.toLowerCase().includes(searchLower) ||
            c.etudiantInfo?.nom?.toLowerCase().includes(searchLower) ||
            c.etudiantInfo?.email?.toLowerCase().includes(searchLower) ||
            c.offreTitre?.toLowerCase().includes(searchLower) ||
            c.lettreMotivation?.toLowerCase().includes(searchLower);
        return matchOffre && matchStatut && matchSearch;
    });

    const statsAI = {
        total: candidaturesAutomatiques.length,
        enAttente: candidaturesAutomatiques.filter(c => c.statut === 'en attente').length,
        acceptees: candidaturesAutomatiques.filter(c => c.statut === 'acceptée').length,
        refusees: candidaturesAutomatiques.filter(c => c.statut === 'refusée').length
    };

    const statsManuel = {
        total: candidaturesManuelles.length,
        enAttente: candidaturesManuelles.filter(c => c.statut === 'en attente').length,
        acceptees: candidaturesManuelles.filter(c => c.statut === 'acceptée').length,
        refusees: candidaturesManuelles.filter(c => c.statut === 'refusée').length
    };

    const stats = {
        total: candidatures.length,
        totalAI: candidaturesAutomatiques.length,
        totalManuel: candidaturesManuelles.length,
        enAttente: candidatures.filter(c => c.statut === 'en attente').length,
        acceptees: candidatures.filter(c => c.statut === 'acceptée').length,
        refusees: candidatures.filter(c => c.statut === 'refusée').length,
        avecCV: candidatures.filter(c => c.etudiantInfo?.cv?.filename).length
    };

    const renderStatut = (statut) => {
        let label, color, icon;
        switch (statut) {
            case 'en attente': label = 'En attente'; color = '#f59e0b'; icon = icons.clock; break;
            case 'acceptée': label = 'Acceptée'; color = '#10b981'; icon = icons.checkCircle; break;
            case 'refusée': label = 'Refusée'; color = '#ef4444'; icon = icons.xCircle; break;
            default: label = statut; color = isDark ? 'rgba(255,255,255,0.7)' : '#64748b'; icon = icons.clipboard;
        }
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: `${color}20`,
                color: color,
                border: `1px solid ${color}40`,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold'
            }}>
                {icon} {label}
            </span>
        );
    };

    const renderTypeBadge = (type) => {
        if (type === 'automatique') {
            return (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(108, 99, 255, 0.15)',
                    color: '#6c63ff',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '500',
                    border: '1px solid rgba(108, 99, 255, 0.3)'
                }}>
                    {icons.robot} AI
                </span>
            );
        }
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '500',
                border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
                {icons.user} Manuel
            </span>
        );
    };

    const formatDate = (date) => {
        if (!date) return 'Date inconnue';
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: textPrimary }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>{icons.clock}</div>
                    <p style={{ fontSize: '18px', color: textSecondary }}>Chargement des candidats...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'Recruteur') {
        return (
            <div className="auth-required">
                <div className="auth-card">
                    <span className="lock-icon">{icons.lock}</span>
                    <h2>Accès Restreint</h2>
                    <p>Veuillez vous connecter en tant que recruteur.</p>
                    <Link to="/login">
                        <button style={{
                            marginTop: '20px', padding: '12px 30px',
                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            border: 'none', borderRadius: '8px', color: 'white',
                            cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
                        }}>
                            Aller à la connexion
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const manuellesEnAttenteCount = candidaturesManuelles.filter(c => c.statut === 'en attente').length;


const safeMessageStr = String(message?.props?.children || message);
const isErrorMessage = safeMessageStr.includes('Erreur') || safeMessageStr.includes('Impossible');


    return (
        <div>
            {/* En-tête */}
            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '10px' }}>
                    <div>
                        <h1 style={{ color: textPrimary, fontSize: '32px', marginBottom: '8px', fontWeight: '600' }}>
                            Gestion des Candidats {icons.users}
                        </h1>
                        <p style={{ color: textSecondary, fontSize: '16px' }}>
                            Consultez, filtrez et gérez les candidatures reçues pour vos offres.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {candidaturesAutomatiques.filter(c => c.statut === 'en attente').length > 0 && (
                            <button
                                onClick={() => {
                                    setDeployAction('accept_all_ai');
                                    setDeployData({
                                        count: candidaturesAutomatiques.filter(c => c.statut === 'en attente').length,
                                        type: 'automatiques'
                                    });
                                    setShowDeployModal(true);
                                }}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {icons.robot} Accepter et Déployer AI ({candidaturesAutomatiques.filter(c => c.statut === 'en attente').length})
                            </button>
                        )}
                        
                        {manuellesEnAttenteCount > 0 && (
                            <button
                                onClick={() => {
                                    setDeployAction('analyse_manual');
                                    setDeployData({
                                        count: manuellesEnAttenteCount,
                                        type: 'manuelles'
                                    });
                                    setShowDeployModal(true);
                                }}
                                disabled={isAutoProcessing}
                                style={{
                                    padding: '12px 24px',
                                    background: isAutoProcessing 
                                        ? (isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0') 
                                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: isAutoProcessing ? (isDark ? 'rgba(255,255,255,0.5)' : '#94a3b8') : 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: isAutoProcessing ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    whiteSpace: 'nowrap',
                                    opacity: isAutoProcessing ? 0.7 : 1,
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isAutoProcessing ? <>{icons.clock} Analyse en cours...</> : <>{icons.search} Analyser et Déployer ({manuellesEnAttenteCount})</>}
                            </button>
                        )}
                        
                        <Link to="/dashboard/offres">
                            <button style={{
                                padding: '10px 20px',
                                background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff',
                                color: '#6c63ff',
                                border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #c7d2fe',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                {icons.document} Gérer les offres
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Message de retour */}
            {message && (
        <div 
            onClick={() => setMessage(null)} // Un clic n'importe où (même sur la carte) ferme l'alerte
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)', // Fond semi-transparent
                backdropFilter: 'blur(8px)', // Floutage de l'arrière-plan
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}
        >
            {/* Injection des animations CSS en direct */}
            <style>
            {`
                .animate-pop { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                
                .svg-icon { width: 80px; height: 80px; stroke-width: 3; stroke-miterlimit: 10; margin: 0 auto 20px; display: block; }
                .svg-circle { stroke-dasharray: 166; stroke-dashoffset: 166; fill: none; animation: drawStroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
                .svg-check { stroke-dasharray: 48; stroke-dashoffset: 48; animation: drawStroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards; }
                .svg-cross { stroke-dasharray: 48; stroke-dashoffset: 48; animation: drawStroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards; }
                
                @keyframes drawStroke { 100% { stroke-dashoffset: 0; } }
            `}
            </style>

            {/* La Carte Blanche */}
            <div 
                className="animate-pop"
                style={{
                    background: '#ffffff', // Blanc pur pour faire ressortir l'icône
                    padding: '40px 50px',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '90%'
                }}
            >
                {/* L'icône SVG Animée (Succès ou Erreur) */}
                {isErrorMessage ? (
                    <svg className="svg-icon" style={{ stroke: '#ef4444' }} viewBox="0 0 52 52">
                        <circle className="svg-circle" cx="26" cy="26" r="25" />
                        <path className="svg-cross" fill="none" strokeLinecap="round" d="M16,16 L36,36 M36,16 L16,36" />
                    </svg>
                ) : (
                    <svg className="svg-icon" style={{ stroke: '#10b981' }} viewBox="0 0 52 52">
                        <circle className="svg-circle" cx="26" cy="26" r="25" />
                        <path className="svg-check" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                )}
                
                {/* Titre Succès / Erreur */}
                <h3 style={{ 
                    margin: '0 0 10px 0', 
                    color: isErrorMessage ? '#ef4444' : '#10b981',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    {isErrorMessage ? 'Erreur' : 'Succès !'}
                </h3>
                
                {/* Le message exact */}
                <p style={{ 
                    color: '#64748b', 
                    fontSize: '16px', 
                    margin: '0',
                    lineHeight: '1.5'
                }}>
                    {safeMessageStr}
                </p>
            </div>
        </div>
    )}

            {/* Onglets */}
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '25px',
                borderBottom: sectionBorder,
                paddingBottom: '15px',
                flexWrap: 'wrap'
            }}>
                <button onClick={() => setActiveTab('toutes')} style={{
                    padding: '10px 24px', borderRadius: '10px',
                    border: activeTab === 'toutes' ? '2px solid #6c63ff' : (isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1'),
                    background: activeTab === 'toutes' ? (isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff') : 'transparent',
                    color: activeTab === 'toutes' ? '#6c63ff' : (isDark ? 'rgba(255,255,255,0.7)' : '#64748b'),
                    cursor: 'pointer', fontSize: '14px',
                    fontWeight: activeTab === 'toutes' ? 'bold' : 'normal',
                    transition: 'all 0.3s'
                }}>
                    {icons.clipboard} Toutes ({candidatures.length})
                </button>
                <button onClick={() => setActiveTab('automatiques')} style={{
                    padding: '10px 24px', borderRadius: '10px',
                    border: activeTab === 'automatiques' ? '2px solid #6c63ff' : (isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1'),
                    background: activeTab === 'automatiques' ? (isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff') : 'transparent',
                    color: activeTab === 'automatiques' ? '#6c63ff' : (isDark ? 'rgba(255,255,255,0.7)' : '#64748b'),
                    cursor: 'pointer', fontSize: '14px',
                    fontWeight: activeTab === 'automatiques' ? 'bold' : 'normal',
                    transition: 'all 0.3s'
                }}>
                    {icons.robot} Candidatures IA ({candidaturesAutomatiques.length})
                </button>
                <button onClick={() => setActiveTab('manuelles')} style={{
                    padding: '10px 24px', borderRadius: '10px',
                    border: activeTab === 'manuelles' ? '2px solid #f59e0b' : (isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1'),
                    background: activeTab === 'manuelles' ? (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb') : 'transparent',
                    color: activeTab === 'manuelles' ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.7)' : '#64748b'),
                    cursor: 'pointer', fontSize: '14px',
                    fontWeight: activeTab === 'manuelles' ? 'bold' : 'normal',
                    transition: 'all 0.3s'
                }}>
                    {icons.person} Manuelles ({candidaturesManuelles.length})
                </button>
            </div>

            {/* Stats AI */}
            {activeTab === 'automatiques' && (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '12px', 
                    marginBottom: '20px'
                }}>
                    <div style={{ background: isDark ? 'rgba(108, 99, 255, 0.08)' : '#f5f3ff', border: isDark ? '1px solid rgba(108, 99, 255, 0.2)' : '1px solid #ddd6fe', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: textPrimary }}>{statsAI.total}</div>
                        <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.robot} Total AI</div>
                    </div>
                    <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb', border: isDark ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid #fde68a', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{statsAI.enAttente}</div>
                        <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.clock} En attente</div>
                    </div>
                    <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4', border: isDark ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #bbf7d0', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{statsAI.acceptees}</div>
                        <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.checkCircle} Acceptées</div>
                    </div>
                </div>
            )}

            {/* Stats Manuelles */}
            {activeTab === 'manuelles' && (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '12px', 
                    marginBottom: '20px'
                }}>
                    <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb', border: isDark ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid #fde68a', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: textPrimary }}>{statsManuel.total}</div>
                        <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.user} Total Manuel</div>
                    </div>
                    <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb', border: isDark ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid #fde68a', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{statsManuel.enAttente}</div>
                        <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.clock} En attente</div>
                    </div>
                    <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4', border: isDark ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #bbf7d0', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{statsManuel.acceptees}</div>
                        <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.checkCircle} Acceptées</div>
                    </div>
                    <div style={{ background: isDark ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2', border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #fecaca', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{statsManuel.refusees}</div>
                        <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.xCircle} Refusées</div>
                    </div>
                </div>
            )}

            {/* Stats générales */}
            {activeTab === 'toutes' && (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '15px', 
                    marginBottom: '25px'
                }}>
                    <div style={{ background: cardBg, backdropFilter: isDark ? 'blur(10px)' : 'none', border: cardBorder, borderRadius: '14px', padding: '18px', textAlign: 'center', boxShadow: cardShadow }}>
                        <div style={{ fontSize: '30px', fontWeight: 'bold', color: textPrimary, marginBottom: '5px' }}>{stats.total}</div>
                        <div style={{ color: textTertiary, fontSize: '12px' }}>{icons.clipboard} Total</div>
                    </div>
                    <div style={{ background: cardBg, backdropFilter: isDark ? 'blur(10px)' : 'none', border: cardBorder, borderRadius: '14px', padding: '18px', textAlign: 'center', boxShadow: cardShadow }}>
                        <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '5px' }}>{stats.enAttente}</div>
                        <div style={{ color: textTertiary, fontSize: '12px' }}>{icons.clock} En attente</div>
                    </div>
                    <div style={{ background: cardBg, backdropFilter: isDark ? 'blur(10px)' : 'none', border: cardBorder, borderRadius: '14px', padding: '18px', textAlign: 'center', boxShadow: cardShadow }}>
                        <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#10b981', marginBottom: '5px' }}>{stats.acceptees}</div>
                        <div style={{ color: textTertiary, fontSize: '12px' }}>{icons.checkCircle} Acceptées</div>
                    </div>
                    <div style={{ background: cardBg, backdropFilter: isDark ? 'blur(10px)' : 'none', border: cardBorder, borderRadius: '14px', padding: '18px', textAlign: 'center', boxShadow: cardShadow }}>
                        <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#ef4444', marginBottom: '5px' }}>{stats.refusees}</div>
                        <div style={{ color: textTertiary, fontSize: '12px' }}>{icons.xCircle} Refusées</div>
                    </div>
                </div>
            )}

            {/* Barre de filtres */}
            <div style={{
                background: cardBg,
                backdropFilter: isDark ? 'blur(10px)' : 'none',
                border: cardBorder,
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '25px',
                boxShadow: cardShadow
            }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 250px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0px', top: '50%', transform: 'translateY(-50%)', color: textMuted, fontSize: '16px' }}>{icons.search}</span>
                        <input type="text" placeholder="Rechercher par nom, email, offre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 15px 10px 40px', borderRadius: '10px', background: inputBg, border: inputBorder, color: inputColor, fontSize: '14px', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ color: textSecondary, fontSize: '13px', whiteSpace: 'nowrap' }}>Statut :</label>
                        <select value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}
                            style={{ padding: '10px 15px', borderRadius: '10px', background: inputBg, border: inputBorder, color: inputColor, fontSize: '13px', cursor: 'pointer', minWidth: '150px' }}>
                            <option value="all" style={{ background: isDark ? '#2c2c54' : '#ffffff', color: inputColor }}>{icons.chart} Tous</option>
                            <option value="en attente" style={{ background: isDark ? '#2c2c54' : '#ffffff', color: '#f59e0b' }}>{icons.clock} En attente</option>
                            <option value="acceptée" style={{ background: isDark ? '#2c2c54' : '#ffffff', color: '#10b981' }}>{icons.checkCircle} Acceptées</option>
                            <option value="refusée" style={{ background: isDark ? '#2c2c54' : '#ffffff', color: '#ef4444' }}>{icons.xCircle} Refusées</option>
                        </select>
                    </div>
                    {(selectedStatut !== 'all' || searchTerm) && (
                        <button onClick={() => { setSelectedStatut('all'); setSearchTerm(''); }}
                            style={{ padding: '10px 20px', background: btnSecondaryBg, color: btnSecondaryColor, border: btnSecondaryBorder, borderRadius: '10px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                            {icons.refresh} Réinitialiser
                        </button>
                    )}
                </div>
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: sectionBorder, color: textTertiary, fontSize: '13px' }}>
                    {filteredCandidatures.length} candidature{filteredCandidatures.length > 1 ? 's' : ''} trouvée{filteredCandidatures.length > 1 ? 's' : ''}
                </div>
            </div>

            {/* Liste des candidatures */}
            {filteredCandidatures.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: cardBgAlt, borderRadius: '16px', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0' }}>
       
            <p style={{ fontSize: '18px', color: textSecondary, marginBottom: '10px' }}>
            Aucune candidature {activeTab === 'automatiques' ? 'automatique' : activeTab === 'manuelles' ? 'manuelle' : ''} trouvée
            </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '18px' }}>
                    {filteredCandidatures.map((candidature) => (
                        <div key={candidature._id} style={{
                            background: candidature.typeCandidature === 'automatique' 
                                ? (isDark ? 'rgba(108, 99, 255, 0.04)' : '#f5f3ff')
                                : cardBg,
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: candidature.typeCandidature === 'automatique' 
                                ? (isDark ? '1px solid rgba(108, 99, 255, 0.2)' : '1px solid #ddd6fe')
                                : cardBorder,
                            borderRadius: '16px', padding: '22px', transition: 'all 0.3s ease',
                            boxShadow: cardShadow
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.4)'; e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = candidature.typeCandidature === 'automatique' ? (isDark ? 'rgba(108, 99, 255, 0.2)' : '#ddd6fe') : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'); e.currentTarget.style.boxShadow = isDark ? 'none' : cardShadow; }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                                <div style={{ flex: '2', minWidth: '250px', display: 'flex', gap: '15px' }}>
                                    <div style={{
                                        width: '55px', height: '55px', minWidth: '55px',
                                        background: candidature.typeCandidature === 'automatique' ? 'linear-gradient(135deg, #6c63ff, #4834d4)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '22px', fontWeight: 'bold', color: 'white'
                                    }}>
                                        {candidature.typeCandidature === 'automatique' ? icons.robot : icons.user}
                                    </div>
                                    <div>
                                        <h3 style={{ color: textPrimary, fontSize: '18px', marginBottom: '4px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {candidature.etudiantInfo?.prenom || 'Prénom'} {candidature.etudiantInfo?.nom || 'Nom'}
                                            {renderTypeBadge(candidature.typeCandidature)}
                                        </h3>
                                        <p style={{ color: '#6c63ff', fontSize: '13px', marginBottom: '6px' }}>
                                            {icons.email} {candidature.etudiantInfo?.email || 'Email inconnu'}
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span style={{ background: isDark ? 'rgba(108, 99, 255, 0.15)' : '#eef2ff', color: '#6c63ff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px' }}>
                                                {icons.clipboard} {candidature.offreTitre}
                                            </span>
                                            {candidature.scoreAuto && (
                                                <span style={{ background: candidature.scoreAuto >= 80 ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4') : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb'), color: candidature.scoreAuto >= 80 ? '#10b981' : '#f59e0b', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '500' }}>
                                                    {icons.target} Match: {candidature.scoreAuto}%
                                                </span>
                                            )}
                                            {candidature.scoreEntretien !== undefined && candidature.scoreEntretien !== null && (
                                                <span style={{ background: candidature.scoreEntretien >= 70 ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4') : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'), color: candidature.scoreEntretien >= 70 ? '#10b981' : '#ef4444', padding: '4px 10px', borderRadius: '8px', fontSize: '11px' }}>
                                                    {icons.document} Score: {candidature.scoreEntretien}/100
                                                </span>
                                            )}
                                            <span style={{ color: textMuted, fontSize: '11px' }}>
                                                {icons.calendar} {formatDate(candidature.dateCandidature)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                    {renderStatut(candidature.statut)}
                                    
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                        <button onClick={() => handleOpenDetailModal(candidature)}
                                            style={{ padding: '8px 14px', background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff', color: '#6c63ff', border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #c7d2fe', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                                            {icons.eye} Détails
                                        </button>

                                        {/* Actions pendant la Visio */}
                                        {candidature.interviewType === 'reel' && candidature.etapeEntretien === 'visio_en_cours' && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {candidature.lienVisio ? (
                                                    <button onClick={(e) => { e.stopPropagation(); window.open(candidature.lienVisio, '_blank'); }}
                                                        style={{ padding: '8px 14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', animation: 'pulse 2s infinite' }}>
                                                        {icons.video} Rejoindre
                                                    </button>
                                                ) : (
                                                    <button onClick={async (e) => { e.stopPropagation(); /* Votre logique générer lien */ }}
                                                        style={{ padding: '8px 14px', background: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fffbeb', color: '#f59e0b', border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #fde68a', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                                        {icons.refresh} Générer lien
                                                    </button>
                                                )}
                                                
                                                <button onClick={(e) => { e.stopPropagation(); handleTerminerEntretienReel(candidature.offreId, candidature._id); }}
                                                    style={{ padding: '8px 14px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    {icons.xCircle} Terminer la visio
                                                </button>
                                            </div>
                                        )}

                                        {/* Actions APRÈS la Visio (Décision Finale) */}
                                        {candidature.interviewType === 'reel' && candidature.etapeEntretien === 'termine' && candidature.statut === 'acceptée' && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(candidature.offreId, candidature._id, 'embauché'); }}
                                                    style={{ padding: '8px 14px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4', color: '#10b981', border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                                                    {icons.checkCircle} Embaucher
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(candidature.offreId, candidature._id, 'refusée_final'); }}
                                                    style={{ padding: '8px 14px', background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2', color: '#ef4444', border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                                                    {icons.xCircle} Refuser
                                                </button>
                                            </div>
                                        )}
    
                                        {candidature.interviewType === 'reel' && candidature.creneauChoisi && !candidature.lienVisio && (
                                            <span style={{ padding: '8px 12px', background: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb', color: '#f59e0b', border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #fde68a', borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                {icons.calendar} {new Date(candidature.creneauChoisi.date).toLocaleDateString('fr-FR')} à {candidature.creneauChoisi.heureDebut}
                                            </span>
                                        )}

                                        {candidature.statut === 'en attente' && (
                                            <>
                                                <button
                                                    onClick={() => { setSingleDeployCandidature({ ...candidature, action: 'accept' }); setShowSingleDeployModal(true); }}
                                                    style={{ padding: '8px 14px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4', color: '#10b981', border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                                                    {icons.checkCircle} Accepter
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(candidature.offreId, candidature._id, 'refusée')}
                                                    style={{ padding: '8px 14px', background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2', color: '#ef4444', border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                                                    {icons.xCircle} Refuser
                                                </button>
                                            </>
                                        )}

                                        <button onClick={() => handleDeleteCandidature(candidature.offreId, candidature._id)}
                                            style={{ padding: '8px 14px', background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9', color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#94a3b8', border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                                            {icons.trash} Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal "Tout Accepter AI" */}
            {showAcceptAllModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: modalBg, border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #ddd6fe', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: modalShadow }}>
                        <div style={{ padding: '25px 30px', borderBottom: sectionBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ color: textPrimary, fontSize: '20px', margin: 0 }}>{icons.robot} Accepter toutes les candidatures AI</h2>
                            <button onClick={() => setShowAcceptAllModal(false)} style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', border: 'none', color: textPrimary, width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <p style={{ color: textSecondary, marginBottom: '20px', lineHeight: '1.6' }}>
                                Vous allez accepter <strong style={{ color: '#6c63ff' }}>{candidaturesAutomatiques.filter(c => c.statut === 'en attente').length}</strong> candidature(s) automatique(s) en attente.
                            </p>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: textSecondary, fontSize: '13px', marginBottom: '8px' }}>Commentaire (optionnel) :</label>
                                <textarea value={acceptAllComment} onChange={(e) => setAcceptAllComment(e.target.value)} placeholder="Ajoutez un commentaire pour les étudiants..." rows="3"
                                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', background: inputBg, border: inputBorder, color: inputColor, fontSize: '13px', resize: 'vertical', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleAcceptAllAI} disabled={isAcceptingAll}
                                    style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '10px', cursor: isAcceptingAll ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold', opacity: isAcceptingAll ? 0.7 : 1 }}>
                                    {isAcceptingAll ? <>{icons.clock} Traitement...</> : <>{icons.checkCircle} Confirmer</>}
                                </button>
                                <button onClick={() => setShowAcceptAllModal(false)}
                                    style={{ padding: '14px 20px', background: btnSecondaryBg, color: btnSecondaryColor, border: btnSecondaryBorder, borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de progression de l'analyse automatique */}
            {showAutoProcessModal && isAutoProcessing && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: modalBg, border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #fde68a', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center', boxShadow: modalShadow }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>{icons.search}</div>
                        <h2 style={{ color: textPrimary, fontSize: '22px', marginBottom: '10px' }}>Analyse en cours...</h2>
                        <p style={{ color: textSecondary, fontSize: '14px', marginBottom: '25px' }}>
                            Analyse des CV et traitement des candidatures manuelles
                        </p>
                        <div style={{ width: '100%', height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                            <div style={{ width: `${autoProcessProgress}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                        </div>
                        <p style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 'bold' }}>{autoProcessProgress}%</p>
                    </div>
                </div>
            )}

            {/* Modal des résultats de l'analyse automatique */}
            {showAutoProcessModal && !isAutoProcessing && autoProcessResults && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: modalBg, border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #fde68a', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto', boxShadow: modalShadow }}>
                        <div style={{ padding: '25px 30px', borderBottom: sectionBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: modalBg, borderRadius: '20px 20px 0 0', zIndex: 1 }}>
                            <h2 style={{ color: textPrimary, fontSize: '22px', margin: 0 }}>{icons.chart} Résultats de l'analyse automatique</h2>
                            <button onClick={() => { setShowAutoProcessModal(false); setAutoProcessResults(null); }} style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', border: 'none', color: textPrimary, width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '25px' }}>
                                <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: textPrimary }}>{autoProcessResults.total}</div>
                                    <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.clipboard} Total</div>
                                </div>
                                <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{autoProcessResults.acceptees}</div>
                                    <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.checkCircle} Acceptées</div>
                                </div>
                                <div style={{ background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{autoProcessResults.refusees}</div>
                                    <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.xCircle} Refusées</div>
                                </div>
                                <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{autoProcessResults.erreurs}</div>
                                    <div style={{ color: textTertiary, fontSize: '11px' }}>{icons.warning} Erreurs</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                                {autoProcessResults.details.map((detail, index) => (
                                    <div key={index} style={{
                                        padding: '12px 15px', borderRadius: '10px',
                                        background: detail.statut === 'acceptée' ? (isDark ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4') : detail.statut === 'refusée' ? (isDark ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2') : (isDark ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb'),
                                        border: `1px solid ${detail.statut === 'acceptée' ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#bbf7d0') : detail.statut === 'refusée' ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fecaca') : (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fde68a')}`,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
                                    }}>
                                        <div>
                                            <span style={{ color: textPrimary, fontSize: '14px', fontWeight: '500' }}>{detail.nom}</span>
                                            <span style={{ color: textMuted, fontSize: '12px', marginLeft: '10px' }}>{detail.offre}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {detail.match > 0 && (
                                                <span style={{
                                                    background: detail.match >= 60 ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4') : (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2'),
                                                    color: detail.match >= 60 ? '#10b981' : '#ef4444',
                                                    padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
                                                }}>
                                                    {detail.match}%
                                                </span>
                                            )}
                                            <span style={{
                                                background: detail.statut === 'acceptée' ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4') : detail.statut === 'refusée' ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2') : (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fffbeb'),
                                                color: detail.statut === 'acceptée' ? '#10b981' : detail.statut === 'refusée' ? '#ef4444' : '#f59e0b',
                                                padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
                                            }}>
                                                {detail.statut === 'acceptée' ? <>{icons.checkCircle} Acceptée</> : detail.statut === 'refusée' ? <>{icons.xCircle} Refusée</> : <>{icons.warning} Erreur</>}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => { setShowAutoProcessModal(false); setAutoProcessResults(null); }}
                                style={{ width: '100%', padding: '14px', marginTop: '20px', background: 'linear-gradient(135deg, #6c63ff, #4834d4)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                                {icons.thumbsUp} Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de détails */}
            {showDetailModal && selectedCandidature && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: modalBg, border: modalBorder, borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: modalShadow }}>
                        <div style={{ padding: '25px 30px', borderBottom: sectionBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: modalBg, borderRadius: '20px 20px 0 0', zIndex: 1 }}>
                            <h2 style={{ color: textPrimary, fontSize: '22px', margin: 0 }}>
                                {icons.user} Détails de la candidature
                                {selectedCandidature.typeCandidature === 'automatique' && (
                                    <span style={{ marginLeft: '10px', background: 'rgba(108, 99, 255, 0.2)', color: '#6c63ff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>{icons.robot} IA</span>
                                )}
                            </h2>
                            <button onClick={() => { setShowDetailModal(false); setSelectedCandidature(null); setCommentaire(''); }}
                                style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9', border: 'none', color: textPrimary, width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '25px', padding: '20px', background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc', borderRadius: '14px' }}>
                                <div style={{ width: '70px', height: '70px', minWidth: '70px', background: selectedCandidature.typeCandidature === 'automatique' ? 'linear-gradient(135deg, #6c63ff, #4834d4)' : 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                                    {selectedCandidature.typeCandidature === 'automatique' ? icons.robot : (selectedCandidature.etudiantInfo?.prenom?.charAt(0) || '?')}
                                </div>
                                <div>
                                    <h3 style={{ color: textPrimary, fontSize: '20px', marginBottom: '5px' }}>{selectedCandidature.etudiantInfo?.prenom || 'Prénom'} {selectedCandidature.etudiantInfo?.nom || 'Nom'}</h3>
                                    <p style={{ color: textSecondary, fontSize: '14px', marginBottom: '8px' }}>{icons.email} {selectedCandidature.etudiantInfo?.email || 'Email inconnu'}</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {renderTypeBadge(selectedCandidature.typeCandidature)}
                                        {selectedCandidature.scoreAuto && (
                                            <span style={{ background: selectedCandidature.scoreAuto >= 80 ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4') : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb'), color: selectedCandidature.scoreAuto >= 80 ? '#10b981' : '#f59e0b', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '500' }}>
                                                {icons.target} Match IA: {selectedCandidature.scoreAuto}%
                                            </span>
                                        )}
                                        {renderStatut(selectedCandidature.statut)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '20px', background: isDark ? 'rgba(108, 99, 255, 0.08)' : '#f5f3ff', borderRadius: '14px', marginBottom: '20px', border: isDark ? '1px solid rgba(108, 99, 255, 0.15)' : '1px solid #ddd6fe' }}>
                                <h4 style={{ color: '#6c63ff', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase' }}>{icons.clipboard} Offre concernée</h4>
                                <p style={{ color: textPrimary, fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{selectedCandidature.offreTitre}</p>
                                <p style={{ color: textSecondary, fontSize: '13px', marginBottom: '5px' }}>{icons.building} {selectedCandidature.offreEntreprise} • {icons.mapPin} {selectedCandidature.offreLocalisation}</p>
                                <p style={{ color: textTertiary, fontSize: '12px', margin: 0 }}>{icons.calendar} {formatDate(selectedCandidature.dateCandidature)}</p>
                            </div>

                            {selectedCandidature.lettreMotivation && (
                                <div style={{ padding: '20px', background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc', borderRadius: '14px', marginBottom: '20px', borderLeft: '3px solid #6c63ff' }}>
                                    <h4 style={{ color: '#6c63ff', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase' }}>{icons.document} Lettre de motivation</h4>
                                    <p style={{ color: textSecondary, fontSize: '14px', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>"{selectedCandidature.lettreMotivation}"</p>
                                </div>
                            )}

                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#6c63ff', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase' }}>💬 Commentaire</h4>
                                <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="3"
                                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', background: inputBg, border: inputBorder, color: inputColor, fontSize: '13px', resize: 'vertical', outline: 'none' }} />
                            </div>

                            {selectedCandidature.interviewType && (
                                <div style={{ padding: '20px', background: selectedCandidature.interviewType === 'reel' ? (isDark ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4') : (isDark ? 'rgba(108, 99, 255, 0.08)' : '#f5f3ff'), borderRadius: '14px', marginBottom: '20px', border: `1px solid ${selectedCandidature.interviewType === 'reel' ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#bbf7d0') : (isDark ? 'rgba(108, 99, 255, 0.2)' : '#ddd6fe')}` }}>
                                    <h4 style={{ color: selectedCandidature.interviewType === 'reel' ? '#10b981' : '#6c63ff', fontSize: '14px', marginBottom: '15px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {selectedCandidature.interviewType === 'reel' ? icons.users : icons.robot} Entretien {selectedCandidature.interviewType === 'reel' ? 'Réel' : 'IA'}
                                    </h4>
                                    
                                    {selectedCandidature.interviewType === 'ai' && (
                                        <div>
                                            <div style={{ color: textSecondary, fontSize: '13px', marginBottom: '8px' }}>
                                                Statut: <span style={{ color: selectedCandidature.scoreEntretien ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                                                    {selectedCandidature.scoreEntretien ? <>{icons.checkCircle} Complété</> : <>{icons.clock} En attente</>}
                                                </span>
                                            </div>
                                            {selectedCandidature.scoreEntretien && (
                                                <div style={{ padding: '12px', background: isDark ? 'rgba(108, 99, 255, 0.1)' : '#f5f3ff', borderRadius: '8px', marginTop: '10px' }}>
                                                    <div style={{ color: '#6c63ff', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                                                        Score: {selectedCandidature.scoreEntretien}/100
                                                    </div>
                                                    {selectedCandidature.commentaireEntretien && (
                                                        <p style={{ color: textSecondary, fontSize: '12px', margin: 0 }}>💬 {selectedCandidature.commentaireEntretien}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedCandidature.interviewType === 'reel' && (
                                        <div>
                                            <div style={{ color: textSecondary, fontSize: '13px', marginBottom: '8px' }}>
                                                Étape: <span style={{ color: selectedCandidature.etapeEntretien === 'visio_en_cours' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                                                    {selectedCandidature.etapeEntretien === 'attente_creneau' && <>{icons.clock} En attente du créneau</>}
                                                    {selectedCandidature.etapeEntretien === 'creneau_choisi' && <>{icons.calendar} Créneau choisi</>}
                                                    {selectedCandidature.etapeEntretien === 'visio_en_cours' && <>{icons.video} Visio disponible</>}
                                                    {!selectedCandidature.etapeEntretien && <>{icons.clock} En attente</>}
                                                </span>
                                            </div>
                                            
                                            {selectedCandidature.creneauChoisi && (
                                                <div style={{ padding: '12px', background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4', borderRadius: '8px', marginTop: '10px' }}>
                                                    <div style={{ color: '#10b981', fontSize: '13px', marginBottom: '5px' }}>
                                                        {icons.calendar} {new Date(selectedCandidature.creneauChoisi.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                    <div style={{ color: textSecondary, fontSize: '13px' }}>
                                                        {icons.clock} {selectedCandidature.creneauChoisi.heureDebut} - {selectedCandidature.creneauChoisi.heureFin}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: sectionBorder, paddingTop: '20px' }}>
                                {selectedCandidature.statut === 'en attente' && (
                                    <>
                                        {/* Remplacez ce bouton Accepter dans la modale de détails */}
                            <button 
                                onClick={() => { 
                                setShowDetailModal(false); 
                                setSingleDeployCandidature({ ...selectedCandidature, action: 'accept' });
                                setShowSingleDeployModal(true); 
                                }} 
                                disabled={isSubmitting}
                                style={{ flex: '1', padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold', opacity: isSubmitting ? 0.7 : 1, minWidth: '150px' }}
                                >
                                    {isSubmitting ? <>{icons.clock} Traitement...</> : <>{icons.checkCircle} Accepter</>}
                            </button>
                                        <button onClick={() => handleStatusChange(selectedCandidature.offreId, selectedCandidature._id, 'refusée')} disabled={isSubmitting}
                                            style={{ flex: '1', padding: '14px', background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2', color: '#ef4444', border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold', opacity: isSubmitting ? 0.7 : 1, minWidth: '150px' }}>
                                            {isSubmitting ? <>{icons.clock} Traitement...</> : <>{icons.xCircle} Refuser</>}
                                        </button>
                                    </>
                                )}
                                <button onClick={() => { setShowDetailModal(false); setSelectedCandidature(null); setCommentaire(''); }}
                                    style={{ flex: 1, padding: '14px', background: btnSecondaryBg, color: btnSecondaryColor, border: btnSecondaryBorder, borderRadius: '10px', cursor: 'pointer', fontSize: '14px', minWidth: '150px' }}>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        
            {/* Modal de choix de déploiement */}
            {showDeployModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: modalBg, border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #ddd6fe', borderRadius: '20px', width: '100%', maxWidth: '550px', boxShadow: modalShadow }}>
                        <div style={{ padding: '25px 30px', borderBottom: sectionBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ color: textPrimary, fontSize: '20px', margin: 0 }}>
                                {deployAction === 'accept_all_ai' ? <>{icons.robot} Accepter et Déployer</> : <>{icons.search} Analyser et Déployer</>}
                            </h2>
                            <button onClick={() => setShowDeployModal(false)} style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', border: 'none', color: textPrimary, width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                        </div>
                        
                        <div style={{ padding: '30px' }}>
                            <p style={{ color: textSecondary, marginBottom: '25px', lineHeight: '1.6', fontSize: '15px' }}>
                                Vous allez traiter <strong style={{ color: '#6c63ff' }}>{deployData?.count || 0}</strong> candidature(s) {deployData?.type === 'automatiques' ? 'automatique(s)' : 'manuelle(s)'}.
                            </p>
                            
                            <p style={{ color: textSecondary, marginBottom: '25px', fontSize: '15px', fontWeight: '500' }}>
                                Comment souhaitez-vous procéder ?
                            </p>
                            
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <button
                                    onClick={() => {
                                        setShowDeployModal(false);
                                        if (deployAction === 'accept_all_ai') { handleAcceptAllAI(true); }
                                        else if (deployAction === 'analyse_manual') { handleAutoProcessManuel(true); }
                                    }}
                                    style={{ padding: '18px', background: 'linear-gradient(135deg, #6c63ff, #4834d4)', color: 'white', border: '2px solid rgba(108, 99, 255, 0.5)', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'left', transition: 'all 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icons.robot}</div>
                                    <div style={{ marginBottom: '5px' }}>Accepter et Déployer l'Interview AI</div>
                                    <div style={{ fontSize: '13px', fontWeight: 'normal', color: 'rgba(255,255,255,0.7)' }}>Les candidats passeront d'abord un entretien avec l'IA</div>
                                </button>
                                
                                <button
                                    onClick={() => {
                                        setShowDeployModal(false);
                                        if (deployAction === 'accept_all_ai') { handleAcceptAllAI(false); }
                                        else if (deployAction === 'analyse_manual') { handleAutoProcessManuel(false); }
                                    }}
                                    style={{ padding: '18px', background: isDark ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4', color: '#10b981', border: isDark ? '2px solid rgba(16, 185, 129, 0.3)' : '2px solid #bbf7d0', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'left', transition: 'all 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icons.users}</div>
                                    <div style={{ marginBottom: '5px' }}>Accepter et Passer à l'Interview Réel</div>
                                    <div style={{ fontSize: '13px', fontWeight: 'normal', color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}>Les candidats iront directement en entretien réel</div>
                                </button>
                            </div>
                            
                            <button onClick={() => setShowDeployModal(false)}
                                style={{ width: '100%', padding: '14px', marginTop: '20px', background: btnSecondaryBg, color: btnSecondaryColor, border: btnSecondaryBorder, borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal pour acceptation individuelle */}
            {showSingleDeployModal && singleDeployCandidature && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: modalBg, border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #ddd6fe', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: modalShadow }}>
                        <div style={{ padding: '25px 30px', borderBottom: sectionBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ color: textPrimary, fontSize: '20px', margin: 0 }}>{icons.checkCircle} Accepter la candidature</h2>
                            <button onClick={() => { setShowSingleDeployModal(false); setSingleDeployCandidature(null); }}
                                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', border: 'none', color: textPrimary, width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                        </div>
                        
                        <div style={{ padding: '30px' }}>
                            <p style={{ color: textSecondary, marginBottom: '15px', lineHeight: '1.6' }}>
                                <strong style={{ color: textPrimary }}>{singleDeployCandidature.etudiantInfo?.prenom} {singleDeployCandidature.etudiantInfo?.nom}</strong>
                                <br />
                                <span style={{ color: textTertiary }}>{singleDeployCandidature.offreTitre}</span>
                            </p>
                            
                            <p style={{ color: textSecondary, marginBottom: '20px', fontWeight: '500' }}>Comment souhaitez-vous procéder ?</p>
                            
                            <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                                <button
                                    onClick={async () => {
                                        setShowSingleDeployModal(false);
                                        const etudiantId = singleDeployCandidature.etudiantId?._id || singleDeployCandidature.etudiantId;
                                        await accepterCandidatureDirect(singleDeployCandidature.offreId, singleDeployCandidature._id, 'acceptée'," Acceptée - Entretien AI déployé ");
                                        await deployerInterviewAI(singleDeployCandidature._id, singleDeployCandidature.offreId, etudiantId);
                                        setSingleDeployCandidature(null);
                                        fetchRecruiterData(user.id);
                                    }}
                                    style={{ padding: '16px', background: 'linear-gradient(135deg, #6c63ff, #4834d4)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', textAlign: 'left', transition: 'all 0.3s' }}
                                >
                                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>{icons.robot}</div>
                                    <div>Accepter et Déployer l'Interview AI</div>
                                    <div style={{ fontSize: '12px', fontWeight: 'normal', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>Le candidat passera d'abord un entretien avec l'IA</div>
                                </button>
                                
                                <button
    onClick={async () => {
        // Close the choice modal
        setShowSingleDeployModal(false);
        
        const etudiantId = singleDeployCandidature.etudiantId?._id || 
                          singleDeployCandidature.etudiantId?.toString() || 
                          singleDeployCandidature.etudiantInfo?._id;
        
        console.log('📅 Opening calendar for interview planning');
        
        // Store candidature info for later use
        setSelectedCandidatureForCreneau({
            ...singleDeployCandidature,
            etudiantId: etudiantId
        });
        
        // Open calendar directly
        setShowRecruiterCalendarModal(true);
        setSingleDeployCandidature(null);
    }}
    style={{ 
        padding: '16px', 
        background: isDark ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4', 
        color: '#10b981', 
        border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #bbf7d0', 
        borderRadius: '12px', 
        cursor: 'pointer', 
        fontSize: '15px', 
        fontWeight: 'bold', 
        textAlign: 'left', 
        transition: 'all 0.3s' 
    }}
>
    <div style={{ fontSize: '20px', marginBottom: '5px' }}>{icons.users}</div>
    <div>Accepter et Planifier un Entretien Réel</div>
    <div style={{ fontSize: '12px', fontWeight: 'normal', color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b', marginTop: '5px' }}>
        Vous choisissez directement le créneau pour l'entretien
    </div>
</button>
                            </div>
                            
                            <button onClick={() => { setShowSingleDeployModal(false); setSingleDeployCandidature(null); }}
                                style={{ width: '100%', padding: '12px', background: btnSecondaryBg, color: btnSecondaryColor, border: btnSecondaryBorder, borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                Annuler
                            </button>
                        </div>
                    </div>
                    {/* Modal pour que le recruteur choisisse un créneau */}

                </div>
            )}
   {/* Calendar Modal for Recruiter */}
{/* Calendar Modal for Recruiter */}
{/* Calendar Modal for Recruiter */}
{/* Calendar Modal for Recruiter */}
{/* Calendar Modal for Recruiter */}
{showRecruiterCalendarModal && selectedCandidatureForCreneau && (
    <CalendrierEntretien
        offre={{
            offreTitre: selectedCandidatureForCreneau.offreTitre,
            entreprise: selectedCandidatureForCreneau.offreEntreprise || selectedCandidatureForCreneau.entreprise,
            offreId: selectedCandidatureForCreneau.offreId,
            candidatureId: selectedCandidatureForCreneau._id,
            etudiantId: selectedCandidatureForCreneau.etudiantId,
            etudiantName: `${selectedCandidatureForCreneau.etudiantInfo?.prenom || ''} ${selectedCandidatureForCreneau.etudiantInfo?.nom || ''}`
        }}
        onClose={() => {
            console.log('❌ Calendar cancelled');
            setShowRecruiterCalendarModal(false);
            setSelectedCandidatureForCreneau(null);
        }}
        onConfirm={async (creneau) => {
            console.log('✅ Calendar confirmed:', creneau);
            
            // Close modal immediately
            setShowRecruiterCalendarModal(false);
            
            // FIRST: Accept the candidature with interviewType = 'reel'
            try {
                const acceptRes = await fetch(`https://pfe-backend-five.vercel.app/offres/${selectedCandidatureForCreneau.offreId}/candidatures/${selectedCandidatureForCreneau._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        statut: 'acceptée',
                        commentaire: `Acceptée - Entretien réel planifié le ${creneau.date} à ${creneau.heureDebut}`,
                        interviewType: 'reel',  // CRITICAL: Set to 'reel'
                        etapeEntretien: 'creneau_choisi'
                    })
                });
                
                if (!acceptRes.ok) {
                    console.error('Failed to accept candidature');
                    setMessage('❌ Erreur lors de l\'acceptation');
                    setSelectedCandidatureForCreneau(null);
                    return;
                }
            } catch (err) {
                console.error('Error accepting:', err);
                setMessage('❌ Erreur lors de l\'acceptation');
                setSelectedCandidatureForCreneau(null);
                return;
            }
            
            // SECOND: Plan the interview with the selected slot
            await planifierEntretien(
                selectedCandidatureForCreneau._id,
                selectedCandidatureForCreneau.offreId,
                selectedCandidatureForCreneau.etudiantId,
                {
                    date: creneau.date,
                    heureDebut: creneau.heureDebut,
                    heureFin: creneau.heureFin
                }
            );
            
            setMessage(`✅ Entretien réel planifié avec succès pour le ${creneau.date} à ${creneau.heureDebut}`);
            setTimeout(() => setMessage(''), 5000);
            
            // Refresh data
            fetchRecruiterData(user.id);
            setSelectedCandidatureForCreneau(null);
        }}
        mode="recruteur"
    />
)}
{/* --- MODALE CONFIRMATION PERSONNALISÉE (Style Adawn) --- */}
            {customConfirm.show && (
                <div 
                    onClick={() => setCustomConfirm({ show: false, message: '', onConfirm: null })}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique SUR la carte
                        style={{
                            background: '#ffffff',
                            padding: '40px 50px',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            textAlign: 'center',
                            maxWidth: '400px',
                            width: '90%',
                            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                        }}
                    >
                        {/* Icône animée de question/avertissement */}
                        <svg style={{ width: '80px', height: '80px', margin: '0 auto 20px', display: 'block' }} viewBox="0 0 52 52">
                            <circle cx="26" cy="26" r="25" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="166" strokeDashoffset="0" style={{ animation: 'drawStroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards' }} />
                            <path d="M26 14v12" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                            <circle cx="26" cy="34" r="2" fill="#f59e0b" />
                        </svg>

                        <h3 style={{ margin: '0 0 15px 0', color: '#0f172a', fontSize: '22px', fontWeight: 'bold' }}>
                            Êtes-vous sûr ?
                        </h3>
                        
                        <p style={{ color: '#64748b', fontSize: '16px', margin: '0 0 30px 0', lineHeight: '1.5' }}>
                            {customConfirm.message}
                        </p>
                        
                        {/* Boutons d'action */}
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button 
                                onClick={() => setCustomConfirm({ show: false, message: '', onConfirm: null })}
                                style={{
                                    padding: '12px 24px', borderRadius: '10px', border: 'none',
                                    background: '#f1f5f9', color: '#64748b', fontWeight: 'bold',
                                    cursor: 'pointer', flex: 1, transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
                            >
                                Annuler
                            </button>
                            
                            <button 
                                onClick={() => {
                                    customConfirm.onConfirm(); // Exécute l'action prévue
                                    setCustomConfirm({ show: false, message: '', onConfirm: null }); // Ferme la modale
                                }}
                                style={{
                                    padding: '12px 24px', borderRadius: '10px', border: 'none',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)', // Rouge danger
                                    color: 'white', fontWeight: 'bold', flex: 1,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Oui, continuer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}

export default Candidats;