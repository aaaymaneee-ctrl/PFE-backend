import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';
import CalendrierEntretien from './CalendrierEntretien.jsx';



function EntretienRecruteur() {
    const { isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('tous'); // 'tous', 'reel', 'ai'
    const [schedulingInterview, setSchedulingInterview] = useState(null);
    // Variables de thème
    const textPrimary = isDark ? 'white' : '#0f172a';
    const textSecondary = isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b';
    const cardBg = isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
    const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0';
    const modalBg = isDark ? '#1e1e2d' : '#ffffff';
    const overlayBg = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)';

    const icons = {
        video: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>),
        robot: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="12" y1="2" x2="12" y2="5"/><circle cx="8" cy="12" r="1"/><circle cx="16" cy="12" r="1"/><path d="M8 16h8"/></svg>),
        users: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
        calendar: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
        clock: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
        checkCircle: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
        xCircle: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>),
        hourglass: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12M6 22h12M12 14c2.5 0 4-1.5 4-4V6H8v4c0 2.5 1.5 4 4 4z"/><path d="M12 10c-2.5 0-4 1.5-4 4v4h8v-4c0-2.5-1.5-4-4-4z"/></svg>),
        chart: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
        chat: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>)
    };

    // --- FONCTIONS DE TEMPS SÉCURISÉES ---
    const isInterviewTime = (creneauChoisi) => {
        if (!creneauChoisi?.date || !creneauChoisi?.heureDebut) return false;
        
        const now = new Date();
        const dateStr = creneauChoisi.date.split('T')[0];
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = creneauChoisi.heureDebut.split(':');
        
        const interviewDate = new Date(year, month - 1, day, hours, minutes, 0);
        
        // Autoriser de rejoindre 5 minutes avant
        const earlyAccess = new Date(interviewDate.getTime() - 5 * 60000);
        const interviewEnd = new Date(interviewDate.getTime() + 60 * 60000); // 1h d'entretien
        
        return now >= earlyAccess && now <= interviewEnd;
    };

    const isInterviewPassed = (creneauChoisi) => {
        if (!creneauChoisi?.date || !creneauChoisi?.heureDebut) return false;
        const now = new Date();
        const dateStr = creneauChoisi.date.split('T')[0];
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = creneauChoisi.heureDebut.split(':');
        
        const interviewEndTime = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes), 0);
        interviewEndTime.setMinutes(interviewEndTime.getMinutes() + 60); // 1h après
        
        return now > interviewEndTime;
    };

    const [customConfirm, setCustomConfirm] = useState({ show: false, message: '', onConfirm: null });

    const getTimeUntilInterview = (creneauChoisi) => {
        if (!creneauChoisi?.date || !creneauChoisi?.heureDebut) return null;
        const now = new Date();
        const dateStr = creneauChoisi.date.split('T')[0];
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = creneauChoisi.heureDebut.split(':');
        
        const interviewDate = new Date(year, month - 1, day, hours, minutes, 0);
        const diffMs = interviewDate - now;
        
        if (diffMs <= 0) return 'Maintenant';
        
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffDays > 0) return `dans ${diffDays}j ${diffHours}h`;
        if (diffHours > 0) return `dans ${diffHours}h ${diffMinutes}m`;
        if (diffMinutes > 0) return `dans ${diffMinutes} min`;
        return 'Très bientôt';
    };

    // --- CHARGEMENT DES DONNÉES ---
    const fetchInterviews = async (recruteurId) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/offres/recruteur/${recruteurId}`);
            const offres = await res.json();
            
            let allInterviews = [];
            
            for (const offre of offres) {
                if (!offre.candidatures) continue;
                
                for (const candidature of offre.candidatures) {
                    // On filtre : On veut les IA terminées OU les réels planifiés/terminés
                    if (
                        (candidature.interviewType === 'ai' && candidature.scoreEntretien) ||
                        (candidature.interviewType === 'reel' && candidature.creneauChoisi)
                    ) {
                        // Récupérer le nom de l'étudiant
                        let etudiantNom = 'Candidat inconnu';
                        try {
                            const userRes = await fetch(`https://pfe-backend-five.vercel.app/users/${candidature.etudiantId}`);
                            if (userRes.ok) {
                                const userData = await userRes.json();
                                etudiantNom = `${userData.prenom} ${userData.nom}`;
                            }
                        } catch (e) { console.error("Erreur user", e); }

                        allInterviews.push({
                            ...candidature,
                            candidatureId: candidature._id,
                            offreId: offre._id,
                            offreTitre: offre.titre,
                            etudiantNom: etudiantNom,
                            estTermine: ['embauché', 'refusée_final', 'proposition_envoyee', 'embauche_acceptee', 'embauche_refusee'].includes(candidature.statut)                        });
                    }
                }
            }
            
            // Tri par date de création ou de créneau
            allInterviews.sort((a, b) => {
                if (a.creneauChoisi?.date && b.creneauChoisi?.date) {
                    return new Date(b.creneauChoisi.date) - new Date(a.creneauChoisi.date);
                }
                return 0;
            });

            setInterviews(allInterviews);
        } catch (err) {
            console.error("Erreur de chargement:", err);
            setMessage('❌ Erreur lors du chargement des entretiens.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.role === 'Recruteur') {
                fetchInterviews(parsedUser.id);
            } else {
                setLoading(false);
            }
        }
    }, []);

    // --- ACTIONS FINALES ---
    const handleFinalDecision = async (offreId, candidatureId, decision) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir ${decision === 'proposition_envoyee' ? 'FAIRE UNE PROPOSITION' : 'REFUSER DÉFINITIVEMENT'} ce candidat ? Cette action clôture la phase d'entretien.`)) return;
        
        setIsSubmitting(true);
        try {
            const commentaireFinal = decision === 'proposition_envoyee' 
                ? "Félicitations ! Suite à votre entretien, nous souhaitons vous faire une proposition de recrutement." 
                : "Suite à votre entretien, nous ne pouvons malheureusement pas donner suite à votre candidature.";

            const res = await fetch(`https://pfe-backend-five.vercel.app/offres/${offreId}/candidatures/${candidatureId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    statut: decision,
                    commentaire: commentaireFinal 
                })
            });

            if (res.ok) {
                setMessage(`✅ ${decision === 'proposition_envoyee' ? 'Proposition envoyée' : 'Candidat refusé'} avec succès.`);
                setShowModal(false);
                fetchInterviews(user.id); 
                setTimeout(() => setMessage(''), 4000);
            } else {
                setMessage(`❌ Erreur lors de l'enregistrement de la décision.`);
            }
        } catch (err) {
            console.error(err);
            setMessage(`❌ Impossible de contacter le serveur.`);
        } finally {
            setIsSubmitting(false);
        }
    };  

    const handleTerminerVisio = async (offreId, candidatureId) => {
        if (!window.confirm("Voulez-vous vraiment clôturer cet appel ? L'étudiant verra que l'entretien est terminé.")) return;
        
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/offres/${offreId}/candidatures/${candidatureId}/terminer-visio`, {
                method: 'PUT'
            });
            
            if (res.ok) {
                setMessage('✅ Entretien terminé. Vous pouvez maintenant saisir votre décision finale.');
                fetchInterviews(user.id); // Rafraîchir la liste
                window.scrollTo(0, 0);
            } else {
                setMessage('❌ Erreur lors de la clôture de l\'entretien.');
            }
        } catch (err) {
            setMessage('❌ Erreur de connexion au serveur.');
        }
    };
    const renderScoreBar = (label, score, max = 30) => {
        const percentage = (score / max) * 100;
        return (
            <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', color: textSecondary }}>
                    <span>{label}</span>
                    <span style={{ fontWeight: 'bold', color: textPrimary }}>{score}/{max}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0', borderRadius: '3px' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: '#6c63ff', borderRadius: '3px' }}></div>
                </div>
            </div>
        );
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: textPrimary }}>{icons.hourglass} Chargement de vos entretiens...</div>;
    if (!user || user.role !== 'Recruteur') return <div style={{ textAlign: 'center', marginTop: '100px', color: textPrimary }}>Accès réservé aux recruteurs.</div>;

    const filteredInterviews = interviews.filter(i => {
        if (activeTab === 'tous') return true;
        return i.interviewType === activeTab;
    });


    const safeMessageStr = String(message?.props?.children || message);
const isErrorMessage = safeMessageStr.includes('Erreur') || safeMessageStr.includes('Impossible');

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: textPrimary, fontSize: '32px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {icons.video} Suivi des Entretiens
                </h1>
                <p style={{ color: textSecondary }}>Gérez vos appels en direct, consultez les évaluations IA et prenez vos décisions finales d'embauche.</p>
            </div>

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

            {/* Onglets de filtrage */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {['tous', 'reel', 'ai'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
                            background: activeTab === tab ? 'rgba(108, 99, 255, 0.15)' : 'transparent',
                            color: activeTab === tab ? '#6c63ff' : textSecondary,
                            border: activeTab === tab ? '1px solid rgba(108, 99, 255, 0.4)' : cardBorder
                        }}
                    >
                        {tab === 'tous' ? 'Tous les entretiens' : tab === 'reel' ? 'Entretiens Réels' : 'Entretiens IA'}
                    </button>
                ))}
            </div>

            {/* Liste des entretiens */}
            <div style={{ display: 'grid', gap: '15px' }}>
                {filteredInterviews.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: textSecondary, background: cardBg, borderRadius: '15px', border: cardBorder }}>
                        Aucun entretien {activeTab !== 'tous' ? activeTab : ''} à afficher.
                    </div>
                ) : (
                    filteredInterviews.map((interview) => {
                        const isReal = interview.interviewType === 'reel';
                        const canJoin = isReal && isInterviewTime(interview.creneauChoisi);
                        const isPassed = isReal && isInterviewPassed(interview.creneauChoisi);
                        const timeUntil = isReal ? getTimeUntilInterview(interview.creneauChoisi) : null;
                        const hasDecision = ['embauché', 'refusée_final', 'proposition_envoyee', 'embauche_acceptee', 'embauche_refusee'].includes(interview.statut);

                        return (
                            <div key={interview.candidatureId} style={{
                                background: cardBg,
                                border: cardBorder,
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '20px',
                                opacity: hasDecision ? 0.7 : 1
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                        <h3 style={{ color: textPrimary, margin: 0, fontSize: '18px' }}>{interview.etudiantNom}</h3>
                                        <span style={{
                                            fontSize: '11px', padding: '3px 8px', borderRadius: '8px', fontWeight: 'bold',
                                            background: isReal ? 'rgba(40, 167, 69, 0.15)' : 'rgba(108, 99, 255, 0.15)',
                                            color: isReal ? '#28a745' : '#6c63ff', display: 'flex', alignItems: 'center', gap: '4px'
                                        }}>
                                            {isReal ? icons.users : icons.robot} {isReal ? 'Réel' : 'IA'}
                                        </span>
                                        {hasDecision && (
                                            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '8px', background: interview.statut === 'embauché' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)', color: interview.statut === 'embauché' ? '#28a745' : '#dc3545' }}>
                                                {interview.statut === 'embauché' ? 'Accepté' : 'Refusé'} définitivement
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ color: textSecondary, margin: '0 0 10px 0', fontSize: '14px' }}>Pour : <strong>{interview.offreTitre}</strong></p>
                                    
                                    {isReal ? (
                                        <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: textSecondary }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{icons.calendar} {interview.creneauChoisi?.date?.split('T')[0]}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{icons.clock} {interview.creneauChoisi?.heureDebut}</span>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                                            {icons.checkCircle} Évaluation IA complétée (Score: {interview.scoreEntretien}/100)
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {/* Actions Entretien Réel */}
{isReal && !hasDecision && (
    <>
        {/* FIX: Bouton Rejoindre est toujours visible tant que l'heure est valide (canJoin) */}
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

        {/* NOUVEAU BOUTON : Terminer l'entretien manuellement (disparaît après le clic) */}
        {interview.statut !== 'evaluation_en_cours' && canJoin && (
            <button 
                onClick={() => handleTerminerVisio(interview.offreId, interview.candidatureId)}
                style={{ 
                    padding: '10px 15px', background: 'transparent', border: '1px solid #dc3545', 
                    color: '#dc3545', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' 
                }}>
                Terminer
            </button>
        )}

                                            {/* NOUVEAU BOUTON : Terminer l'entretien manuellement */}
                                            {interview.statut !== 'evaluation_en_cours' && canJoin && (
                                                <button 
                                                    onClick={() => handleTerminerVisio(interview.offreId, interview.candidatureId)}
                                                    style={{ 
                                                        padding: '10px 15px', background: 'transparent', border: '1px solid #dc3545', 
                                                        color: '#dc3545', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' 
                                                    }}>
                                                    Terminer
                                                </button>
                                            )}
                                            
                                            {/* Le bouton Décision Finale apparaît si le statut est "evaluation_en_cours" OU si le temps est dépassé */}
                                            {(isPassed || interview.statut === 'evaluation_en_cours') && (
                                                <button onClick={() => { setSelectedInterview(interview); setShowModal(true); }}
                                                    style={{ padding: '10px 20px', background: 'transparent', border: `1px solid #6c63ff`, color: '#6c63ff', borderRadius: '10px', cursor: 'pointer' }}>
                                                    Décision Finale
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Actions Entretien IA */}
                                    {!isReal && !hasDecision && (
                                        <button onClick={() => { setSelectedInterview(interview); setShowModal(true); }}
                                            style={{ padding: '10px 20px', background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.3)', color: '#6c63ff', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {icons.chart} Examiner et Décider
                                        </button>
                                    )}

                                    {/* Voir détails si déjà statué */}
                                    {hasDecision && (
                                        <button onClick={() => { setSelectedInterview(interview); setShowModal(true); }}
                                            style={{ padding: '10px 20px', background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', border: 'none', color: textPrimary, borderRadius: '10px', cursor: 'pointer' }}>
                                            Voir le dossier
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* MODAL DE DÉCISION / DÉTAILS IA */}
            {showModal && selectedInterview && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: overlayBg, backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
                }}>
                    <div style={{
                        background: modalBg, border: cardBorder, borderRadius: '20px',
                        width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                    }}>
                        {/* Header Modal */}
                        <div style={{ padding: '20px', borderBottom: cardBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, color: textPrimary, fontSize: '20px' }}>
                                Dossier de {selectedInterview.etudiantNom}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: textSecondary, fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>

                        {/* Body Modal (Scrollable) */}
                        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                            
                            {/* Section Spécifique IA */}
                            {selectedInterview.interviewType === 'ai' && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
                                        {/* Colonne Score */}
                                        <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: '20px', borderRadius: '15px' }}>
                                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                <div style={{ fontSize: '48px', fontWeight: 'bold', color: selectedInterview.scoreEntretien >= 70 ? '#10b981' : '#f59e0b' }}>
                                                    {selectedInterview.scoreEntretien}
                                                </div>
                                                <div style={{ color: textSecondary, fontSize: '12px', textTransform: 'uppercase' }}>Score Global IA</div>
                                            </div>
                                            {selectedInterview.scores && (
                                                <div>
                                                    {renderScoreBar('Pertinence', selectedInterview.scores.pertinence, 30)}
                                                    {renderScoreBar('Technique', selectedInterview.scores.technique, 25)}
                                                    {renderScoreBar('Communication', selectedInterview.scores.communication, 20)}
                                                    {renderScoreBar('Motivation', selectedInterview.scores.motivation, 15)}
                                                    {renderScoreBar('Professionnalisme', selectedInterview.scores.professionnalisme, 10)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Colonne Commentaire & Historique */}
                                        <div>
                                            <h4 style={{ color: textPrimary, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>{icons.chat} Synthèse de l'IA</h4>
                                            <p style={{ color: textSecondary, background: isDark ? 'rgba(108, 99, 255, 0.1)' : '#eef2ff', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #6c63ff', fontStyle: 'italic', fontSize: '14px', lineHeight: '1.6' }}>
                                                "{selectedInterview.commentaireEntretien}"
                                            </p>

                                            <h4 style={{ color: textPrimary, margin: '20px 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>{icons.chat} Historique du Chat</h4>
                                            <div style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9', padding: '15px', borderRadius: '10px', height: '200px', overflowY: 'auto', fontSize: '13px', color: textSecondary }}>
                                                {selectedInterview.historiqueChat && selectedInterview.historiqueChat.length > 0 ? (
                                                    selectedInterview.historiqueChat.map((msg, idx) => (
                                                        <div key={idx} style={{ marginBottom: '10px', padding: '10px', background: msg.role === 'user' ? 'rgba(108, 99, 255, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                                            <strong>{msg.role === 'user' ? 'Candidat' : 'IA'}:</strong> {msg.content}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.6 }}>
                                                        <em>L'historique de la conversation n'a pas été sauvegardé par le serveur lors de cet entretien.</em>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Section Spécifique Réel */}
                            {selectedInterview.interviewType === 'reel' && (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <div style={{ fontSize: '40px', color: '#6c63ff', marginBottom: '15px' }}>{icons.users}</div>
                                    <h3 style={{ color: textPrimary, marginBottom: '10px' }}>Entretien Visioconférence</h3>
                                    <p style={{ color: textSecondary }}>L'entretien en direct avec {selectedInterview.etudiantNom} {isInterviewPassed(selectedInterview.creneauChoisi) ? "est terminé." : "est planifié ou en cours."} Quelle est votre décision finale concernant ce recrutement ?</p>
                                </div>
                            )}

                        </div>

                        {/* Footer Modal - Actions de décision */}
                       {/* Footer Modal - Actions de décision */}
{!(selectedInterview.statut === 'embauché' || selectedInterview.statut === 'refusée_final') && (
    <div style={{ padding: '20px', borderTop: cardBorder, display: 'flex', gap: '15px', background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderRadius: '0 0 20px 20px' }}>
        
        {/* CAS 1 : Entretien IA -> Planifier la suite ou Refuser */}
        {selectedInterview.interviewType === 'ai' && (
            <>
                <button
                    onClick={() => setSchedulingInterview(selectedInterview)}
                    disabled={isSubmitting}
                    style={{ flex: 1, padding: '15px', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                    {icons.calendar} Planifier un entretien réel
                </button>
                <button
                    onClick={() => handleFinalDecision(selectedInterview.offreId, selectedInterview.candidatureId, 'refusée_final')}
                    disabled={isSubmitting}
                    style={{ flex: 1, padding: '15px', background: 'transparent', color: '#dc3545', border: '2px solid #dc3545', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                    {icons.xCircle} Refuser définitivement
                </button>
            </>
        )}

        {/* CAS 2 : Entretien Réel -> Accepter ou Refuser (Quand l'heure est passée OU terminé manuellement) */}
        {selectedInterview.interviewType === 'reel' && (
            (isInterviewPassed(selectedInterview.creneauChoisi) || selectedInterview.etapeEntretien === 'termine' || selectedInterview.statut === 'evaluation_en_cours') ? (
                <>
                    <button
                        onClick={() => handleFinalDecision(selectedInterview.offreId, selectedInterview.candidatureId, 'proposition_envoyee')}
                        disabled={isSubmitting}
                        style={{ flex: 1, padding: '15px', background: 'linear-gradient(135deg, #28a745, #20c997)', color: 'white', border: 'none', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {icons.checkCircle} Faire une proposition
                    </button>
                    <button
                        onClick={() => handleFinalDecision(selectedInterview.offreId, selectedInterview.candidatureId, 'refusée_final')}
                        disabled={isSubmitting}
                        style={{ flex: 1, padding: '15px', background: 'transparent', color: '#dc3545', border: '2px solid #dc3545', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {icons.xCircle} Refuser définitivement
                    </button>
                </>
            ) : (
                <div style={{ width: '100%', textAlign: 'center', color: textSecondary, padding: '10px', fontWeight: 'bold' }}>
                    ⏳ La décision finale sera disponible une fois l'entretien terminé.
                </div>
            )
        )}
        
    </div>
)}
                        
                        {(selectedInterview.statut === 'embauché' || selectedInterview.statut === 'refusée_final') && (
                            <div style={{ padding: '20px', borderTop: cardBorder, textAlign: 'center', color: textSecondary }}>
                                Ce dossier est clôturé. Décision : <strong style={{ color: selectedInterview.statut === 'embauché' ? '#28a745' : '#dc3545' }}>{selectedInterview.statut === 'embauché' ? 'Embauché' : 'Refusé'}</strong>
                            </div>
                        )}
                        
                    </div>
                    
                </div>
            )}
    {/* MODAL DE PLANIFICATION DE L'ENTRETIEN RÉEL */}
            {schedulingInterview && (
                <CalendrierEntretien
                    offre={{ _id: schedulingInterview.offreId }}
                    onClose={() => setSchedulingInterview(null)}
                    onConfirm={async (creneau) => {
    try {
        const safeCandidatureId = schedulingInterview.candidatureId || schedulingInterview._id;
        const safeOffreId = schedulingInterview.offreId || schedulingInterview.idOffre || schedulingInterview.offre?._id;
        const safeEtudiantId = schedulingInterview.etudiantId?._id || schedulingInterview.etudiantId || schedulingInterview.etudiant?._id;

        // 1. UPDATE STATUS: Tell the database this is now a Real Interview
        await fetch(`https://pfe-backend-five.vercel.app/offres/${safeOffreId}/candidatures/${safeCandidatureId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                statut: 'acceptée',
                commentaire: `Suite à votre évaluation IA, un entretien réel a été planifié le ${creneau.date} à ${creneau.heureDebut}`,
                interviewType: 'reel',
                etapeEntretien: 'creneau_choisi'
            })
        });

        // 2. SCHEDULE SLOT: Flatten the keys to match server.js and include the recruiter ID
        const res = await fetch(`https://pfe-backend-five.vercel.app/creneaux/planifier-recruteur`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idCandidature: safeCandidatureId,
                idOffre: safeOffreId,
                idEtudiant: safeEtudiantId,
                idRecruteur: user.id,             // ADDED: Essential for backend auth
                date: creneau.date,               // FLATTENED
                heureDebut: creneau.heureDebut,   // FLATTENED
                heureFin: creneau.heureFin        // FLATTENED
            })
        });

        if (res.ok) {
            setMessage(`✅ Entretien réel planifié avec succès pour le ${creneau.date}.`);
            setSchedulingInterview(null);
            setShowModal(false);
            fetchInterviews(user.id); // Reload the list
        } else {
            setMessage('❌ Erreur lors de la planification.');
            setSchedulingInterview(null);
        }
    } catch (err) {
        console.error(err);
        setMessage('❌ Erreur de connexion au serveur.');
        setSchedulingInterview(null);
    }
}}
                    mode="recruteur"
                />
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

export default EntretienRecruteur;