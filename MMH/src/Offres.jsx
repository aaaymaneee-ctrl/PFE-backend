// Offres.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';
import React from 'react';

// AutoApplyResultsModal Component
const AutoApplyResultsModal = ({ results, onClose }) => {
    const { isDark } = useTheme();
    const [enrichedDetails, setEnrichedDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [customConfirm, setCustomConfirm] = useState({ show: false, message: '', onConfirm: null });

    useEffect(() => {
        enrichSkippedOffers();
    }, [results]);

    const enrichSkippedOffers = async () => {
        try {
            const res = await fetch('http://localhost:3000/offres');
            const allOffres = await res.json();
            
            const offresMap = {};
            allOffres.forEach(offre => {
                offresMap[offre._id] = offre;
            });

            const enriched = results.details.map(detail => {
                const fullOffre = offresMap[detail.offreId || detail._id];
                
                return {
                    ...detail,
                    entreprise: detail.entreprise || fullOffre?.entreprise || '',
                    titre: detail.titre || fullOffre?.titre || 'Offre sans titre'
                };
            });

            setEnrichedDetails(enriched);
        } catch (err) {
            console.error("Error enriching offer details:", err);
            setEnrichedDetails(results.details);
        } finally {
            setLoadingDetails(false);
        }
    };




    // SVG Icons for modal
    const modalIcons = {
        robot: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="12" y1="2" x2="12" y2="5"/>
                <circle cx="8" cy="12" r="1"/>
                <circle cx="16" cy="12" r="1"/>
                <path d="M8 16h8"/>
            </svg>
        ),
        spinner: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        check: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '2px' }}>
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        ),
        skip: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <polyline points="9 18 15 12 9 6"/>
            </svg>
        ),
        thumbsUp: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
        ),
        building: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            </svg>
        ),
    };

    const modalBg = isDark ? 'linear-gradient(135deg, #1e1e3f, #2c2c54)' : '#ffffff';
    const modalBorder = isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e5e7eb';
    const textPrimary = isDark ? 'white' : '#0f1419';
    const textSecondary = isDark ? 'rgba(255, 255, 255, 0.5)' : '#666666';
    const sectionBorder = isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #f3f4f6';
    const cardBg = isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
    const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb';

    if (loadingDetails) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center',
                alignItems: 'center', zIndex: 1000, padding: '20px'
            }}>
                <div style={{
                    background: modalBg, border: modalBorder, borderRadius: '20px',
                    padding: '40px', textAlign: 'center', color: textPrimary,
                    boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.08)'
                }}>
                    <div style={{ fontSize: '40px', marginBottom: '20px', color: isDark ? 'rgba(255,255,255,0.3)' : '#a39a92' }}>
                        {modalIcons.spinner}
                    </div>
                    <p>Chargement des détails...</p>
                </div>
            </div>
        );
    }

    const appliedOffers = enrichedDetails.filter(d => d.status === 'applied');
    const skippedOffers = enrichedDetails.filter(d => d.status === 'skipped');

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000, padding: '20px'
        }}>
            <div style={{
                background: modalBg, border: modalBorder, borderRadius: '20px',
                width: '100%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto',
                boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.08)'
            }}>
                <div style={{
                    padding: '25px 30px', borderBottom: sectionBorder, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', position: 'sticky',
                    top: 0, background: modalBg, borderRadius: '20px 20px 0 0', zIndex: 1
                }}>
                    <h2 style={{ color: textPrimary, fontSize: '22px', margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        {modalIcons.robot} Résultats - Candidature Automatique
                    </h2>
                    <button onClick={onClose} style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6',
                        border: 'none', color: textPrimary, width: '36px', height: '36px',
                        borderRadius: '50%', cursor: 'pointer', fontSize: '18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>✕</button>
                </div>

                <div style={{ padding: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ textAlign: 'center', padding: '15px', background: cardBg, borderRadius: '12px', border: cardBorder }}>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#5b5ef7' }}>{results.total}</div>
                            <div style={{ color: textSecondary, fontSize: '12px' }}>Offres analysées</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '15px', background: isDark ? 'rgba(40, 167, 69, 0.1)' : '#f0fdf4', borderRadius: '12px', border: isDark ? '1px solid rgba(40, 167, 69, 0.2)' : '1px solid #d4edda' }}>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>{results.applied}</div>
                            <div style={{ color: textSecondary, fontSize: '12px' }}>Candidatures envoyées</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '15px', background: isDark ? 'rgba(255, 193, 7, 0.1)' : '#fffbf0', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 193, 7, 0.2)' : '1px solid #feebc8' }}>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107' }}>{results.skipped}</div>
                            <div style={{ color: textSecondary, fontSize: '12px' }}>Ignorées (&lt;70%)</div>
                        </div>
                    </div>

                    {appliedOffers.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ color: '#28a745', fontSize: '16px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {modalIcons.check} Candidatures envoyées avec succès
                            </h3>
                            {appliedOffers.map((detail, index) => (
                                <div key={index} style={{
                                    padding: '15px', background: isDark ? 'rgba(40, 167, 69, 0.08)' : '#f0fdf4',
                                    border: isDark ? '1px solid rgba(40, 167, 69, 0.2)' : '1px solid #d4edda',
                                    borderRadius: '12px', marginBottom: '10px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <h4 style={{ color: textPrimary, margin: 0, fontSize: '15px' }}>{detail.titre}</h4>
                                        <span style={{ background: isDark ? 'rgba(40, 167, 69, 0.2)' : '#d4edda', color: '#28a745', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                            {detail.matchPercentage}% match
                                        </span>
                                    </div>
                                    {detail.entreprise && (
                                        <p style={{ color: textSecondary, fontSize: '13px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center' }}>
                                            {modalIcons.building} {detail.entreprise}
                                        </p>
                                    )}
                                    {detail.matchedSkills && detail.matchedSkills.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {detail.matchedSkills.map((skill, idx) => (
                                                <span key={idx} style={{ background: isDark ? 'rgba(40, 167, 69, 0.2)' : '#d4edda', color: '#28a745', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    {modalIcons.check} {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {skippedOffers.length > 0 && (
                        <div>
                            <h3 style={{ color: '#ffc107', fontSize: '16px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {modalIcons.skip} Offres ignorées (correspondance &lt; 70%)
                            </h3>
                            {skippedOffers.map((detail, index) => (
                                <div key={index} style={{
                                    padding: '12px', background: isDark ? 'rgba(255, 193, 7, 0.05)' : '#fffbf0',
                                    border: isDark ? '1px solid rgba(255, 193, 7, 0.1)' : '1px solid #feebc8',
                                    borderRadius: '8px', marginBottom: '8px', display: 'flex',
                                    justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <span style={{ color: textSecondary, fontSize: '13px' }}>
                                        {detail.titre}{detail.entreprise && ` - ${detail.entreprise}`}
                                    </span>
                                    <span style={{ color: '#ffc107', fontSize: '12px', fontWeight: 'bold' }}>{detail.matchPercentage}%</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={onClose} style={{
                        width: '100%', padding: '14px', marginTop: '20px',
                        background: 'linear-gradient(135deg, #5b5ef7, #4f46e5)', color: 'white',
                        border: 'none', borderRadius: '10px', cursor: 'pointer',
                        fontSize: '16px', fontWeight: 'bold', transition: 'all 0.3s ease'
                    }}>
                        {modalIcons.thumbsUp} Compris, fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

function Offres() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [autoApplying, setAutoApplying] = useState(false);
    const [showAutoApplyModal, setShowAutoApplyModal] = useState(false);
    const [autoApplyResults, setAutoApplyResults] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingOffre, setEditingOffre] = useState(null);
    const [formData, setFormData] = useState({
        titre: '', description: '', entreprise: '', localisation: '',
        typeContrat: '', salaire: '', competences: '', dateLimite: '', 
        nombrePostes: 1
    });
    
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [lettreMotivation, setLettreMotivation] = useState('');
    const [message, setMessage] = useState('');
    const [appliedOfferIds, setAppliedOfferIds] = useState(new Set());
    const [showAllOffers, setShowAllOffers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // SVG Icons
    const icons = {
        lock: (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        ),
        spinner: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        rocket: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
            </svg>
        ),
        eye: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        ),
        checkCircle: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        clipboard: (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
        ),
        edit: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        ),
        trash: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
        ),
        document: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
            </svg>
        ),
        dollar: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
        ),
        plus: (
            <span style={{ marginRight: '4px' }}>+</span>
        ),
    };

    // Theme-aware variables
    const textPrimary = isDark ? 'white' : '#0f1419';
    const textSecondary = isDark ? 'rgba(255, 255, 255, 0.6)' : '#666666';
    const cardBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff';
    const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb';
    const cardShadow = isDark ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.02)';
    const modalBg = isDark ? 'linear-gradient(135deg, #1e1e3f, #2c2c54)' : '#ffffff';
    const modalBorder = isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e5e7eb';
    const modalShadow = isDark ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.08)';
    const inputBg = isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';
    const inputBorder = isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb';
    const inputColor = isDark ? 'white' : '#0f1419';
    const labelColor = isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280';
    const btnCancelBg = isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6';
    const btnCancelBorder = isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #e5e7eb';
    const btnCancelColor = isDark ? 'white' : '#0f1419';
    const overlayBg = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)';
    const skillBg = isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6';
    const skillColor = isDark ? 'rgba(255, 255, 255, 0.9)' : '#374151';

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                fetchOffres(parsedUser);
            } catch (err) {
                console.error("Error parsing user:", err);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            setLoading(true);
            fetchOffres(user);
        }
    }, [showAllOffers]);

    const fetchOffres = async (userData) => {
    try {
        let url = 'http://localhost:3000/offres';
        
        // For recruiter view - different endpoint
        if (userData?.role === 'Recruteur') {
            const res = await fetch(`http://localhost:3000/offres/recruteur/${userData.id}`);
            const data = await res.json();
            // The recruiter endpoint might return { offers: [], recruiterBlocked: true/false }
            if (data.offers) {
                setOffres(data.offers);
            } else {
                setOffres(data);
            }
            setLoading(false);
            return;
        }
        
        // For student and admin - get all offers with block status
        const res = await fetch(url);
        const allOffres = await res.json();
        
        console.log("Fetched offers:", allOffres); // Debug: Check if offers from blocked recruiters are here
        
        if (userData?.role === 'Etudiant' && userData.id) {
            // Get student's applied offers
            const candidaturesRes = await fetch(`http://localhost:3000/candidatures/etudiant/${userData.id}`);
            
            if (candidaturesRes.ok) {
                const candidaturesData = await candidaturesRes.json();
                const appliedIds = new Set(candidaturesData.map(c => c.offreId));
                setAppliedOfferIds(appliedIds);
                
                if (!showAllOffers) {
                    // Filter out only applied offers, but KEEP blocked recruiter offers
                    const availableOffres = allOffres.filter(offre => !appliedIds.has(offre._id));
                    setOffres(availableOffres);
                    console.log("Available offers (excluding applied):", availableOffres.length);
                    console.log("Blocked recruiter offers in available:", availableOffres.filter(o => o.recruteurBlocked).length);
                } else {
                    setOffres(allOffres);
                }
            } else {
                setAppliedOfferIds(new Set());
                setOffres(allOffres);
            }
        } else {
            setOffres(allOffres);
        }
    } catch (err) {
        console.error("Error fetching offres:", err);
        try {
            const fallbackRes = await fetch('http://localhost:3000/offres');
            const fallbackData = await fallbackRes.json();
            setOffres(fallbackData);
        } catch (fallbackErr) {
            console.error("Fallback also failed:", fallbackErr);
        }
    } finally {
        setLoading(false);
    }
};

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateNew = () => {
        setEditingOffre(null);
        setFormData({ 
            titre: '', description: '', entreprise: '', localisation: '', 
            typeContrat: '', salaire: '', competences: '', dateLimite: '', 
            nombrePostes: 1 
        });
        setShowForm(true);
    };

    const handleEdit = (offre) => {
        setEditingOffre(offre);
        setFormData({
            titre: offre.titre, description: offre.description, entreprise: offre.entreprise,
            localisation: offre.localisation, typeContrat: offre.typeContrat,
            salaire: offre.salaire || '', competences: offre.competences.join(', '),
            dateLimite: offre.dateLimite ? offre.dateLimite.split('T')[0] : '',
            nombrePostes: offre.nombrePostes || 1 // NOUVEAU
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (formData.dateLimite) {
            const selectedDate = new Date(formData.dateLimite);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                setMessage('❌ Erreur : La date limite ne peut pas être dans le passé.');
                setTimeout(() => setMessage(''), 4000);
                return;
            }
        }
        const offreData = { ...formData, competences: formData.competences.split(',').map(s => s.trim()).filter(s => s), recruteurId: user.id };
        try {
            let res;
            if (editingOffre) {
                res = await fetch(`http://localhost:3000/offres/${editingOffre._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(offreData) });
            } else {
                res = await fetch('http://localhost:3000/offres', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(offreData) });
            }
            const data = await res.json();
            if (res.ok) { setMessage(data.message); setShowForm(false); fetchOffres(user); }
            else { setMessage(data.error || 'Une erreur est survenue'); }
        } catch (err) { setMessage('Impossible de se connecter au serveur'); }
    };

    const handleDelete = async (offreId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
        try {
            const res = await fetch(`http://localhost:3000/offres/${offreId}`, { method: 'DELETE' });
            if (res.ok) { setOffres(offres.filter(o => o._id !== offreId)); setMessage('Offre supprimée avec succès'); }
        } catch (err) { setMessage('Erreur lors de la suppression'); }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/offres/${selectedOffre._id}/postuler`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ etudiantId: user.id, lettreMotivation })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('✅ Candidature envoyée avec succès!');
                setShowApplyModal(false); setLettreMotivation('');
                setAppliedOfferIds(prev => new Set([...prev, selectedOffre._id]));
                if (!showAllOffers) fetchOffres(user);
            } else { setMessage(data.error || '❌ Erreur lors de la candidature'); }
        } catch (err) { setMessage('❌ Impossible de se connecter au serveur'); }
    };

    const checkCVExists = async () => {
        try {
            const res = await fetch(`http://localhost:3000/users/${user.id}`);
            const userData = await res.json();
            if (!userData.cv || !userData.cv.filename) {
                setMessage("❌ Vous devez d'abord télécharger votre CV.");
                setTimeout(() => setMessage(''), 4000);
                return false;
            }
            return true;
        } catch (err) { return false; }
    };

    const handleAutoApply = async () => {
        const hasCV = await checkCVExists();
        if (!hasCV) return;
        setAutoApplying(true);
        try {
            const res = await fetch(`http://localhost:3000/offres/auto-apply/${user.id}`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) { setAutoApplyResults(data.results); setShowAutoApplyModal(true); setMessage(`✅ ${data.message}`); }
            else { setMessage(data.error || "❌ Erreur lors de la candidature automatique."); }
        } catch (err) { setMessage("❌ Impossible de se connecter au serveur."); }
        finally { setAutoApplying(false); setTimeout(() => setMessage(''), 5000); }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: textPrimary }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '20px', color: isDark ? 'rgba(255,255,255,0.3)' : '#a39a92' }}>
                        {icons.spinner}
                    </div>
                    Chargement des offres...
                </div>
            </div>
        );
    }

    if (!user) return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '60vh', padding: '40px'
        }}>
            <div style={{
                textAlign: 'center', padding: '48px',
                background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                borderRadius: '20px',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(139,126,116,0.1)',
                maxWidth: '440px', width: '100%'
            }}>
                <div style={{ color: isDark ? 'rgba(255,255,255,0.2)' : '#a39a92', marginBottom: '16px' }}>
                    {icons.lock}
                </div>
                <h2 style={{ color: textPrimary, marginBottom: '8px' }}>Access Restricted</h2>
                <p style={{ color: textSecondary, marginBottom: '24px' }}>Please log in first to access your dashboard</p>
                <button onClick={() => navigate('/login')} style={{ marginTop: '20px', padding: '12px 30px', background: 'linear-gradient(135deg, #5b5ef7, #4f46e5)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Go to Login
                </button>
            </div>
        </div>
    );

    const displayedOffres = offres.filter(offre => {
        if (user?.role === 'admin' && searchTerm) {
            const search = searchTerm.toLowerCase();
            return (
                (offre.titre && offre.titre.toLowerCase().includes(search)) ||
                (offre.entreprise && offre.entreprise.toLowerCase().includes(search)) ||
                (offre.localisation && offre.localisation.toLowerCase().includes(search)) ||
                (offre.typeContrat && offre.typeContrat.toLowerCase().includes(search))
            );
        }
        return true;
    });



const safeMessageStr = String(message?.props?.children || message);
const isErrorMessage = safeMessageStr.includes('Erreur') || safeMessageStr.includes('Impossible');

    return (
        <div style={{ padding: '40px', color: textPrimary }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '10px', color: textPrimary }}>
                        {user?.role === 'Recruteur' ? 'Mes Offres' : user?.role === 'Etudiant' ? 'Offres disponibles' : 'Toutes les Offres'}
                    </h1>
                    <p style={{ color: textSecondary }}>
                        {user?.role === 'Recruteur' ? 'Gérez vos offres d\'emploi' : user?.role === 'Etudiant' ? 'Parcourez et postulez aux offres' : 'Gérez toutes les offres'}
                    </p>
                </div>

                {user?.role === 'Etudiant' && (
                    <button onClick={handleAutoApply} disabled={autoApplying} style={{
                        padding: '12px 24px',
                        background: autoApplying ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') : 'linear-gradient(135deg, #28a745, #20c997)',
                        color: 'white', border: 'none', borderRadius: '10px',
                        cursor: autoApplying ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => !autoApplying && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => !autoApplying && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {autoApplying ? <>{icons.spinner} Analyse en cours...</> : <>{icons.rocket} Postuler automatiquement</>}
                    </button>
                )}
            
                {user?.role === 'Recruteur' && (
                    <button onClick={handleCreateNew} style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #5b5ef7, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {icons.plus} Nouvelle Offre
                    </button>
                )}
                {user?.role === 'Etudiant' && (
    <button onClick={() => { 
        setShowAllOffers(!showAllOffers); 
        // Don't clear offres immediately, let useEffect handle it
    }} style={{
        padding: '12px 20px',
        background: showAllOffers ? 'rgba(40, 167, 69, 0.1)' : 'rgba(108, 99, 255, 0.1)',
        color: showAllOffers ? '#16a34a' : '#5b5ef7',
        border: `1px solid ${showAllOffers ? 'rgba(40, 167, 69, 0.2)' : 'rgba(108, 99, 255, 0.2)'}`,
        borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.3s',
        display: 'flex', alignItems: 'center', gap: '6px'
    }}>
        {showAllOffers ? <>{icons.checkCircle} Voir disponibles uniquement</> : <>{icons.eye} Voir toutes les offres</>}
    </button>
)}
            </div>

            {/* Message */}
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

            {user?.role === 'admin' && (
                <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '12px', color: textSecondary }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </span>
                        <input 
                            type="text"
                            placeholder="Rechercher par titre, entreprise, ville..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 40px',
                                borderRadius: '10px',
                                border: inputBorder,
                                background: inputBg,
                                color: inputColor,
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: modalBg, color: textPrimary, padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: modalBorder, boxShadow: modalShadow }}>
                        <h2 style={{ marginBottom: '20px', color: textPrimary }}>{editingOffre ? 'Modifier l\'offre' : 'Nouvelle Offre'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Titre *</label><input type="text" name="titre" value={formData.titre} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }} /></div>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows="4" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor, resize: 'vertical' }} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div><label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Entreprise *</label><input type="text" name="entreprise" value={formData.entreprise} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }} /></div>
                                <div><label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Localisation *</label><input type="text" name="localisation" value={formData.localisation} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div><label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Type de contrat *</label><select name="typeContrat" value={formData.typeContrat} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }}><option value="" style={{ color: inputColor, background: isDark ? '#2c2c54' : '#ffffff' }}>Sélectionner...</option><option value="Stage" style={{ color: inputColor, background: isDark ? '#2c2c54' : '#ffffff' }}>Stage</option><option value="Emploi" style={{ color: inputColor, background: isDark ? '#2c2c54' : '#ffffff' }}>Emploi</option></select></div>
                                <div><label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Salaire</label><input type="text" name="salaire" value={formData.salaire} onChange={handleChange} placeholder="ex: 8000 - 12000 MAD" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }} /></div>
                            </div>
                            <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Compétences (séparées par des virgules)</label><input type="text" name="competences" value={formData.competences} onChange={handleChange} placeholder="ex: React, Node.js, MongoDB" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Date limite</label>
                                <input type="date" name="dateLimite" value={formData.dateLimite} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }} />
                            </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: labelColor }}>Nombre de postes *</label>
                                    <input type="number" name="nombrePostes" value={formData.nombrePostes} onChange={handleChange} min="1" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }} />
                                </div>
                            </div>                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #5b5ef7, #4f46e5)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editingOffre ? 'Modifier' : 'Créer'} l'offre</button>
                                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: btnCancelBg, color: btnCancelColor, border: btnCancelBorder, borderRadius: '8px', cursor: 'pointer' }}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Apply Modal */}
            {showApplyModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: modalBg, color: textPrimary, padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', border: modalBorder, boxShadow: modalShadow }}>
                        <h2 style={{ marginBottom: '20px', color: textPrimary }}>Postuler à : {selectedOffre?.titre}</h2>
                        <form onSubmit={handleApply}>
                            <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', marginBottom: '10px', color: labelColor }}>Lettre de motivation</label><textarea value={lettreMotivation} onChange={(e) => setLettreMotivation(e.target.value)} rows="5" placeholder="Pourquoi souhaitez-vous postuler à cette offre ?" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor, resize: 'vertical' }} /></div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #5b5ef7, #4f46e5)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Envoyer ma candidature</button>
                                <button type="button" onClick={() => { setShowApplyModal(false); setLettreMotivation(''); }} style={{ flex: 1, padding: '12px', background: btnCancelBg, color: btnCancelColor, border: btnCancelBorder, borderRadius: '8px', cursor: 'pointer' }}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Offers List */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {displayedOffres.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: textSecondary }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px', color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                            {icons.clipboard}
                        </div>
                        <p style={{ fontSize: '18px' }}>
                            {user?.role === 'Recruteur' ? 'Vous n\'avez pas encore créé d\'offre' : showAllOffers ? 'Aucune offre disponible pour le moment' : 'Vous avez postulé à toutes les offres disponibles !'}
                        </p>
                        {user?.role === 'Etudiant' && !showAllOffers && (
                            <button onClick={() => setShowAllOffers(true)} style={{ marginTop: '15px', padding: '10px 25px', background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff', color: '#5b5ef7', border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #c7d2fe', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', margin: '15px auto 0' }}>
                                {icons.eye} Voir toutes les offres (y compris celles déjà postulées)
                            </button>
                        )}
                    </div>
                ) : (
                    displayedOffres.map(offre => (
    <div key={offre._id} style={{ 
        background: cardBg, 
        border: cardBorder, 
        borderRadius: '16px', 
        padding: '25px', 
        transition: 'all 0.3s ease', 
        boxShadow: cardShadow,
        opacity: offre.recruteurBlocked ? 0.75 : 1,
        position: 'relative'
    }}>
        {/* Blocked Recruiter Badge */}
        {offre.recruteurBlocked && (
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#ef4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 1,
                height: '30px'
            }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
                Recruteur bloqué
            </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
            <div>
                <h3 style={{ fontSize: '20px', marginBottom: '5px', color: textPrimary }}>{offre.titre}</h3>
                <p style={{ color: '#5b5ef7', fontSize: '14px' }}>{offre.entreprise} • {offre.localisation}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ background: offre.statut === 'active' ? (isDark ? 'rgba(40, 167, 69, 0.2)' : '#f0fdf4') : (isDark ? 'rgba(255, 107, 107, 0.2)' : '#fef2f2'), color: offre.statut === 'active' ? '#28a745' : '#ff6b6b', padding: '5px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                    {offre.statut === 'active' ? 'Active' : 'Fermée'}
                </span>
                <span style={{ background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff', color: '#5b5ef7', padding: '5px 12px', borderRadius: '12px', fontSize: '12px' }}>{offre.typeContrat}</span>
            </div>
        </div>
        
        <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280', marginBottom: '15px', lineHeight: '1.6' }}>
            {offre.description.length > 200 ? offre.description.substring(0, 200) + '...' : offre.description}
        </p>
        
        {offre.salaire && <p style={{ color: '#28a745', marginBottom: '15px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>{icons.dollar} {offre.salaire}</p>}
        

        {user?.role === 'Recruteur' && (
            <p style={{ color: textSecondary, marginBottom: '15px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                {icons.users} 
                <span style={{ 
                    fontWeight: 'bold', 
                    margin: '0 6px',
                    // Le texte devient vert si le quota est atteint
                    color: (offre.candidatures?.filter(c => c.statut === 'embauche_acceptee').length || 0) >= (offre.nombrePostes || 1) 
                        ? '#28a745' 
                        : textPrimary 
                }}>
                    {offre.candidatures ? offre.candidatures.filter(c => c.statut === 'embauche_acceptee').length : 0} / {offre.nombrePostes || 1}
                </span> 
                postes pourvus
            </p>
        )}


        {offre.competences && offre.competences.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {offre.competences.map((skill, index) => (
                    <span key={index} style={{ background: skillBg, color: skillColor, padding: '4px 10px', borderRadius: '8px', fontSize: '12px' }}>{skill}</span>
                ))}
            </div>
        )}
        
        {/* Warning message for blocked recruiter */}
        {offre.recruteurBlocked && (
            <div style={{
                marginBottom: '15px',
                padding: '12px',
                background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #fecaca',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <span style={{ color: '#ef4444', fontSize: '20px' }}>⚠️</span>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#7f1d1d', fontSize: '13px' }}>
                    Ce recruteur est actuellement bloqué. Les candidatures sont temporairement suspendues.
                </span>
            </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px', borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #f3f4f6', paddingTop: '15px' }}>
            {user?.role === 'Recruteur' && (
                <>
                    <button onClick={() => handleEdit(offre)} style={{ padding: '8px 20px', background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff', color: '#5b5ef7', border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #c7d2fe', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>{icons.edit} Modifier</button>
                    <button onClick={() => handleDelete(offre._id)} style={{ padding: '8px 20px', background: isDark ? 'rgba(255, 107, 107, 0.2)' : '#fee2e2', color: '#ff6b6b', border: isDark ? '1px solid rgba(255, 107, 107, 0.3)' : '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>{icons.trash} Supprimer</button>
                </>
            )} 
            {user?.role === 'Etudiant' && (
                appliedOfferIds.has(offre._id) ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ background: isDark ? 'rgba(40, 167, 69, 0.2)' : '#f0fdf4', color: '#28a745', padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>{icons.checkCircle} Déjà postulé</span>
                        <button onClick={() => navigate('/dashboard/moffres')} style={{ padding: '10px 20px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6', color: textPrimary, border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>{icons.clipboard && React.createElement('svg', {width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', style: {display: 'inline-block', verticalAlign: 'middle', marginRight: 4}}, React.createElement('path', {d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'}), React.createElement('rect', {x: 8, y: 2, width: 8, height: 4, rx: 1, ry: 1}))} Voir ma candidature</button>
                    </div>
                ) : (
                    <button 
                        onClick={() => { 
                            if (!offre.recruteurBlocked) {
                                setSelectedOffre(offre); 
                                setShowApplyModal(true);
                            }
                        }} 
                        disabled={offre.recruteurBlocked}
                        style={{ 
                            padding: '10px 30px', 
                            background: offre.recruteurBlocked 
                                ? (isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0')
                                : 'linear-gradient(135deg, #5b5ef7, #4f46e5)', 
                            color: offre.recruteurBlocked 
                                ? (isDark ? 'rgba(255, 255, 255, 0.3)' : '#94a3b8')
                                : 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: offre.recruteurBlocked ? 'not-allowed' : 'pointer', 
                            fontSize: '14px', 
                            fontWeight: 'bold', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            opacity: offre.recruteurBlocked ? 0.6 : 1,
                            transition: 'all 0.3s'
                        }}
                        title={offre.recruteurBlocked ? "Le recruteur est bloqué, vous ne pouvez pas postuler pour le moment" : "Postuler à cette offre"}
                    >
                        {offre.recruteurBlocked ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                                </svg>
                                Recruteur indisponible
                            </>
                        ) : (
                            <>
                                {icons.document} Postuler
                            </>
                        )}
                    </button>
                )
            )}
            {user?.role === 'admin' && (
                <>
                    <button onClick={() => handleEdit(offre)} style={{ padding: '8px 20px', background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff', color: '#5b5ef7', border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #c7d2fe', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>{icons.edit} Modifier</button>
                    <button onClick={() => handleDelete(offre._id)} style={{ padding: '8px 20px', background: isDark ? 'rgba(255, 107, 107, 0.2)' : '#fee2e2', color: '#ff6b6b', border: isDark ? '1px solid rgba(255, 107, 107, 0.3)' : '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>{icons.trash} Supprimer</button>
                </>
            )}
        </div>
    </div>
))
                )}
            </div>
            {showAutoApplyModal && autoApplyResults && (
                <AutoApplyResultsModal results={autoApplyResults} onClose={() => { setShowAutoApplyModal(false); setAutoApplyResults(null); }} />
            )}
        </div>
    );
}

export default Offres;