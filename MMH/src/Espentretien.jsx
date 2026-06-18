// EspEntretien.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';

function EspEntretien() {
    const { isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [acceptedOffers, setAcceptedOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [interviewActive, setInterviewActive] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [message, setMessage] = useState('');
    const [entretiensReels, setEntretiensReels] = useState([]);
    const [showVideoLink, setShowVideoLink] = useState(false);
    const [currentVideoLink, setCurrentVideoLink] = useState('');

    // SVG Icons
    const icons = {
        target: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
        ),
        lock: (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        ),
        users: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        robot: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="12" y1="2" x2="12" y2="5"/>
                <circle cx="8" cy="12" r="1"/>
                <circle cx="16" cy="12" r="1"/>
                <path d="M8 16h8"/>
            </svg>
        ),
        clock: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
        calendar: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        ),
        checkCircle: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        building: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                <line x1="9" y1="6" x2="9" y2="6.01"/>
                <line x1="15" y1="6" x2="15" y2="6.01"/>
                <line x1="9" y1="10" x2="9" y2="10.01"/>
                <line x1="15" y1="10" x2="15" y2="10.01"/>
                <line x1="9" y1="14" x2="9" y2="14.01"/>
                <line x1="15" y1="14" x2="15" y2="14.01"/>
                <path d="M9 18h6v4H9z"/>
            </svg>
        ),
        mapPin: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        ),
        dollar: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
        ),
        document: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
            </svg>
        ),
        inbox: (
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
        ),
        chart: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
        ),
        video: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
        ),
        spinner: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <line x1="12" y1="2" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="6" y2="12"/>
                <line x1="18" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
        ),
        code: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
            </svg>
        ),
        chat: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
        ),
        flame: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
        ),
        userCheck: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <polyline points="17 11 19 13 23 9"/>
            </svg>
        ),
        message: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        ),
        arrowLeft: (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                </svg>
                Retour aux entretiens
            </span>
        ),
        arrowRight: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
            </svg>
        ),
        greenDot: (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#10b981" stroke="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <circle cx="12" cy="12" r="10"/>
            </svg>
        ),
        arrowIndicator: (
            <span style={{ fontSize: '20px', color: 'inherit' }}>→</span>
        ),
        // Add to your icons object:
hourglass: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M6 2h12M6 22h12M12 14c2.5 0 4-1.5 4-4V6H8v4c0 2.5 1.5 4 4 4z"/>
        <path d="M12 10c-2.5 0-4 1.5-4 4v4h8v-4c0-2.5-1.5-4-4-4z"/>
    </svg>
),
bell: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
),
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                if (parsedUser.role === 'Etudiant') {
                    fetchAcceptedOffers(parsedUser.id);
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);


// Add this new function
const isInterviewTime = (offer) => {
    if (!offer.creneauChoisi?.date || !offer.creneauChoisi?.heureDebut) return false;
    
    const now = new Date();
    // Sécurisation : découpage manuel pour éviter le décalage UTC
    const dateStr = offer.creneauChoisi.date.split('T')[0];
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = offer.creneauChoisi.heureDebut.split(':');
    
    const interviewDate = new Date(year, month - 1, day, hours, minutes, 0);
    
    // Allow joining 5 minutes before the interview
    const earlyAccess = new Date(interviewDate.getTime() - 5 * 60000);
    const interviewEnd = new Date(interviewDate.getTime() + 60 * 60000); // 1 hour interview
    
    return now >= earlyAccess && now <= interviewEnd;
};

// Add a function to get time remaining
const getTimeUntilInterview = (offer) => {
    if (!offer.creneauChoisi?.date || !offer.creneauChoisi?.heureDebut) return null;
    
    const now = new Date();
    const dateStr = offer.creneauChoisi.date.split('T')[0];
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = offer.creneauChoisi.heureDebut.split(':');
    
    const interviewDate = new Date(year, month - 1, day, hours, minutes, 0);
    
    const diffMs = interviewDate - now;
    
    if (diffMs <= 0) return 'Maintenant';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) return `dans ${diffDays} j et ${diffHours} h`;
    if (diffHours > 0) return `dans ${diffHours} h et ${diffMinutes} min`;
    if (diffMinutes > 0) return `dans ${diffMinutes} min`;
    return 'Très bientôt';
};

