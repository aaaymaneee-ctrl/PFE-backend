// dashboard.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext.jsx';

function Dashboard() { 
    const [loading, setLoading] = useState(true);
    const { isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        activeOffres: 0,
        totalCandidates: 0,
        scheduledInterviews: 0,
        positionsFilled: 0,
        activeApplications: 0,
        upcomingInterviews: 0,
        savedOffers: 0,
        completedAssessments: 0
    });
    const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalRecruiters: 0,
    totalOffers: 0,
    activeOffers: 0,
    totalApplications: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentOffers, setRecentOffers] = useState([]);
  
  
    useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const parsedUser = JSON.parse(userData);
            console.log("User from localStorage:", parsedUser);
            setUser(parsedUser);
            
            // Fetch user info for all roles
            fetchUserInfo(parsedUser.id);
            
            if (parsedUser.role === 'Etudiant') {
                fetchCVInfo(parsedUser.id);
                fetchStudentStats(parsedUser.id);
                setLoading(false); // Add this
            } else if (parsedUser.role === 'Recruteur') {
                fetchRecruiterStats(parsedUser.id);
                setLoading(false);
            } else if (parsedUser.role === 'admin') {
                fetchAdminStats();
                setLoading(false);
            } else {
                setLoading(false); // Fallback for unknown roles
            }
        } catch (err) {
            console.error("Error parsing user data:", err);
            setLoading(false);
        }
    } else {
        setLoading(false);
    }
}, []);

    const fetchDashboardStats = async (userData) => {
        if (userData.role === 'Recruteur') {
            await fetchRecruiterStats(userData.id);
        } else if (userData.role === 'Etudiant') {
            await fetchStudentStats(userData.id);
        }
    };

    const fetchUserInfo = async (userId) => {
    try {
        const res = await fetch(`http://localhost:3000/users/${userId}`);
        const userData = await res.json();
        console.log("Fetched user data from server:", userData);
        // If you need to update user data, uncomment the next line:
        // setUser(userData);
        return userData;
    } catch (err) {
        console.error("Error fetching user info:", err);
    }
};

