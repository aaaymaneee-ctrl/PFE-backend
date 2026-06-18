import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext.jsx';
import { MdDashboard, MdFileUpload, MdBusinessCenter, MdAssignment, MdCalendarToday, MdPerson, MdLightMode, MdDarkMode, MdLogout, MdConfirmationNumber,MdHandshake,MdWork,MdPeople,MdVideoCall,MdInsertChart } from 'react-icons/md';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, [location.pathname]);
    
    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const studentLinks = [
        { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
        { path: '/dashboard/cvupload', icon: MdFileUpload, label: 'Dépôt du CV' },
        { path: '/dashboard/offres', icon: MdBusinessCenter, label: 'Offres de stage' },
        { path: '/dashboard/moffres', icon: MdAssignment, label: 'Mes candidatures' },
        { path: '/dashboard/espentretien', icon: MdCalendarToday, label: 'Espace entretiens' },
        { path: '/dashboard/propositions', icon: MdHandshake, label: 'Propositions Finales' }, // NOUVEAU
        { path: '/dashboard/profile', icon: MdPerson, label: 'Profil' }
    ];

    const recruiterLinks = [
        { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
        { path: '/dashboard/offres', icon: MdWork, label: 'Mes offres' }, // Corrigé : MdWork au lieu de MdFileUpload
        { path: '/dashboard/candidats', icon: MdPeople, label: 'Candidats' }, // Corrigé : MdPeople au lieu de MdPerson
        { path: '/dashboard/entretien-rec', icon: MdVideoCall, label: 'Espace entretiens' }, // Corrigé : MdVideoCall au lieu de MdPerson
        { path: '/dashboard/propositions', icon: MdHandshake, label: 'Suivi des embauches' }, // NOUVEAU
        { path: '/dashboard/profile', icon: MdPerson, label: 'Profil' }
    ];

    const adminLinks = [
        { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
        { path: '/dashboard/users', icon: MdPeople, label: 'Utilisateurs' }, // Corrigé : MdPeople
        { path: '/dashboard/offres', icon: MdBusinessCenter, label: 'Gestion des offres' },
        { path: '/dashboard/statistics', icon: MdInsertChart, label: 'Statistiques' }, // Corrigé : MdInsertChart au lieu de MdDashboard
        { path: '/dashboard/profile', icon: MdPerson, label: 'Profil' },
    ];

    let navLinks = [];
    if (user?.role === 'Recruteur') {navLinks = recruiterLinks;}
    else if (user?.role === 'admin') {navLinks = adminLinks;}
    else if (user?.role === 'Etudiant') {navLinks = studentLinks;}
    else {navLinks = [];}
    return (
        <nav 
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
            width: isHovering ? '280px' : '95px',
            minWidth: isHovering ? '280px' : '95px',
            maxWidth: isHovering ? '280px' : '95px',
            height: '100vh',
            background: isDark ? 'rgba(0, 0, 0, 0.4)' : '#ffffff',
            backdropFilter: isDark ? 'blur(20px)' : 'none',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            transition: 'all 0.3s ease'
        }}>
                {user && (
                    <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    paddingBottom: '20px',
                    marginBottom: '20px',
                    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    flexDirection: isHovering ? 'row' : 'column',
                    justifyContent: isHovering ? 'flex-start' : 'center'
                }}>
                    {/* 1. La couleur de l'avatar */}
                    <div style={{
                        width: '50px',
                        height: '50px',
                        minWidth: '50px',
                        flexShrink: 0,
                        background: user.role === 'admin'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : user.role === 'Recruteur' 
                                ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
                                : 'linear-gradient(135deg, #6c63ff, #4834d4)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {user.prenom?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>

                    {isHovering && (
                        <div style={{ overflow: 'hidden' }}>
                            <h3 style={{
                                color: isDark ? 'white' : '#0f1419',
                                fontSize: '16px',
                                margin: '0 0 5px 0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                opacity: isHovering ? 1 : 0,
                                maxWidth: isHovering ? '200px' : '0px',
                                transition: 'opacity 0.3s ease, maxWidth 0.3s ease'
                            }}>
                                {user.prenom} {user.nom}
                            </h3>
                            
                            {/* 2. La couleur du badge de rôle */}
                            <span style={{
                                display: 'inline-block',
                                background: user.role === 'admin'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : user.role === 'Recruteur' 
                                        ? 'rgba(255, 107, 107, 0.2)' 
                                        : 'rgba(108, 99, 255, 0.2)',
                                color: user.role === 'admin'
                                    ? '#10b981'
                                    : user.role === 'Recruteur' ? '#ff6b6b' : '#6c63ff',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500'
                            }}>
                                {user.role}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '5px',
                flex: 1 
            }}>
                {navLinks.map((link) => {
    // 1. Couleurs par défaut (Étudiant - Bleu/Indigo)
    let activeBg = 'linear-gradient(135deg, #6c63ff, #4834d4)';
    let hoverBg = isDark ? 'rgba(108, 99, 255, 0.1)' : '#eef2ff';

    // 2. Couleurs pour l'Admin (Vert)
    if (user?.role === 'admin') {
        activeBg = 'linear-gradient(135deg, #10b981, #059669)';
        hoverBg = isDark ? 'rgba(16, 185, 129, 0.1)' : '#d1fae5';
    } 
    // 3. Couleurs pour le Recruteur (Rouge/Orange comme dans votre code)
    else if (user?.role === 'Recruteur') {
        activeBg = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
        hoverBg = isDark ? 'rgba(255, 107, 107, 0.1)' : '#fee2e2';
    }

    return (
        <Link 
            key={link.path}
            to={link.path}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                color: isActive(link.path) 
                    ? 'white' 
                    : isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                textDecoration: 'none',
                borderRadius: '10px',
                background: isActive(link.path) ? activeBg : 'transparent',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
                if (!isActive(link.path)) {
                    e.currentTarget.style.background = hoverBg;
                    e.currentTarget.style.color = isDark ? 'white' : '#0f1419';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive(link.path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280';
                }
            }}
        >
            <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>
                <link.icon size={24} />
            </span>
            {isHovering && link.label}
        </Link>
    );
})}
            </div>

            <button 
                onClick={toggleTheme}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 15px',
                    color: isDark ? '#ffc107' : '#5b5ef7',
                    background: isDark ? 'rgba(255, 193, 7, 0.08)' : 'rgba(91, 94, 247, 0.08)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    marginBottom: '10px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark 
                        ? 'rgba(255, 193, 7, 0.15)' 
                        : 'rgba(108, 99, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDark 
                        ? 'rgba(255, 193, 7, 0.08)' 
                        : 'rgba(91, 94, 247, 0.08)';
                }}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>
                    {isDark ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
                </span>
                {isHovering && (isDark ? 'Light Mode' : 'Dark Mode')}
            </button>

            <button 
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 15px',
                    color: '#ff6b6b',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%',
                    marginTop: 'auto',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark 
                        ? 'rgba(255, 107, 107, 0.1)'
                        : 'rgba(255, 107, 107, 0.08)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                }}
            >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>
                    <MdLogout size={24} />
                </span>
                {isHovering && 'Logout'}
            </button>
        </nav>
    );
}

export default Sidebar;