const handleJoinVideo = (lienVisio) => {
    window.open(lienVisio, '_blank');
};

const fetchAcceptedOffers = async (studentId) => {
    try {
        const res = await fetch(`http://localhost:3000/candidatures/etudiant/${studentId}`);
        const candidatures = await res.json();
        
        const accepted = candidatures.filter(c => c.statutCandidature === 'acceptée');
        
        const acceptedWithDetails = await Promise.all(accepted.map(async (candidature) => {
            try {
                const offreRes = await fetch(`http://localhost:3000/offres/${candidature.offreId}`);
                if (offreRes.ok) {
                    const fullOffre = await offreRes.json();
                    
                    console.log("Searching for candidatureId:", candidature.candidatureId);
                    console.log("Type of candidatureId:", typeof candidature.candidatureId);
                    
                    fullOffre.candidatures?.forEach(c => {
                        console.log("Available _id in DB:", c._id.toString(), "Type:", typeof c._id.toString());
                    });
                    
                    const myCandidature = fullOffre.candidatures?.find(
                        c => c._id.toString() === candidature.candidatureId.toString()
                    );
                    
                    if (myCandidature) {
                        console.log("Found! interviewType =", myCandidature.interviewType);
                        return {
                            ...candidature,
                            interviewType: myCandidature.interviewType,
                            etapeEntretien: myCandidature.etapeEntretien,
                            creneauChoisi: myCandidature.creneauChoisi,
                            lienVisio: myCandidature.lienVisio,
                            scoreEntretien: myCandidature.scoreEntretien
                        };
                    } else {
                        console.log("NOT FOUND - myCandidature is undefined");
                    }
                }
            } catch (err) {
                console.error("Error:", err);
            }
            return candidature;
        }));
        
        setAcceptedOffers(acceptedWithDetails);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        setLoading(false);
    }
};

    const handleOpenChat = (offer) => {
    if (offer.scoreEntretien !== undefined && offer.scoreEntretien !== null && offer.scoreEntretien > 0) {
        setSelectedOffer(offer);
        setInterviewActive(false);
        setQuestionCount(0);
        setShowScore(true);
        
        const existingScores = offer.scores || {
            pertinence: 0,
            technique: 0,
            communication: 0,
            motivation: 0,
            professionnalisme: 0
        };
        
        setFinalScore({
            scoreTotal: offer.scoreEntretien,
            scores: existingScores,
            commentaire: offer.commentaireEntretien || "Évaluation déjà complétée"
        });
        
        setChatMessages([{
            type: 'bot',
            message: 'Vous avez déjà complété cet entretien. Voici vos résultats :',
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);
        return;
    }
    
    setSelectedOffer(offer);
    setInterviewActive(true);
    setQuestionCount(0);
    setShowScore(false);
    setFinalScore(null);
    
    const initialMessage = {
        type: 'bot',
        message: `Bonjour, je suis le recruteur de ${offer.entreprise}. Merci de vous présenter à cet entretien pour le poste de "${offer.offreTitre}".\n\nPour commencer, parlez-moi un peu de vous et de votre parcours.`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([initialMessage]);
};

const handleSendMessage = async () => {
    if (!inputMessage.trim() || !interviewActive) return;

    const newUserMessage = {
        type: 'user',
        message: inputMessage,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setInputMessage('');
    
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);

    try {
        if (newQuestionCount >= 6) {
            setInterviewActive(false);
            
            const fullConversation = updatedMessages.map(m => 
                `${m.type === 'bot' ? 'RECRUTEUR' : 'CANDIDAT'}: ${m.message}`
            ).join('\n');
            
            try {
                const scoreRes = await fetch('http://localhost:3000/chat/score-interview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conversation: fullConversation,
                        offreTitre: selectedOffer.offreTitre,
                        entreprise: selectedOffer.entreprise,
                        competences: selectedOffer.competences,
                        offreId: selectedOffer.offreId,
                        candidatureId: selectedOffer.candidatureId
                    })
                });
                
                const scoreData = await scoreRes.json();
                
                const finalScoreData = {
                    scoreTotal: scoreData.scoreTotal || 70,
                    scores: {
                        pertinence: scoreData.scores?.pertinence || 20,
                        technique: scoreData.scores?.technique || 18,
                        communication: scoreData.scores?.communication || 14,
                        motivation: scoreData.scores?.motivation || 10,
                        professionnalisme: scoreData.scores?.professionnalisme || 8
                    },
                    commentaire: scoreData.commentaire || "Évaluation complétée."
                };
                
                setFinalScore(finalScoreData);
                setShowScore(true);
                setSelectedOffer(prev => ({
    ...prev,
    scoreEntretien: finalScoreData.scoreTotal,
    commentaireEntretien: finalScoreData.commentaire,
    scores: finalScoreData.scores
}));

setAcceptedOffers(prev => 
    prev.map(offer => 
        offer.candidatureId === selectedOffer.candidatureId 
            ? {
                ...offer,
                scoreEntretien: finalScoreData.scoreTotal,
                commentaireEntretien: finalScoreData.commentaire,
                scores: finalScoreData.scores
              }
            : offer
    )
);
                try {
                    const saveRes = await fetch(`http://localhost:3000/offres/${selectedOffer.offreId}/candidatures/${selectedOffer.candidatureId}/score`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            scoreEntretien: finalScoreData.scoreTotal,
                            commentaireEntretien: finalScoreData.commentaire,
                            scores: finalScoreData.scores
                        })
                    });
                    
                    if (saveRes.ok) {
                        console.log('✅ Score saved to database successfully');
                    } else {
                        console.error('❌ Failed to save score to database');
                    }
                } catch (saveErr) {
                    console.error('❌ Error saving score:', saveErr);
                }
                
                setChatMessages(prev => [...prev, {
                    type: 'bot',
                    message: `L'entretien est terminé. Merci pour votre temps ! Voici votre évaluation...`,
                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                }]);
            } catch (scoreErr) {
                console.error("Score error:", scoreErr);
                const fallbackScoreData = {
                    scoreTotal: 70,
                    scores: {
                        pertinence: 20,
                        technique: 18,
                        communication: 14,
                        motivation: 10,
                        professionnalisme: 8
                    },
                    commentaire: "L'évaluation sera disponible prochainement."
                };
                
                setFinalScore(fallbackScoreData);
                setShowScore(true);
                
                try {
                    const saveRes = await fetch(`http://localhost:3000/offres/${selectedOffer.offreId}/candidatures/${selectedOffer.candidatureId}/score`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            scoreEntretien: fallbackScoreData.scoreTotal,
                            commentaireEntretien: fallbackScoreData.commentaire,
                            scores: fallbackScoreData.scores
                        })
                    });
                    
                    if (!saveRes.ok) {
                        console.error('❌ Failed to save fallback score');
                    }
                } catch (saveErr) {
                    console.error('❌ Error saving fallback score:', saveErr);
                }
                
                setChatMessages(prev => [...prev, {
                    type: 'bot',
                    message: "L'entretien est terminé. Merci pour votre participation !",
                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        } else {
            const historique = chatMessages.map(m => 
                `${m.type === 'bot' ? 'RECRUTEUR' : 'CANDIDAT'}: ${m.message}`
            ).join('\n');

            const res = await fetch('http://localhost:3000/chat/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputMessage,
                    offreTitre: selectedOffer.offreTitre,
                    entreprise: selectedOffer.entreprise,
                    competences: selectedOffer.competences,
                    typeContrat: selectedOffer.typeContrat,
                    historique: historique
                })
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 429) {
                    setInterviewActive(false);
                    setChatMessages(prev => [...prev, {
                        type: 'bot',
                        message: "Je suis désolé, le service d'entretien est temporairement indisponible. Veuillez réessayer plus tard. L'entretien sera terminé.",
                        time: new Date().toLocaleTimeString('fr-FR')
                    }]);
                    
                    setTimeout(async () => {
                        const quotaFallbackScoreData = {
                            scoreTotal: 75,
                            scores: {
                                pertinence: 22,
                                technique: 19,
                                communication: 15,
                                motivation: 11,
                                professionnalisme: 8
                            },
                            commentaire: "L'évaluation n'a pas pu être complétée en raison d'une limitation technique. Veuillez reprendre l'entretien plus tard."
                        };
                        
                        setFinalScore(quotaFallbackScoreData);
                        setShowScore(true);
                        
                        try {
                            const saveRes = await fetch(`http://localhost:3000/offres/${selectedOffer.offreId}/candidatures/${selectedOffer.candidatureId}/score`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    scoreEntretien: quotaFallbackScoreData.scoreTotal,
                                    commentaireEntretien: quotaFallbackScoreData.commentaire,
                                    scores: quotaFallbackScoreData.scores
                                })
                            });
                            
                            if (saveRes.ok) {
                                console.log('✅ Quota fallback score saved');
                            }
                        } catch (saveErr) {
                            console.error('❌ Error saving quota score:', saveErr);
                        }
                    }, 2000);
                } else {
                    setChatMessages(prev => [...prev, {
                        type: 'bot',
                        message: "Une erreur est survenue. Veuillez réessayer.",
                        time: new Date().toLocaleTimeString('fr-FR')
                    }]);
                }
                return;
            }
            
            const data = await res.json();
            
            setChatMessages(prev => [...prev, {
                type: 'bot',
                message: data.reply || "Pouvez-vous développer votre réponse ?",
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }]);
        }
        
    } catch (err) {
        console.error("Chat error:", err);
        setChatMessages(prev => [...prev, {
            type: 'bot',
            message: "Une erreur est survenue. Veuillez réessayer.",
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);
    }
};

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleBackToList = () => {
        setSelectedOffer(null);
        setChatMessages([]);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                height: '50vh', color: isDark ? 'white' : '#1e293b'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '20px', color: isDark ? 'rgba(255,255,255,0.3)' : '#a39a92' }}>
                        {icons.spinner}
                    </div>
                    Chargement...
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'Etudiant') {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                height: '50vh', color: isDark ? 'white' : '#1e293b'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '50px', color: isDark ? 'rgba(255,255,255,0.2)' : '#a39a92' }}>
                        {icons.lock}
                    </span>
                    <h2>Accès Restreint</h2>
                    <p>Connectez-vous en tant qu'étudiant pour accéder à l'espace entretien.</p>
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


    const safeMessageStr = String(message?.props?.children || message);
