// Moffres.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';

function Moffres() {
    const { isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [mesCandidatures, setMesCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedStatut, setSelectedStatut] = useState('all');
    const [customConfirm, setCustomConfirm] = useState({ show: false, message: '', onConfirm: null });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                if (parsedUser.role === 'Etudiant') {
                    fetchMesCandidatures(parsedUser.id);
                }
            } catch (error) {
                console.error("Erreur lors de l'analyse des données utilisateur:", error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchMesCandidatures = async (studentId) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/candidatures/etudiant/${studentId}`);
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            
            // --- NOUVEAU FILTRE AJOUTÉ ICI ---
            // On exclut les candidatures qui sont dans le processus de décision finale
            const candidaturesEnCours = data.filter(c => 
                !['proposition_envoyee', 'embauche_acceptee', 'embauche_refusee'].includes(c.statutCandidature)
            );
            
            // On utilise le tableau filtré au lieu de 'data'
            setMesCandidatures(candidaturesEnCours);
            
        } catch (err) {
            console.error("Erreur:", err);
            setMessage("Impossible de charger vos candidatures.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnnulerCandidature = async (offreId, candidatureId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir annuler cette candidature ?')) return;

        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/offres/${offreId}/candidatures/${candidatureId}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (res.ok) {
                setMessage("Candidature annulée avec succès.");
                
                setMesCandidatures(prevCandidatures =>
                    prevCandidatures.filter(c => c.candidatureId !== candidatureId)
                );
                
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(data.error || "Erreur lors de l'annulation.");
                setTimeout(() => setMessage(''), 4000);
            }
        } catch (err) {
            console.error("Erreur:", err);
            setMessage("Impossible de se connecter au serveur.");
            setTimeout(() => setMessage(''), 4000);
        }
    };

    const filteredCandidatures = selectedStatut === 'all'
        ? mesCandidatures
        : mesCandidatures.filter(c => c.statutCandidature === selectedStatut);

    // SVG Icons
    const icons = {
        clock: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
        checkCircle: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        xCircle: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
        ),
        clipboard: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
        ),
        building: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        ),
        dollar: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
        ),
        calendar: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        ),
        document: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
            </svg>
        ),
        message: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        ),
        target: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
        ),
        code: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
            </svg>
        ),
        chat: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
        ),
        flame: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
        ),
        userCheck: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <polyline points="17 11 19 13 23 9"/>
            </svg>
        ),
        mail: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
        ),
        lock: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
        inbox: (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
        ),
    };

    const renderStatutCandidature = (statut) => {
        let label, color, icon;
        switch (statut) {
            case 'en attente':
                label = 'En attente';
                color = '#f59e0b';
                icon = icons.clock;
                break;
            case 'acceptée':
                label = 'Acceptée';
                color = '#10b981';
                icon = icons.checkCircle;
                break;
            case 'refusée':
                label = 'Refusée';
                color = '#ef4444';
                icon = icons.xCircle;
                break;
            default:
                label = statut;
                color = isDark ? 'rgba(255,255,255,0.7)' : '#64748b';
                icon = icons.clipboard;
        }
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isDark ? `${color}20` : `${color}15`,
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

    const statsCandidatures = {
        total: mesCandidatures.length,
        enAttente: mesCandidatures.filter(c => c.statutCandidature === 'en attente').length,
        acceptees: mesCandidatures.filter(c => c.statutCandidature === 'acceptée').length,
        refusees: mesCandidatures.filter(c => c.statutCandidature === 'refusée').length
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh', 
                color: isDark ? '#fefae0' : '#2d2424' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '20px', color: isDark ? 'rgba(254,250,224,0.4)' : '#a39a92' }}>
                        {icons.spinner}
                    </div>
                    Chargement de vos candidatures...
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'Etudiant') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                padding: '40px'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                    borderRadius: '24px',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(139,126,116,0.12)',
                    maxWidth: '440px',
                    width: '100%'
                }}>
                    <div style={{ color: isDark ? 'rgba(254,250,224,0.3)' : '#a39a92', marginBottom: '16px' }}>
                        {icons.lock}
                    </div>
                    <h2 style={{ color: isDark ? '#fefae0' : '#2d2424', marginBottom: '8px', fontSize: '22px' }}>Accès Restreint</h2>
                    <p style={{ color: isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74', marginBottom: '24px', fontSize: '14px' }}>
                        Veuillez vous connecter en tant qu'étudiant pour voir cette page.
                    </p>
                    <Link to="/login">
                        <button style={{
                            padding: '12px 30px', 
                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            border: 'none', 
                            borderRadius: '14px', 
                            color: 'white', 
                            cursor: 'pointer', 
                            fontSize: '15px', 
                            fontWeight: '600',
                            fontFamily: "'Quicksand', sans-serif",
                            boxShadow: '0 4px 16px rgba(108, 99, 255, 0.25)'
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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* En-tête */}
            <div style={{ marginBottom: '36px' }}>
                <h1 style={{ 
                    color: isDark ? '#fefae0' : '#2d2424', 
                    fontSize: '28px', 
                    marginBottom: '8px', 
                    fontWeight: '700',
                    fontFamily: "'Quicksand', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ color: '#6c63ff' }}>{icons.clipboard}</span>
                    Mes Candidatures
                </h1>
                <p style={{ 
                    color: isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74', 
                    fontSize: '15px',
                    marginLeft: '32px'
                }}>
                    Suivez l'état de vos candidatures et les réponses des recruteurs.
                </p>
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

            {/* Cartes statistiques */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '16px', 
                marginBottom: '30px',
                maxWidth: '900px'
            }}>
                {[
                    { value: statsCandidatures.total, label: 'Total candidatures', color: '#6c63ff', icon: icons.clipboard, bg: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' },
                    { value: statsCandidatures.enAttente, label: 'En attente', color: '#f59e0b', icon: icons.clock, bg: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb', border: isDark ? 'rgba(245,158,11,0.15)' : '#fde68a' },
                    { value: statsCandidatures.acceptees, label: 'Acceptées', color: '#10b981', icon: icons.checkCircle, bg: isDark ? 'rgba(16,185,129,0.08)' : '#ecfdf5', border: isDark ? 'rgba(16,185,129,0.15)' : '#a7f3d0' },
                    { value: statsCandidatures.refusees, label: 'Refusées', color: '#ef4444', icon: icons.xCircle, bg: isDark ? 'rgba(239,68,68,0.08)' : '#fef2f2', border: isDark ? 'rgba(239,68,68,0.15)' : '#fecaca' },
                ].map((stat, idx) => (
                    <div key={idx} style={{
                        background: stat.bg,
                        border: `1px solid ${stat.border}`,
                        borderRadius: '18px',
                        padding: '20px',
                        textAlign: 'center',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        cursor: 'default'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '30px', fontWeight: '700', color: stat.color, marginBottom: '4px', fontFamily: "'Quicksand', sans-serif" }}>
                            {stat.value}
                        </div>
                        <div style={{ color: isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            {stat.icon} {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filtre par statut */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '25px',
                flexWrap: 'wrap'
            }}>
                <label style={{ 
                    color: isDark ? 'rgba(254,250,224,0.6)' : '#8b7e74', 
                    fontSize: '13px',
                    fontWeight: '600'
                }}>
                    Filtrer par statut :
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                        { value: 'all', label: 'Toutes', color: '#6c63ff', icon: icons.clipboard },
                        { value: 'en attente', label: 'En attente', color: '#f59e0b', icon: icons.clock },
                        { value: 'acceptée', label: 'Acceptées', color: '#10b981', icon: icons.checkCircle },
                        { value: 'refusée', label: 'Refusées', color: '#ef4444', icon: icons.xCircle },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setSelectedStatut(filter.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: selectedStatut === filter.value 
                                    ? `2px solid ${filter.color}` 
                                    : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139,126,116,0.12)',
                                background: selectedStatut === filter.value 
                                    ? `${filter.color}15`
                                    : isDark ? 'rgba(255, 255, 255, 0.03)' : '#fef9f3',
                                color: selectedStatut === filter.value 
                                    ? filter.color 
                                    : isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: selectedStatut === filter.value ? '600' : '500',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            {filter.icon} {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste des candidatures */}
            {filteredCandidatures.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                    borderRadius: '24px',
                    border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(139,126,116,0.08)'
                }}>
                    <div style={{ color: isDark ? 'rgba(254,250,224,0.2)' : 'rgba(139,126,116,0.3)', marginBottom: '20px' }}>
                        {icons.inbox}
                    </div>
                    <p style={{ fontSize: '16px', marginBottom: '20px', color: isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74' }}>
                        {selectedStatut === 'all'
                            ? "Vous n'avez postulé à aucune offre pour le moment."
                            : `Aucune candidature avec le statut "${selectedStatut}".`}
                    </p>
                    <Link to="/dashboard/offres">
                        <button style={{
                            padding: '12px 28px',
                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            fontFamily: "'Quicksand', sans-serif",
                            boxShadow: '0 4px 16px rgba(108, 99, 255, 0.25)',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {icons.clipboard} Voir les offres disponibles
                        </button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {filteredCandidatures.map((candidature) => (
                        <div key={candidature.candidatureId} style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(20px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139,126,116,0.1)',
                            borderRadius: '20px',
                            padding: '28px',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139,126,116,0.04)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '20px',
                                marginBottom: '15px'
                            }}>
                                <div style={{ flex: 2, minWidth: '250px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <h3 style={{ 
                                            color: isDark ? '#fefae0' : '#2d2424', 
                                            fontSize: '19px', 
                                            margin: 0,
                                            fontWeight: '600',
                                            fontFamily: "'Quicksand', sans-serif"
                                        }}>
                                            {candidature.offreTitre}
                                        </h3>
                                        {candidature.offreStatut === 'fermée' && (
                                            <span style={{
                                                background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                                                color: '#ef4444',
                                                padding: '4px 10px',
                                                borderRadius: '14px',
                                                fontSize: '11px',
                                                fontWeight: '600'
                                            }}>
                                                Offre fermée
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ color: '#6c63ff', fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                        <span>{icons.building} {candidature.entreprise}</span>
                                        <span>{icons.mapPin} {candidature.localisation}</span>
                                    </p>
                                    
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                        <span style={{
                                            background: isDark ? 'rgba(108, 99, 255, 0.12)' : 'rgba(108,99,255,0.06)',
                                            color: '#6c63ff',
                                            padding: '5px 12px',
                                            borderRadius: '14px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            {candidature.typeContrat}
                                        </span>
                                        {candidature.salaire && (
                                            <span style={{
                                                background: isDark ? 'rgba(126, 217, 160, 0.12)' : 'rgba(126,217,160,0.08)',
                                                color: '#5BBF7B',
                                                padding: '5px 12px',
                                                borderRadius: '14px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {icons.dollar} {candidature.salaire}
                                            </span>
                                        )}
                                    </div>

                                    {candidature.competences && candidature.competences.length > 0 && (
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                            {candidature.competences.map((skill, index) => (
                                                <span key={index} style={{
                                                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
                                                    padding: '5px 12px',
                                                    borderRadius: '14px',
                                                    fontSize: '11px',
                                                    color: isDark ? 'rgba(254,250,224,0.6)' : '#8b7e74',
                                                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(139,126,116,0.1)'
                                                }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                                    {renderStatutCandidature(candidature.statutCandidature)}
                                    
                                    <p style={{ 
                                        color: isDark ? 'rgba(254,250,224,0.35)' : '#a39a92', 
                                        fontSize: '12px', 
                                        margin: 0,
                                        textAlign: 'right',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {icons.calendar} Postulé le {new Date(candidature.dateCandidature).toLocaleDateString('fr-FR', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Lettre de motivation */}
                            {candidature.lettreMotivation && (
                                <div style={{
                                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#fef9f3',
                                    borderRadius: '14px',
                                    padding: '16px',
                                    borderLeft: '4px solid #6c63ff',
                                    marginBottom: '15px'
                                }}>
                                    <p style={{ 
                                        color: isDark ? 'rgba(254,250,224,0.4)' : '#a39a92', 
                                        fontSize: '11px', 
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {icons.document} MA LETTRE DE MOTIVATION
                                    </p>
                                    <p style={{ 
                                        color: isDark ? 'rgba(254,250,224,0.85)' : '#2d2424', 
                                        fontSize: '14px', 
                                        lineHeight: '1.6', 
                                        margin: 0, 
                                        fontStyle: 'italic' 
                                    }}>
                                        "{candidature.lettreMotivation}"
                                    </p>
                                </div>
                            )}

                            {/* Message du recruteur */}
                            {candidature.statutCandidature !== 'en attente' && candidature.commentaireRecruteur && (
                                <div style={{
                                    background: candidature.statutCandidature === 'acceptée'
                                        ? (isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16,185,129,0.04)')
                                        : (isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239,68,68,0.04)'),
                                    borderRadius: '14px',
                                    padding: '16px',
                                    borderLeft: candidature.statutCandidature === 'acceptée'
                                        ? '4px solid #10b981'
                                        : '4px solid #ef4444',
                                    marginBottom: '15px'
                                }}>
                                    <p style={{ 
                                        color: isDark ? 'rgba(254,250,224,0.4)' : '#a39a92', 
                                        fontSize: '11px', 
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {icons.message} MESSAGE DU RECRUTEUR
                                    </p>
                                    <p style={{ 
                                        color: isDark ? 'rgba(254,250,224,0.85)' : '#2d2424', 
                                        fontSize: '14px', 
                                        lineHeight: '1.6', 
                                        margin: 0 
                                    }}>
                                        {candidature.commentaireRecruteur}
                                    </p>
                                </div>
                            )}
                            
                            {candidature.statutCandidature === 'acceptée' && candidature.scoreEntretien !== undefined && candidature.scoreEntretien !== null && (
                                <div style={{
                                    background: isDark ? 'rgba(108, 99, 255, 0.04)' : 'rgba(108,99,255,0.03)',
                                    borderRadius: '18px',
                                    padding: '20px',
                                    borderLeft: '4px solid #6c63ff',
                                    marginBottom: '15px'
                                }}>
                                    <p style={{ 
                                        color: isDark ? 'rgba(254,250,224,0.4)' : '#a39a92', 
                                        fontSize: '11px', 
                                        marginBottom: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {icons.target} RÉSULTAT DE L'ENTRETIEN
                                    </p>
                                    
                                    <div style={{ 
                                        textAlign: 'center', 
                                        marginBottom: '15px',
                                        padding: '20px',
                                        background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
                                        borderRadius: '14px',
                                    }}>
                                        <div style={{
                                            fontSize: '48px',
                                            fontWeight: '700',
                                            color: candidature.scoreEntretien >= 70 ? '#10b981' : 
                                                   candidature.scoreEntretien >= 50 ? '#f59e0b' : '#ef4444',
                                            marginBottom: '5px',
                                            fontFamily: "'Quicksand', sans-serif"
                                        }}>
                                            {candidature.scoreEntretien}/100
                                        </div>
                                        <p style={{ 
                                            color: isDark ? 'rgba(254,250,224,0.4)' : '#8b7e74', 
                                            fontSize: '13px', 
                                            margin: 0,
                                            fontWeight: '500'
                                        }}>
                                            Score global
                                        </p>
                                    </div>
                                    
                                    {candidature.scores && (
                                        <div style={{ 
                                            display: 'grid', 
                                            gap: '10px', 
                                            marginBottom: '15px',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
                                        }}>
                                            {Object.entries(candidature.scores).map(([key, value]) => (
                                                <div key={key} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '10px 14px',
                                                    background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                                                    borderRadius: '12px',
                                                    color: isDark ? '#fefae0' : '#2d2424',
                                                    fontSize: '13px',
                                                    border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(139,126,116,0.08)',
                                                }}>
                                                    <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        {key === 'pertinence' ? icons.target : 
                                                         key === 'technique' ? icons.code :
                                                         key === 'communication' ? icons.chat :
                                                         key === 'motivation' ? icons.flame : icons.userCheck}
                                                        {key === 'pertinence' ? 'Pertinence' :
                                                         key === 'technique' ? 'Technique' :
                                                         key === 'communication' ? 'Communication' :
                                                         key === 'motivation' ? 'Motivation' : 'Professionnalisme'}
                                                    </span>
                                                    <span style={{ fontWeight: '700', color: '#6c63ff' }}>
                                                        {value}/30
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {candidature.commentaireEntretien && (
                                        <div style={{
                                            padding: '14px',
                                            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                                            borderRadius: '12px',
                                            border: isDark ? '1px solid rgba(108, 99, 255, 0.12)' : '1px solid rgba(108,99,255,0.1)',
                                        }}>
                                            <p style={{ 
                                                color: isDark ? 'rgba(254,250,224,0.4)' : '#a39a92', 
                                                fontSize: '11px', 
                                                marginBottom: '6px',
                                                textTransform: 'uppercase',
                                                fontWeight: '600',
                                                letterSpacing: '0.5px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {icons.chat} COMMENTAIRE IA
                                            </p>
                                            <p style={{ 
                                                color: isDark ? 'rgba(254,250,224,0.8)' : '#2d2424', 
                                                fontSize: '13px', 
                                                lineHeight: '1.6', 
                                                margin: 0,
                                                fontStyle: 'italic'
                                            }}>
                                                {candidature.commentaireEntretien}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139,126,116,0.08)',
                                paddingTop: '15px',
                                flexWrap: 'wrap'
                            }}>
                                <Link to="/dashboard/offres" style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        padding: '10px 20px',
                                        background: isDark ? 'rgba(108, 99, 255, 0.12)' : 'rgba(108,99,255,0.06)',
                                        color: '#6c63ff',
                                        border: isDark ? '1px solid rgba(108, 99, 255, 0.15)' : '1px solid rgba(108,99,255,0.12)',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        fontFamily: "'Quicksand', sans-serif",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        {icons.clipboard} Voir l'offre
                                    </button>
                                </Link>
                                
                                {candidature.statutCandidature === 'en attente' && (
                                    <button
                                        onClick={() => handleAnnulerCandidature(candidature.offreId, candidature.candidatureId)}
                                        style={{
                                            padding: '10px 20px',
                                            background: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239,68,68,0.06)',
                                            color: '#ef4444',
                                            border: isDark ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid rgba(239,68,68,0.12)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            fontFamily: "'Quicksand', sans-serif",
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        {icons.xCircle} Annuler ma candidature
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Moffres;