import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';

function Profile() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [cvInfo, setCvInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accountInfo, setAccountInfo] = useState(null);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [editForm, setEditForm] = useState({ prenom: '', nom: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [recruiterStats, setRecruiterStats] = useState({
        activeJobs: 0,
        totalCandidates: 0
    });

    // SVG Icons
    const icons = {
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
        lock: (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        ),
        document: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
        ),
        eye: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        ),
        edit: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        ),
        folder: (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
        ),
        building: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
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
        users: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        settings: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
        ),
        key: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
        ),
        logout: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
        ),
        save: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
            </svg>
        ),
        checkCircle: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        clipboard: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
        ),
    };

    const fetchRecruiterStats = async (recruiterId) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/offres/recruteur/${recruiterId}`);
            const offres = await res.json();
            
            const activeOffres = offres.filter(o => o.statut === 'active').length;
            
            let totalCandidates = 0;
            offres.forEach(offre => {
                totalCandidates += offre.candidatures?.length || 0;
            });
            
            setRecruiterStats({
                activeJobs: activeOffres,
                totalCandidates: totalCandidates
            });
            
        } catch (err) {
            console.error("Error fetching recruiter stats:", err);
        }
    };

    const fetchUserInfo = async (userId) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/users/${userId}`);
            const userData = await res.json();
            console.log("Fetched user data from server:", userData);
            setAccountInfo(userData);
            return userData;
        } catch (err) {
            console.error("Error fetching user info:", err);
        }
    };

    const fetchCVInfo = async (userId) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/users`);
            
            if (!res.ok) {
                console.error("Failed to fetch users:", res.status);
                return;
            }
            
            const users = await res.json();
            const currentUser = users.find(u => u._id === userId);
            
            if (currentUser && currentUser.cv && currentUser.cv.filename) {
                setCvInfo(currentUser.cv);
            } else {
                setCvInfo(null);
            }
        } catch (err) {
            console.error("Error fetching CV:", err);
            setCvInfo(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                console.log("User from localStorage:", parsedUser);
                setUser(parsedUser);
                
                fetchUserInfo(parsedUser.id);
                
                if (parsedUser.role === 'Etudiant') {
                    fetchCVInfo(parsedUser.id);
                } else if (parsedUser.role === 'Recruteur') {
                    fetchRecruiterStats(parsedUser.id);
                    setLoading(false);
                } else if (parsedUser.role === 'admin') {
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error parsing user data:", err);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const handleViewCV = () => {
        if (user && user.id) {
            window.open(`https://pfe-backend-five.vercel.app/users/${user.id}/cv`, '_blank');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleEditProfile = () => {
        setEditForm({ prenom: user.prenom, nom: user.nom });
        setShowEditProfile(true);
    };

    const handleSaveProfile = async () => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prenom: editForm.prenom, nom: editForm.nom })
            });
            const data = await res.json();
            
            if (res.ok) {
                const updatedUser = { ...user, prenom: editForm.prenom, nom: editForm.nom };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setShowEditProfile(false);
                setMessage(' Profile mis à jour avec succès!');
                setMessageType('success');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            setMessage('❌ Error updating profile');
            setMessageType('error');
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage('❌ Passwords do not match');
            setMessageType('error');
            return;
        }
        
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/users/${user.id}/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    currentPassword: passwordForm.currentPassword, 
                    newPassword: passwordForm.newPassword 
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                setShowChangePassword(false);
                setMessage('Mot de passe changé avec succès!');
                setMessageType('success');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(`❌ ${data.error}`);
                setMessageType('error');
            }
        } catch (err) {
            setMessage('❌ Erreur changeant le mot de passe');
            setMessageType('error');
        }
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
                color: isDark ? 'white' : '#1e293b',
                fontSize: '18px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '20px', color: isDark ? 'rgba(255,255,255,0.3)' : '#a39a92' }}>
                        {icons.spinner}
                    </div>
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
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
                    <h2 style={{ color: isDark ? 'white' : '#0f172a', marginBottom: '8px' }}>Access Restricted</h2>
                    <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b', marginBottom: '24px' }}>Please log in first to view your profile</p>
                    <button 
                        onClick={() => navigate('/login')}
                        style={{
                            marginTop: '20px',
                            padding: '12px 30px',
                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const isStudent = user.role === 'Etudiant';
    const isRecruiter = user.role === 'Recruteur';
    const isAdmin = user.role === 'admin';


    const safeMessageStr = String(message?.props?.children || message);
const isErrorMessage = safeMessageStr.includes('Erreur') || safeMessageStr.includes('Impossible');

    return (
        <div>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ 
                    color: isDark ? 'white' : '#0f172a', 
                    fontSize: '32px', 
                    marginBottom: '10px',
                    fontWeight: '600'
                }}>
                    My Profile
                </h1>
                <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b', fontSize: '16px' }}>
                    Manage your account and settings
                </p>
            </div>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <div style={{
                    flex: '1',
                    minWidth: '300px',
                    background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                    backdropFilter: isDark ? 'blur(10px)' : 'none',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '30px',
                    boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: isAdmin 
                                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                : isRecruiter 
                                ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
                                : 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            {user.prenom?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 style={{ color: isDark ? 'white' : '#0f172a', fontSize: '24px', marginBottom: '5px' }}>
                                {user.prenom} {user.nom}
                            </h2>
                            <span style={{
                                display: 'inline-block',
                                background: isAdmin
                                    ? (isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7')
                                    : isRecruiter 
                                    ? (isDark ? 'rgba(255, 107, 107, 0.2)' : '#fee2e2')
                                    : (isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff'),
                                color: isAdmin ? '#22c55e' : isRecruiter ? '#ff6b6b' : '#6c63ff',
                                padding: '5px 15px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div style={{ 
                        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                        paddingTop: '20px'
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ 
                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                fontSize: '12px',
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                EMAIL
                            </label>
                            <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '16px' }}>
                                {user.email}
                            </p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ 
                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                fontSize: '12px',
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                PRENOM
                            </label>
                            <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '16px' }}>
                                {user.prenom}
                            </p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ 
                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                fontSize: '12px',
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                NOM
                            </label>
                            <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '16px' }}>
                                {user.nom}
                            </p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ 
                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                fontSize: '12px',
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                TYPE DE COMPTE
                            </label>
                            <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '16px', textTransform: 'capitalize' }}>
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{
                    flex: '1',
                    minWidth: '300px',
                    background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                    backdropFilter: isDark ? 'blur(10px)' : 'none',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '30px',
                    boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                }}>
                    {isStudent && (
                        <>
                            <h3 style={{ 
                                color: isDark ? 'white' : '#0f172a', 
                                fontSize: '20px', 
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ color: '#6c63ff' }}>{icons.document}</span> Mon CV
                            </h3>

                            {cvInfo ? (
                                <div>
                                    <div style={{
                                        background: isDark ? 'rgba(108, 99, 255, 0.1)' : '#f5f3ff',
                                        border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #ddd6fe',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ 
                                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                                fontSize: '12px',
                                                display: 'block',
                                                marginBottom: '5px',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                NOM FICHIER
                                            </label>
                                            <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '14px' }}>
                                                {cvInfo.originalName || cvInfo.filename}
                                            </p>
                                        </div>
                                        
                                        {cvInfo.uploadDate && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <label style={{ 
                                                    color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    marginBottom: '5px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    TELECHARGE LE 
                                                </label>
                                                <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '14px' }}>
                                                    {new Date(cvInfo.uploadDate).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={handleViewCV}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            {icons.eye} Voir CV
                                        </button>
                                        
                                        <button
                                            onClick={() => navigate('/dashboard/cvupload')}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                                color: isDark ? 'white' : '#1e293b',
                                                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9';
                                            }}
                                        >
                                            {icons.edit} Modifier CV
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px'
                                }}>
                                    <div style={{ fontSize: '50px', marginBottom: '20px', color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                        {icons.folder}
                                    </div>
                                    <p style={{ 
                                        color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b', 
                                        marginBottom: '20px',
                                        fontSize: '14px'
                                    }}>
                                        Aucun CV téléchargé pour le moment
                                    </p>
                                    <button
                                        onClick={() => navigate('/dashboard/cvupload')}
                                        style={{
                                            padding: '12px 30px',
                                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Télécharger votre CV
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {isRecruiter && (
                        <>
                            <h3 style={{ 
                                color: isDark ? 'white' : '#0f172a', 
                                fontSize: '20px', 
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ color: '#ff6b6b' }}>{icons.building}</span> Info entreprise
                            </h3>

                            <div style={{
                                background: isDark ? 'rgba(255, 107, 107, 0.1)' : '#fef2f2',
                                border: isDark ? '1px solid rgba(255, 107, 107, 0.3)' : '1px solid #fecaca',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                        fontSize: '12px',
                                        display: 'block',
                                        marginBottom: '5px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        RECRUTEUR DEPUIS
                                    </label>
                                    <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '14px' }}>
                                        {accountInfo?.dateCreation 
                                            ? new Date(accountInfo.dateCreation).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : user?.dateCreation
                                            ? new Date(user.dateCreation).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'Date inconnue'
                                        }
                                    </p>
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                        fontSize: '12px',
                                        display: 'block',
                                        marginBottom: '5px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        OFFRES DE STAGE ACTIVES
                                    </label>
                                    <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '14px' }}>
                                        {recruiterStats.activeJobs}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                        fontSize: '12px',
                                        display: 'block',
                                        marginBottom: '5px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        TOTAL CANDIDATURES
                                    </label>
                                    <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '14px' }}>
                                        {recruiterStats.totalCandidates}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => navigate('/dashboard/offres')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {icons.clipboard} Gérer les offres de stage
                                </button>
                                
                                <button
                                    onClick={() => navigate('/dashboard/candidates')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                        color: isDark ? 'white' : '#1e293b',
                                        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9';
                                    }}
                                >
                                    {icons.users} Voir Candidats
                                </button>
                            </div>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <h3 style={{ 
                                color: isDark ? 'white' : '#0f172a', 
                                fontSize: '20px', 
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ color: '#22c55e' }}>{icons.settings}</span> Panneau d'Administration
                            </h3>

                            <div style={{
                                background: isDark ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4',
                                border: isDark ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid #bbf7d0',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                        fontSize: '12px',
                                        display: 'block',
                                        marginBottom: '5px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        STATUT DU COMPTE
                                    </label>
                                    <p style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                                        {icons.checkCircle} Super Administrateur Actif
                                    </p>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                        fontSize: '12px',
                                        display: 'block',
                                        marginBottom: '5px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        CRÉÉ LE
                                    </label>
                                    <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '14px', margin: 0 }}>
                                        {accountInfo?.dateCreation 
                                            ? new Date(accountInfo.dateCreation).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : user?.dateCreation
                                            ? new Date(user.dateCreation).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'Date inconnue'
                                        }
                                    </p>
                                </div>
                                
                                <div>
                                    <label style={{ 
                                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', 
                                        fontSize: '12px',
                                        display: 'block',
                                        marginBottom: '5px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        NIVEAU D'ACCÈS
                                    </label>
                                    <p style={{ color: isDark ? 'white' : '#1e293b', fontSize: '14px', margin: 0 }}>
                                        Gestion totale des utilisateurs et supervision globale du système.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => navigate('/dashboard/users')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {icons.users} Gérer Utilisateurs
                                </button>
                                
                                <button
                                    onClick={() => navigate('/dashboard/statistics')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                        color: isDark ? 'white' : '#1e293b',
                                        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9';
                                    }}
                                >
                                    {icons.clipboard} Statistiques
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div style={{
                marginTop: '30px',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                backdropFilter: isDark ? 'blur(10px)' : 'none',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
            }}>
                <h3 style={{ 
                    color: isDark ? 'white' : '#0f172a', 
                    fontSize: '20px', 
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}>{icons.settings}</span> Actions sur compte
                </h3>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={handleEditProfile}
                        style={{
                            padding: '10px 20px',
                            background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                            color: isDark ? 'white' : '#1e293b',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {icons.edit} Editer Profile
                    </button>
                    
                    <button onClick={() => setShowChangePassword(true)}
                        style={{
                            padding: '10px 20px',
                            background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                            color: isDark ? 'white' : '#1e293b',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {icons.key} Changer MotDePasse
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '10px 20px',
                            background: isDark ? 'rgba(255, 107, 107, 0.1)' : '#fee2e2',
                            color: '#ff6b6b',
                            border: isDark ? '1px solid rgba(255, 107, 107, 0.3)' : '1px solid #fecaca',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {icons.logout} Deconnexion
                    </button>
                </div>
            </div>

            {/* Toast Message */}
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

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: isDark ? 'linear-gradient(135deg, #1e1e2d, #2d2d44)' : '#ffffff',
                        borderRadius: '20px', padding: '30px', width: '400px',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: isDark ? 'white' : '#0f172a', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {icons.edit} Edit Profile
                        </h3>
                        <input 
                            style={{
                                width: '100%', padding: '12px 16px', marginBottom: '12px',
                                background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                                borderRadius: '10px', color: isDark ? 'white' : '#1e293b', fontSize: '14px', outline: 'none'
                            }}
                            placeholder="First Name" 
                            value={editForm.prenom}
                            onChange={e => setEditForm({...editForm, prenom: e.target.value})} 
                        />
                        <input 
                            style={{
                                width: '100%', padding: '12px 16px', marginBottom: '12px',
                                background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                                borderRadius: '10px', color: isDark ? 'white' : '#1e293b', fontSize: '14px', outline: 'none'
                            }}
                            placeholder="Last Name" 
                            value={editForm.nom}
                            onChange={e => setEditForm({...editForm, nom: e.target.value})} 
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button 
                                onClick={handleSaveProfile}
                                style={{
                                    flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                    color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                                    fontWeight: 'bold', fontSize: '14px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: '6px'
                                }}
                            >
                                {icons.save} Save
                            </button>
                            <button 
                                onClick={() => setShowEditProfile(false)}
                                style={{
                                    padding: '12px 20px',
                                    background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                                    color: isDark ? 'white' : '#1e293b',
                                    border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1',
                                    borderRadius: '10px', cursor: 'pointer', fontSize: '14px'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showChangePassword && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: isDark ? 'linear-gradient(135deg, #1e1e2d, #2d2d44)' : '#ffffff',
                        borderRadius: '20px', padding: '30px', width: '400px',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: isDark ? 'white' : '#0f172a', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {icons.key} Change Password
                        </h3>
                        <input 
                            type="password"
                            style={{
                                width: '100%', padding: '12px 16px', marginBottom: '12px',
                                background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                                borderRadius: '10px', color: isDark ? 'white' : '#1e293b', fontSize: '14px', outline: 'none'
                            }}
                            placeholder="Current Password" 
                            value={passwordForm.currentPassword}
                            onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                        />
                        <input 
                            type="password"
                            style={{
                                width: '100%', padding: '12px 16px', marginBottom: '12px',
                                background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                                borderRadius: '10px', color: isDark ? 'white' : '#1e293b', fontSize: '14px', outline: 'none'
                            }}
                            placeholder="New Password" 
                            value={passwordForm.newPassword}
                            onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                        />
                        <input 
                            type="password"
                            style={{
                                width: '100%', padding: '12px 16px', marginBottom: '12px',
                                background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                                borderRadius: '10px', color: isDark ? 'white' : '#1e293b', fontSize: '14px', outline: 'none'
                            }}
                            placeholder="Confirm New Password" 
                            value={passwordForm.confirmPassword}
                            onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button 
                                onClick={handleChangePassword}
                                style={{
                                    flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                    color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                                    fontWeight: 'bold', fontSize: '14px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: '6px'
                                }}
                            >
                                {icons.key} Update Password
                            </button>
                            <button 
                                onClick={() => setShowChangePassword(false)}
                                style={{
                                    padding: '12px 20px',
                                    background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                                    color: isDark ? 'white' : '#1e293b',
                                    border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1',
                                    borderRadius: '10px', cursor: 'pointer', fontSize: '14px'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;