const isErrorMessage = safeMessageStr.includes('Erreur') || safeMessageStr.includes('Impossible');

    return (
        <div>
            {!selectedOffer ? (
                <>
                    {/* Header */}
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: '32px', marginBottom: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {icons.target} Espace Entretien
                        </h1>
                        <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b', fontSize: '16px' }}>
                            Préparez vos entretiens avec notre assistant IA pour les offres où votre candidature a été acceptée.
                        </p>
                    </div>
                    {/* Success/Error Messages */}
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

                    {/* Accepted Offers List */}
                    {acceptedOffers.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '80px 20px',
                            background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                            borderRadius: '20px', 
                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{ fontSize: '60px', marginBottom: '20px', color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                {icons.inbox}
                            </div>
                            <h3 style={{ color: isDark ? 'white' : '#0f172a', marginBottom: '10px' }}>Aucun entretien disponible</h3>
                            <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b', marginBottom: '30px' }}>
                                Vous n'avez pas encore de candidatures acceptées. Continuez à postuler !
                            </p>
                            <Link to="/dashboard/offres">
                                <button style={{
                                    padding: '12px 30px',
                                    background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                    color: 'white', border: 'none', borderRadius: '10px',
                                    cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
                                }}>
                                    {icons.document} Voir les offres
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
{acceptedOffers.map((offer) => {
    const isRealInterview = offer.interviewType === 'reel';
    const hasCreneau = offer.creneauChoisi && offer.creneauChoisi.date;
    // 1. Définition des variables de base (on ajoute evaluation_en_cours à isTermine)
    const isTermine = offer.etapeEntretien === 'termine' || offer.statut === 'evaluation_en_cours' || offer.statut === 'embauché' || offer.statut === 'refusée_final';
    const canJoin = isRealInterview && hasCreneau && isInterviewTime(offer) && !isTermine;
    const timeUntil = hasCreneau ? getTimeUntilInterview(offer) : null;

    // 2. Calcul sécurisé de interviewPassed (Une seule déclaration avec "let")
    let interviewPassed = false;
    
    if (isTermine) {
        // Si le recruteur a cliqué sur "Terminer" ou a pris une décision
        interviewPassed = true;
    } 
    else if (hasCreneau && offer.creneauChoisi?.heureDebut) {
        // Sinon, on vérifie l'horloge locale de manière sécurisée (Timeout d'1h)
        const now = new Date();
        const dateStr = offer.creneauChoisi.date.split('T')[0];
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = offer.creneauChoisi.heureDebut.split(':');
        
        const interviewEndTime = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes), 0);
        interviewEndTime.setMinutes(interviewEndTime.getMinutes() + 60); 
        
        interviewPassed = now > interviewEndTime && !canJoin;
    }
    
    return (
        <div
            key={offer.candidatureId}
            style={{
                background: isRealInterview 
                    ? (isDark ? 'rgba(40, 167, 69, 0.08)' : '#f0fdf4')
                    : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff'),
                backdropFilter: isDark ? 'blur(10px)' : 'none',
                border: isRealInterview
                    ? (isDark ? '1px solid rgba(40, 167, 69, 0.2)' : '1px solid #bbf7d0')
                    : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0'),
                borderRadius: '20px',
                padding: '25px',
                transition: 'all 0.3s ease',
                cursor: isRealInterview && canJoin ? 'pointer' : 'default',
                boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                if (isRealInterview && canJoin) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(40, 167, 69, 0.5)';
                }
            }}
            onMouseLeave={(e) => {
                if (isRealInterview && canJoin) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(40, 167, 69, 0.2)' : '#bbf7d0';
                }
            }}
        >
            {/* Live indicator for active interviews */}
            {canJoin && (
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: '#ef4444',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    animation: 'pulse 2s infinite'
                }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        background: 'white',
                        borderRadius: '50%',
                        display: 'inline-block'
                    }} />
                    EN DIRECT
                </div>
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                {/* Left side - Offer info */}
                <div style={{ flex: 2, minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: '20px', margin: 0, fontWeight: '600' }}>
                            {offer.offreTitre}
                        </h3>
                        
                        {/* Interview Type Badge */}
                        <span style={{
                            background: isRealInterview
                                ? 'rgba(40, 167, 69, 0.2)'
                                : 'rgba(108, 99, 255, 0.2)',
                            color: isRealInterview ? '#28a745' : '#6c63ff',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            {isRealInterview ? <>{icons.users} Entretien Réel</> : <>{icons.robot} Entretien IA</>}
                        </span>
                    </div>
                    
                    <p style={{ color: '#6c63ff', fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>{icons.building} {offer.entreprise}</span>
                        <span>{icons.mapPin} {offer.localisation}</span>
                    </p>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <span style={{
                            background: 'rgba(108, 99, 255, 0.2)',
                            color: '#6c63ff',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px'
                        }}>
                            {offer.typeContrat}
                        </span>
                        {offer.salaire && (
                            <span style={{
                                background: 'rgba(40, 167, 69, 0.2)',
                                color: '#28a745',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                {icons.dollar} {offer.salaire}
                            </span>
                        )}
                    </div>

                    {/* Real Interview - Scheduled Date/Time Info */}
                    {isRealInterview && hasCreneau && (
                        <div style={{
                            marginTop: '15px',
                            padding: '15px',
                            background: canJoin 
                                ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(32, 201, 151, 0.2))'
                                : isDark ? 'rgba(108, 99, 255, 0.1)' : '#f5f3ff',
                            borderRadius: '12px',
                            border: canJoin
                                ? '2px solid rgba(40, 167, 69, 0.4)'
                                : isDark ? '1px solid rgba(108, 99, 255, 0.2)' : '1px solid #ddd6fe'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                marginBottom: '8px',
                                color: canJoin ? '#28a745' : '#6c63ff',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                {canJoin ? (
                                    <>{icons.video} L'entretien est en cours !</>
                                ) : interviewPassed ? (
                                    <>{icons.checkCircle} Entretien terminé</>
                                ) : (
                                    <>{icons.calendar} Entretien planifié</>
                                )}
                            </div>
                            
                            <div style={{ color: isDark ? 'white' : '#0f172a', fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
                                {new Date(offer.creneauChoisi.date).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            
                            <div style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{icons.clock} {offer.creneauChoisi.heureDebut} - {offer.creneauChoisi.heureFin}</span>
                                {!canJoin && !interviewPassed && timeUntil && (
                                    <span style={{
                                        background: 'rgba(245, 158, 11, 0.2)',
                                        color: '#f59e0b',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '500'
                                    }}>
                                        {icons.hourglass} {timeUntil}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Real Interview - Waiting for slot to be assigned */}
                    {isRealInterview && !hasCreneau && (
                        <div style={{
                            marginTop: '15px',
                            padding: '15px',
                            background: isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
                            borderRadius: '12px',
                            border: isDark ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid #fde68a'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                color: '#f59e0b',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                marginBottom: '5px'
                            }}>
                                {icons.clock} En attente de planification
                            </div>
                            <p style={{ 
                                color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', 
                                fontSize: '13px', 
                                margin: 0 
                            }}>
                                Le recruteur va bientôt choisir un créneau pour votre entretien. Vous serez notifié dès qu'une date sera fixée.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Right side - Action Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    
                    {/* Real Interview - Unified Join Button */}
                    {isRealInterview && hasCreneau && !interviewPassed && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (canJoin && offer.lienVisio) {
                                    window.open(offer.lienVisio, '_blank');
                                }
                            }}
                            disabled={!canJoin || !offer.lienVisio}
                            style={{
                                padding: '14px 32px',
                                background: (canJoin && offer.lienVisio) 
                                    ? 'linear-gradient(135deg, #28a745, #20c997)'
                                    : (isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'),
                                color: (canJoin && offer.lienVisio) 
                                    ? 'white' 
                                    : (isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8'),
                                border: 'none',
                                borderRadius: '12px',
                                cursor: (canJoin && offer.lienVisio) ? 'pointer' : 'not-allowed',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                transition: 'all 0.3s',
                                boxShadow: (canJoin && offer.lienVisio) ? '0 4px 20px rgba(40, 167, 69, 0.4)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                animation: (canJoin && offer.lienVisio) ? 'pulseButton 2s infinite' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (canJoin && offer.lienVisio) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 30px rgba(40, 167, 69, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (canJoin && offer.lienVisio) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 20px rgba(40, 167, 69, 0.4)';
                                }
                            }}
                        >
                            {canJoin && offer.lienVisio ? icons.video : icons.hourglass}
                            {(canJoin && offer.lienVisio) ? "Rejoindre l'entretien" : `Rejoindre (${timeUntil})`}
                        </button>
                    )}
                    
                    {/* AI Interview - Not started yet */}
                    {(!isRealInterview || offer.interviewType === 'ai') && 
                     !offer.scoreEntretien && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenChat(offer);
                            }}
                            style={{
                                padding: '12px 28px',
                                background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 15px rgba(108, 99, 255, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(108, 99, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(108, 99, 255, 0.3)';
                            }}
                        >
                            {icons.robot} Commencer l'entretien IA
                        </button>
                    )}
                    
                    {/* AI or Real Interview - Completed (has score) */}
                    {offer.scoreEntretien && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenChat(offer);
                            }}
                            style={{
                                padding: '12px 28px',
                                background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff',
                                color: '#6c63ff',
                                border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #c7d2fe',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = isDark ? 'rgba(108, 99, 255, 0.3)' : '#e0e7ff';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff';
                            }}
                        >
                            {icons.chart} Voir les résultats ({offer.scoreEntretien}%)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
})}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Chat Interface */}
                    <div style={{ marginBottom: '20px' }}>
                        <button
                            onClick={handleBackToList}
                            style={{
                                padding: '10px 20px',
                                background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                                color: isDark ? 'white' : '#1e293b', 
                                border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1',
                                borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}
                        >
                            {icons.arrowLeft}
                        </button>
                    </div>

                    {/* Chat Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                        borderRadius: '20px 20px 0 0', padding: '25px',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', flexWrap: 'wrap', gap: '15px'
                        }}>
                            <div>
                                <h2 style={{ color: 'white', fontSize: '22px', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {icons.robot} Assistant Entretien
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '14px' }}>
                                    {selectedOffer.offreTitre} • {selectedOffer.entreprise}
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.2)',
                                padding: '8px 16px', borderRadius: '20px',
                                display: 'flex', alignItems: 'center', gap: '6px'
                            }}>
                                {icons.greenDot}
                                <span style={{ color: 'white', fontSize: '13px' }}>
                                    En ligne
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div style={{
                        background: isDark ? 'rgba(30, 30, 45, 0.95)' : '#f8fafc',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                        borderTop: 'none',
                        height: '450px', overflowY: 'auto',
                        padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px'
                    }}>
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                    animation: 'fadeIn 0.3s ease'
                                }}
                            >
                                {msg.type === 'bot' && (
                                    <div style={{
                                        width: '35px', height: '35px',
                                        background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                        borderRadius: '10px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        marginRight: '10px', flexShrink: 0,
                                        color: 'white'
                                    }}>
                                        {icons.robot}
                                    </div>
                                )}
                                
                                <div style={{
                                    maxWidth: '70%',
                                    background: msg.type === 'user'
                                        ? 'linear-gradient(135deg, #6c63ff, #4834d4)'
                                        : isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
                                    border: msg.type === 'user'
                                        ? 'none'
                                        : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                                    padding: '12px 16px', borderRadius: msg.type === 'user'
                                        ? '15px 15px 0 15px'
                                        : '15px 15px 15px 0',
                                    color: msg.type === 'user' ? 'white' : isDark ? 'white' : '#1e293b', 
                                    fontSize: '14px', lineHeight: '1.5',
                                    boxShadow: (!isDark && msg.type === 'bot') ? '0 1px 2px rgba(0,0,0,0.04)' : 'none'
                                }}>
                                    <p style={{ margin: '0 0 5px 0' }}>{msg.message}</p>
                                    <span style={{
                                        fontSize: '11px',
                                        color: msg.type === 'user'
                                            ? 'rgba(255,255,255,0.7)'
                                            : isDark ? 'rgba(255,255,255,0.4)' : '#94a3b8',
                                        display: 'block', textAlign: 'right'
                                    }}>
                                        {msg.time}
                                    </span>
                                </div>

                                {msg.type === 'user' && (
                                    <div style={{
                                        width: '35px', height: '35px',
                                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                                        borderRadius: '10px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        marginLeft: '10px', flexShrink: 0,
                                        color: 'white', fontWeight: 'bold'
                                    }}>
                                        {user.prenom?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                        {/* Section Entretiens Réels */}
{entretiensReels.length > 0 && (
    <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
            color: isDark ? 'white' : '#0f172a', 
            fontSize: '24px', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            {icons.users} Entretiens Réels
        </h2>
        
        <div style={{ display: 'grid', gap: '20px' }}>
            {entretiensReels.map((entretien) => (
                <div key={entretien.idCandidature} style={{
                    background: isDark ? 'rgba(40, 167, 69, 0.08)' : '#f0fdf4',
                    backdropFilter: isDark ? 'blur(10px)' : 'none',
                    border: isDark ? '1px solid rgba(40, 167, 69, 0.2)' : '1px solid #bbf7d0',
                    borderRadius: '16px',
                    padding: '25px',
                    transition: 'all 0.3s ease',
                    boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.04)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: '18px', marginBottom: '8px' }}>
                                {entretien.offreTitre}
                            </h3>
                            <p style={{ color: '#28a745', fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {icons.building} {entretien.entreprise}
                            </p>
                            
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                {entretien.etapeEntretien === 'attente_creneau' && (
                                    <span style={{
                                        background: 'rgba(255, 193, 7, 0.2)',
                                        color: '#f59e0b',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {icons.clock} En attente de votre créneau
                                    </span>
                                )}
                                
                                {entretien.etapeEntretien === 'creneau_choisi' && (
                                    <span style={{
                                        background: 'rgba(108, 99, 255, 0.2)',
                                        color: '#6c63ff',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {icons.calendar} Créneau choisi : {new Date(entretien.creneauChoisi?.date).toLocaleDateString('fr-FR')} à {entretien.creneauChoisi?.heureDebut}
                                    </span>
                                )}
                                
                                {entretien.etapeEntretien === 'visio_en_cours' && (
                                    <span style={{
                                        background: 'rgba(40, 167, 69, 0.2)',
                                        color: '#28a745',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {icons.greenDot} Visio disponible
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-end' }}>
                            {entretien.etapeEntretien === 'attente_creneau' && entretien.alerteEtudiant && (
                                <button
                                    onClick={() => handleOpenCalendar(entretien)}
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
                                        gap: '6px'
                                    }}
                                >
                                    {icons.calendar} Choisir un créneau
                                </button>
                            )}
                            
                            {entretien.etapeEntretien === 'visio_en_cours' && entretien.lienVisio && (
                                <button
                                    onClick={() => handleJoinVideo(entretien.lienVisio)}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    {icons.video} Rejoindre la visio
                                </button>
                            )}
                            
                            {entretien.recruteurInfo && (
                                <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b', fontSize: '12px', margin: 0 }}>
                                    Recruteur : {entretien.recruteurInfo.prenom} {entretien.recruteurInfo.nom}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)}

                    {/* Chat Input */}
                    <div style={{
                        background: isDark ? 'rgba(30, 30, 45, 0.95)' : '#f8fafc',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                        borderTop: 'none', borderRadius: '0 0 20px 20px',
                        padding: '20px'
                    }}>
                        <div style={{
                            display: 'flex', gap: '10px',
                            background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                            borderRadius: '15px', padding: '5px',
                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
                        }}>
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Écrivez votre message..."
                                rows="2"
                                style={{
                                    flex: 1, padding: '12px',
                                    background: 'transparent', border: 'none',
                                    color: isDark ? 'white' : '#1e293b', fontSize: '14px',
                                    outline: 'none', resize: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                style={{
                                    padding: '12px 25px',
                                    background: inputMessage.trim()
                                        ? 'linear-gradient(135deg, #6c63ff, #4834d4)'
                                        : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'),
                                    color: 'white', border: 'none',
                                    borderRadius: '12px', cursor: inputMessage.trim()
                                        ? 'pointer' : 'not-allowed',
                                    fontSize: '18px', transition: 'all 0.3s'
                                }}
                            >
                                {icons.arrowRight}
                            </button>
                        </div>
                    </div>
                    {showScore && finalScore && (
    <div style={{
        background: isDark ? 'linear-gradient(135deg, #1e1e2d, #2d2d44)' : '#ffffff',
        border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #ddd6fe',
        borderRadius: '15px', padding: '25px', marginTop: '15px',
        boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: isDark ? 'white' : '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {icons.chart} Score Final
            </h3>
            <div style={{
                fontSize: '48px', fontWeight: 'bold',
                color: finalScore.scoreTotal >= 70 ? '#10b981' : finalScore.scoreTotal >= 50 ? '#f59e0b' : '#ef4444'
            }}>
                {finalScore.scoreTotal}/100
            </div>
        </div>
        
        <div style={{ display: 'grid', gap: '10px' }}>
            {Object.entries(finalScore.scores).map(([key, value]) => (
                <div key={key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px', 
                    background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                    borderRadius: '8px', 
                    color: isDark ? 'white' : '#1e293b',
                    border: isDark ? 'none' : '1px solid #e2e8f0'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize' }}>
                        {key === 'pertinence' ? icons.target :
                         key === 'technique' ? icons.code :
                         key === 'communication' ? icons.chat :
                         key === 'motivation' ? icons.flame : icons.userCheck}
                        {key === 'pertinence' ? 'Pertinence' :
                         key === 'technique' ? 'Technique' :
                         key === 'communication' ? 'Communication' :
                         key === 'motivation' ? 'Motivation' : 'Professionnalisme'}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#6c63ff' }}>{value}/30</span>
                </div>
            ))}
        </div>
        
        <p style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b', marginTop: '15px', fontStyle: 'italic', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            {icons.message} {finalScore.commentaire}
        </p>
    </div>
)}
                </>
            )}

           <style>{`
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    @keyframes pulseButton {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`}</style>
           
    </div>
    );
}

export default EspEntretien;