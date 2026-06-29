import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext.jsx';

function Propositions() {
    const { isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [propositions, setPropositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Theme Variables
    const textPrimary = isDark ? 'white' : '#0f172a';
    const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : '#64748b';
    const cardBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
    const cardBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0';

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
            fetchPropositions(userData);
        }
    }, []);

    const fetchPropositions = async (userData) => {
        setLoading(true);
        try {
            if (userData.role === 'Etudiant') {
                const res = await fetch(`https://pfe-backend-five.vercel.app/candidatures/etudiant/${userData.id}`);
                const data = await res.json();
                
                // FIX: Normalize the backend key 'statutCandidature' to 'statut'
                const finalStages = data
                    .map(c => ({ ...c, statut: c.statutCandidature }))
                    .filter(c => 
                        ['proposition_envoyee', 'embauche_acceptee', 'embauche_refusee'].includes(c.statut)
                    );
                    
                setPropositions(finalStages);
                
            } else if (userData.role === 'Recruteur') {
                const res = await fetch(`https://pfe-backend-five.vercel.app/offres/recruteur/${userData.id}`);
                const data = await res.json();
                const offres = data.offers || data;
                
                let finalCandidates = [];
                offres.forEach(offre => {
                    offre.candidatures.forEach(c => {
                        // Recruiter endpoint correctly uses 'statut'
                        if (['proposition_envoyee', 'embauche_acceptee', 'embauche_refusee'].includes(c.statut)) {
                            finalCandidates.push({ ...c, offreInfo: offre });
                        }
                    });
                });
                setPropositions(finalCandidates);
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentDecision = async (offreId, decision) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/candidatures/${offreId}/${user.id}/decision`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision })
            });
            if (res.ok) {
                setMessage(decision === 'embauche_acceptee' ? '✅ Vous avez accepté le poste !' : '✅ Vous avez décliné l\'offre.');
                fetchPropositions(user);
                setTimeout(() => setMessage(''), 4000);
            }
        } catch (err) {
            setMessage('❌ Erreur de connexion');
        }
    };

    if (loading) return <div style={{ color: textPrimary, padding: '40px', textAlign: 'center' }}>Chargement...</div>;


    const safeMessageStr = String(message?.props?.children || message);
const isErrorMessage = safeMessageStr.includes('Erreur') || safeMessageStr.includes('Impossible');

    return (
        <div style={{ padding: '40px', color: textPrimary }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
                {user?.role === 'Etudiant' ? 'Mes Propositions d\'Embauche' : 'Suivi des Propositions'}
            </h1>
            <p style={{ color: textSecondary, marginBottom: '40px' }}>
                {user?.role === 'Etudiant' 
                    ? 'Félicitations ! Ces entreprises souhaitent vous recruter définitivement.' 
                    : 'Consultez les réponses des candidats à qui vous avez fait une offre définitive.'}
            </p>

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

            <div style={{ display: 'grid', gap: '20px' }}>
                {propositions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: textSecondary, background: cardBg, borderRadius: '16px', border: cardBorder }}>
                        Aucune proposition en cours.
                    </div>
                ) : (
                    propositions.map((prop, index) => (
                        <div key={index} style={{ background: cardBg, border: cardBorder, borderRadius: '16px', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                                    {user?.role === 'Etudiant' ? prop.offreTitre : prop.offreInfo.titre}
                                </h3>
                                {user?.role === 'Etudiant' ? (
                                    <p style={{ color: '#6c63ff' }}>{prop.entreprise}</p>
                                ) : (
                                    <p style={{ color: textSecondary }}>Candidat ID: {prop.etudiantId}</p>
                                )}
                                
                                <div style={{ marginTop: '15px' }}>
                                    <span style={{ 
                                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                        background: prop.statut === 'proposition_envoyee' ? 'rgba(255, 193, 7, 0.2)' : 
                                                   prop.statut === 'embauche_acceptee' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: prop.statut === 'proposition_envoyee' ? '#ffc107' : 
                                               prop.statut === 'embauche_acceptee' ? '#28a745' : '#ef4444'
                                    }}>
                                        {prop.statut === 'proposition_envoyee' ? 'En attente de réponse' : 
                                         prop.statut === 'embauche_acceptee' ? 'Poste Accepté' : 'Offre Déclinée'}
                                    </span>
                                </div>
                            </div>

                            {user?.role === 'Etudiant' && prop.statut === 'proposition_envoyee' && (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => handleStudentDecision(prop.offreId, 'embauche_acceptee')}
                                        style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Accepter le poste
                                    </button>
                                    <button 
                                        onClick={() => handleStudentDecision(prop.offreId, 'embauche_refusee')}
                                        style={{ padding: '10px 20px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Décliner
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Propositions;