const fetchCVInfo = async (userId) => {
    try {
        const res = await fetch(`http://localhost:3000/users`);
        
        if (!res.ok) {
            console.error("Failed to fetch users:", res.status);
            setLoading(false);
            return;
        }
        
        const users = await res.json();
        const currentUser = users.find(u => u._id === userId);
        
        // Just fetch CV info, no need to set state unless you're using it
        console.log("CV Info fetched:", currentUser?.cv);
        
    } catch (err) {
        console.error("Error fetching CV:", err);
    } finally {
        setLoading(false); // Add this to ensure loading stops for students
    }
};

    const fetchAdminStats = async () => {
    try {
        // Fetch all users
        const usersRes = await fetch('http://localhost:3000/users');
        const users = await usersRes.json();
        
        const totalUsers = users.length;
        const totalStudents = users.filter(u => u.role === 'Etudiant').length;
        const totalRecruiters = users.filter(u => u.role === 'Recruteur').length;
        
        // Fetch all offers
        const offersRes = await fetch('http://localhost:3000/offres');
        const offers = await offersRes.json();
        
        const totalOffers = offers.length;
        const activeOffers = offers.filter(o => o.statut === 'active').length;
        
        // Calculate total applications
        let totalApplications = 0;
        offers.forEach(offer => {
            totalApplications += offer.candidatures?.length || 0;
        });
        
        // Get recent users (last 5)
        const sortedUsers = users.sort((a, b) => 
            new Date(b.dateCreation) - new Date(a.dateCreation)
        );
        setRecentUsers(sortedUsers.slice(0, 5));
        
        // Get recent offers (last 5)
        const sortedOffers = offers.sort((a, b) => 
            new Date(b.dateCreation) - new Date(a.dateCreation)
        );
        setRecentOffers(sortedOffers.slice(0, 5));
        
        setAdminStats({
            totalUsers,
            totalStudents,
            totalRecruiters,
            totalOffers,
            activeOffers,
            totalApplications
        });
        
    } catch (err) {
        console.error("Error fetching admin stats:", err);
    }
};
  const fetchRecruiterStats = async (recruiterId) => {
        try {
            const res = await fetch(`http://localhost:3000/stats/recruteur/${recruiterId}`);
            const statsData = await res.json();
            
            if (statsData.isBlocked) {
                setStats(prev => ({ ...prev, activeOffres: 0, totalCandidates: 0, scheduledInterviews: 0, positionsFilled: 0 }));
                return;
            }

            // On récupère les offres pour compter précisément les étudiants embauchés
            const offresRes = await fetch(`http://localhost:3000/offres/recruteur/${recruiterId}`);
            const offres = await offresRes.json();
            
            let realPositionsFilled = 0;
            offres.forEach(offre => {
                realPositionsFilled += offre.candidatures?.filter(c => c.statut === 'embauché').length || 0;
            });
            
            setStats({
                activeOffres: statsData.activeOffres,
                totalCandidates: statsData.totalCandidates,
                scheduledInterviews: statsData.scheduledInterviews,
                positionsFilled: realPositionsFilled // Mise à jour de la variable existante
            });
            
        } catch (err) {
            console.error("Error fetching recruiter stats:", err);
        }
    };

    const fetchStudentStats = async (studentId) => {
        try {
            const res = await fetch('http://localhost:3000/offres');
            const offres = await res.json();
            
            let activeApplications = 0;
            let upcomingInterviews = 0;
            let completedAssessments = 0; // Sera utilisé pour les postes décrochés
            
            offres.forEach(offre => {
                const studentApplications = offre.candidatures?.filter(
                    c => c.etudiantId === studentId || c.etudiantId?._id === studentId
                );
                
                if (studentApplications) {
                    activeApplications += studentApplications.filter(
                        c => c.statut === 'en attente' || c.statut === 'evaluation_en_cours'
                    ).length;
                    
                    upcomingInterviews += studentApplications.filter(
                        c => c.statut === 'acceptée' && 
                        (!c.scoreEntretien || c.scoreEntretien === null)
                    ).length;
                    
                    // RECALCUL : On compte les candidatures embauchées
                    completedAssessments += studentApplications.filter(
                        c => c.statut === 'embauché'
                    ).length;
                }
            });
            
            setStats({
                activeApplications,
                upcomingInterviews,
                savedOffers: offres.length,
                completedAssessments // Contient maintenant les postes décrochés
            });
            
        } catch (err) {
            console.error("Error fetching student stats:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // SVG icons
    const icons = {
        document: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
        ),
        calendar: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        ),
        briefcase: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
        ),
        checkCircle: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        users: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        chart: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
        ),
        graduation: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>
            </svg>
        ),
        building: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        clipboard: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
        ),
        mail: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
        ),
    };
    
    if (!user) return (
        <div className="auth-required">
            <div className="auth-card">
                <span className="lock-icon">🔒</span>
                <h2>Access Restricted</h2>
                <p>Please log in first to access your dashboard</p>
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

    const textPrimary = isDark ? 'white' : '#0f172a';
    const textSecondary = isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b';

    return (
        
        <div>
            {loading && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
            height: '50vh',
            color: 'white',
            fontSize: '18px'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
                Loading dashboard...
            </div>
        </div>
            )
        }
            <header className="dashboard-header">
                <h1 style={{ color: textPrimary }}>Welcome back, {user.prenom}! 👋</h1>
                <p className="header-subtitle" style={{ color: textSecondary }}>
                    {user.role === "Etudiant" 
                        ? "Manage your applications and interviews" 
                        : "Manage your job posts and review candidates"}
                </p>
            </header>

            <div className="stats-grid">
                {user.role === "Etudiant" && (
                    <>
                        <div className="stat-card" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="stat-icon" style={{ color: '#6c63ff', marginBottom: '12px' }}>{icons.document}</div>
                            <div className="stat-info">
                                <h3 style={{ color: textPrimary, fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{stats.activeApplications}</h3>
                                <p style={{ color: textSecondary, fontSize: '14px' }}>Active Applications</p>
                            </div>
                        </div>
                        <div className="stat-card" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="stat-icon" style={{ color: '#ff6b6b', marginBottom: '12px' }}>{icons.calendar}</div>
                            <div className="stat-info">
                                <h3 style={{ color: textPrimary, fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{stats.upcomingInterviews}</h3>
                                <p style={{ color: textSecondary, fontSize: '14px' }}>Upcoming Interviews</p>
                            </div>
                        </div>
                        <div className="stat-card" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="stat-icon" style={{ color: '#22c55e', marginBottom: '12px' }}>{icons.briefcase}</div>
                            <div className="stat-info">
                                <h3 style={{ color: textPrimary, fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{stats.savedOffers}</h3>
                                <p style={{ color: textSecondary, fontSize: '14px' }}>Available Offers</p>
                            </div>
                        </div>
                        <div className="stat-card" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="stat-icon" style={{ color: '#e8a87c', marginBottom: '12px' }}>{icons.checkCircle}</div>
                            <div className="stat-info">
                                <h3 style={{ color: textPrimary, fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{stats.completedAssessments}</h3>
                                <p style={{ color: textSecondary, fontSize: '14px' }}>Secured positions</p>
                            </div>
                        </div>
                    </>
                )}
                
                {user.role === "Recruteur" && (
                    <>
                        <div className="stat-card" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="stat-icon" style={{ color: '#6c63ff', marginBottom: '12px' }}>{icons.clipboard}</div>
                            <div className="stat-info">
                                <h3 style={{ color: textPrimary, fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{stats.activeOffres}</h3>
                                <p style={{ color: textSecondary, fontSize: '14px' }}>Active Job Posts</p>
                            </div>
                        </div>
                        <div className="stat-card" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="stat-icon" style={{ color: '#ff6b6b', marginBottom: '12px' }}>{icons.users}</div>
                            <div className="stat-info">
                                <h3 style={{ color: textPrimary, fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{stats.totalCandidates}</h3>
                                <p style={{ color: textSecondary, fontSize: '14px' }}>Total Candidates</p>
                            </div>
                        </div>
                        <div className="stat-card" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="stat-icon" style={{ color: '#22c55e', marginBottom: '12px' }}>{icons.calendar}</div>
                            <div className="stat-info">
                                <h3 style={{ color: textPrimary, fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{stats.scheduledInterviews}</h3>
                                <p style={{ color: textSecondary, fontSize: '14px' }}>Accepted Candidates</p>
                            </div>
                        </div>
                        <div className="stat-card" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div className="stat-icon" style={{ color: '#e8a87c', marginBottom: '12px' }}>{icons.chart}</div>
                            <div className="stat-info">
                                <h3 style={{ color: textPrimary, fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{stats.positionsFilled}</h3>
                                <p style={{ color: textSecondary, fontSize: '14px' }}>Positions Filled</p>
                            </div>
                        </div>
                    </>
                )}
                {user?.role === 'admin' && (
    <>
        {/* Statistics Cards */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        }}>
            {/* Total Users Card */}
            <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ color: '#6c63ff', marginBottom: '10px' }}>{icons.users}</div>
                <div style={{ 
                    color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', 
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '5px'
                }}>
                    Total Users
                </div>
                <div style={{ 
                    color: isDark ? 'white' : '#0f172a', 
                    fontSize: '28px', 
                    fontWeight: 'bold' 
                }}>
                    {adminStats.totalUsers}
                </div>
            </div>

            {/* Students Card */}
            <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ color: '#22c55e', marginBottom: '10px' }}>{icons.graduation}</div>
                <div style={{ 
                    color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', 
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '5px'
                }}>
                    Students
                </div>
                <div style={{ 
                    color: isDark ? 'white' : '#0f172a', 
                    fontSize: '28px', 
                    fontWeight: 'bold' 
                }}>
                    {adminStats.totalStudents}
                </div>
            </div>

            {/* Recruiters Card */}
            <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ color: '#ff6b6b', marginBottom: '10px' }}>{icons.building}</div>
                <div style={{ 
                    color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', 
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '5px'
                }}>
                    Recruiters
                </div>
                <div style={{ 
                    color: isDark ? 'white' : '#0f172a', 
                    fontSize: '28px', 
                    fontWeight: 'bold' 
                }}>
                    {adminStats.totalRecruiters}
                </div>
            </div>

            {/* Active Offers Card */}
            <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ color: '#e8a87c', marginBottom: '10px' }}>{icons.briefcase}</div>
                <div style={{ 
                    color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', 
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '5px'
                }}>
                    Active Offers
                </div>
                <div style={{ 
                    color: isDark ? 'white' : '#0f172a', 
                    fontSize: '28px', 
                    fontWeight: 'bold' 
                }}>
                    {adminStats.activeOffers}
                </div>
            </div>

            {/* Total Offers Card */}
            <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ color: '#6c63ff', marginBottom: '10px' }}>{icons.clipboard}</div>
                <div style={{ 
                    color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', 
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '5px'
                }}>
                    Total Offers
                </div>
                <div style={{ 
                    color: isDark ? 'white' : '#0f172a', 
                    fontSize: '28px', 
                    fontWeight: 'bold' 
                }}>
                    {adminStats.totalOffers}
                </div>
            </div>

            {/* Total Applications Card */}
            <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ color: '#22c55e', marginBottom: '10px' }}>{icons.mail}</div>
                <div style={{ 
                    color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', 
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '5px'
                }}>
                    Applications
                </div>
                <div style={{ 
                    color: isDark ? 'white' : '#0f172a', 
                    fontSize: '28px', 
                    fontWeight: 'bold' 
                }}>
                    {adminStats.totalApplications}
                </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
        }}>
            <button
                onClick={() => navigate('/dashboard/users')}
                style={{
                    padding: '20px',
                    background: isDark 
                        ? 'linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(72, 52, 212, 0.2))' 
                        : 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                    border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #c7d2fe',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    color: isDark ? 'white' : '#1e293b',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
                <span style={{ color: '#6c63ff' }}>{icons.users}</span>
                Manage Users
            </button>

            <button
                onClick={() => navigate('/dashboard/offres')}
                style={{
                    padding: '20px',
                    background: isDark 
                        ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(238, 90, 36, 0.2))' 
                        : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    border: isDark ? '1px solid rgba(255, 107, 107, 0.3)' : '1px solid #fecaca',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    color: isDark ? 'white' : '#1e293b',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
                <span style={{ color: '#ff6b6b' }}>{icons.briefcase}</span>
                Manage Offers
            </button>

            <button
                onClick={() => navigate('/dashboard/statistics')}
                style={{
                    padding: '20px',
                    background: isDark 
                        ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(25, 135, 84, 0.2))' 
                        : 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    border: isDark ? '1px solid rgba(40, 167, 69, 0.3)' : '1px solid #bbf7d0',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    color: isDark ? 'white' : '#1e293b',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
                <span style={{ color: '#22c55e' }}>{icons.chart}</span>
                View Statistics
            </button>
        </div>

        {/* Recent Users Table */}
        {/* Recent Users Table */}
{/* Recent Users Table */}
{recentUsers.length > 0 && (
    <div style={{
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '25px',
        marginBottom: '20px',
        boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
    }}>
        {/* Header with title and button */}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        }}>
            <h4 style={{ 
                color: isDark ? 'white' : '#0f172a', 
                fontSize: '18px', 
                margin: 0,
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <span style={{ color: '#6c63ff' }}>{icons.clipboard}</span>
                Recent Users
            </h4>
            
            {/* See All Button - Top Right */}
            <button 
                onClick={() => navigate('/dashboard/users')}
                style={{
                    padding: '6px 14px',
                    background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                }}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 17 18 12 13 7"/>
                    <polyline points="6 17 11 12 6 7"/>
                </svg>
                See All
            </button>
        </div>
        
        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ 
                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0' 
                    }}>
                        <th style={{ 
                            padding: '12px', 
                            textAlign: 'left', 
                            color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>Name</th>
                        <th style={{ 
                            padding: '12px', 
                            textAlign: 'left', 
                            color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>Email</th>
                        <th style={{ 
                            padding: '12px', 
                            textAlign: 'left', 
                            color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>Role</th>
                        <th style={{ 
                            padding: '12px', 
                            textAlign: 'left', 
                            color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {recentUsers.map((u, index) => (
                        <tr key={u._id || index} style={{ 
                            borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9' 
                        }}>
                            <td style={{ 
                                padding: '12px', 
                                color: isDark ? 'white' : '#1e293b',
                                fontSize: '14px'
                            }}>
                                {u.prenom} {u.nom}
                            </td>
                            <td style={{ 
                                padding: '12px', 
                                color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b',
                                fontSize: '14px'
                            }}>
                                {u.email}
                            </td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    background: u.role === 'Recruteur' 
                                        ? (isDark ? 'rgba(255, 107, 107, 0.2)' : '#fee2e2')
                                        : u.role === 'admin'
                                        ? (isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff')
                                        : (isDark ? 'rgba(40, 167, 69, 0.2)' : '#f0fdf4'),
                                    color: u.role === 'Recruteur' 
                                        ? '#ff6b6b'
                                        : u.role === 'admin'
                                        ? '#6c63ff'
                                        : '#22c55e'
                                }}>
                                    {u.role}
                                </span>
                            </td>
                            <td style={{ 
                                padding: '12px', 
                                color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b',
                                fontSize: '14px'
                            }}>
                                {u.dateCreation 
                                    ? new Date(u.dateCreation).toLocaleDateString('fr-FR')
                                    : 'N/A'
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)}
    </>
)}
            </div>
        </div>
    );
}

export default Dashboard;