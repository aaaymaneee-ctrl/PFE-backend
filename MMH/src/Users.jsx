// Users.jsx - Complete Admin User Management
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

function Users() {
    const { isDark } = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [stats, setStats] = useState(null);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [blockReason, setBlockReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

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
        users: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        search: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
        ),
        trash: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
        ),
        block: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
        ),
        unblock: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M4.93 4.93l14.14 14.14"/>
            </svg>
        ),
        checkCircle: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        warning: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        ),
        student: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>
            </svg>
        ),
        recruiter: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
        ),
        admin: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
            </svg>
        ),
        calendar: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        ),
        briefcase: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
        ),
        document: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
        ),
        refresh: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
        ),
        chevronLeft: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
            </svg>
        ),
        chevronRight: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
            </svg>
        ),
    };

    // Theme-aware styles
    const textPrimary = isDark ? 'white' : '#0f172a';
    const textSecondary = isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b';
    const cardBg = isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff';
    const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0';
    const inputBg = isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc';
    const inputBorder = isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1';
    const modalBg = isDark ? 'linear-gradient(135deg, #1e1e3f, #2c2c54)' : '#ffffff';
    const modalBorder = isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e5e7eb';
    const overlayBg = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)';

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [searchTerm, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (roleFilter !== 'all') params.append('role', roleFilter);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            
            const res = await fetch(`http://localhost:3000/admin/users?${params}`);
            const data = await res.json();
            
            if (res.ok) {
                setUsers(data.users);
            } else {
                setMessage({ text: data.error || 'Erreur lors du chargement', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Erreur de connexion au serveur', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:3000/admin/stats');
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/admin/users/${selectedUser._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage({ text: data.message, type: 'success' });
                fetchUsers();
                fetchStats();
                setShowDeleteModal(false);
                setSelectedUser(null);
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } else {
                setMessage({ text: data.error, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Erreur lors de la suppression', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleBlockUser = async () => {
        if (!selectedUser) return;
        
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/admin/users/${selectedUser._id}/block`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: blockReason || 'Aucune raison fournie' })
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage({ text: data.message, type: 'success' });
                fetchUsers();
                fetchStats();
                setShowBlockModal(false);
                setSelectedUser(null);
                setBlockReason('');
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } else {
                setMessage({ text: data.error, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Erreur lors du blocage', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnblockUser = async (user) => {
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/admin/users/${user._id}/unblock`, {
                method: 'PUT'
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage({ text: data.message, type: 'success' });
                fetchUsers();
                fetchStats();
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } else {
                setMessage({ text: data.error, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Erreur lors du déblocage', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Etudiant': return icons.student;
            case 'Recruteur': return icons.recruiter;
            case 'admin': return icons.admin;
            default: return icons.users;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Etudiant': return '#10b981';
            case 'Recruteur': return '#f59e0b';
            case 'admin': return '#6c63ff';
            default: return '#64748b';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    // Filter pills display
    const activeFiltersCount = (searchTerm ? 1 : 0) + (roleFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ 
                    color: textPrimary, 
                    fontSize: '32px', 
                    marginBottom: '8px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    {icons.users} Gestion des Utilisateurs
                </h1>
                <p style={{ color: textSecondary, fontSize: '16px' }}>
                    Gérez les comptes utilisateurs, bloquez ou supprimez des comptes problématiques
                </p>
            </div>

            {/* Message Toast */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            padding: '14px 20px',
                            marginBottom: '20px',
                            borderRadius: '12px',
                            background: message.type === 'success' 
                                ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4')
                                : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'),
                            border: `1px solid ${message.type === 'success' 
                                ? (isDark ? 'rgba(16, 185, 129, 0.3)' : '#bbf7d0')
                                : (isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca')}`,
                            color: message.type === 'success' ? '#10b981' : '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {message.type === 'success' ? icons.checkCircle : icons.warning}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Cards */}
            {stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '5px',
                    marginBottom: '30px'
                }}>
                    <StatCard 
                        label="Total Utilisateurs" 
                        value={stats.users.total}
                        color="#6c63ff"
                        icon={icons.users}
                        isDark={isDark}
                    />
                    <StatCard 
                        label="Étudiants" 
                        value={stats.users.students}
                        color="#10b981"
                        icon={icons.student}
                        isDark={isDark}
                    />
                    <StatCard 
                        label="Recruteurs" 
                        value={stats.users.recruiters}
                        color="#f59e0b"
                        icon={icons.recruiter}
                        isDark={isDark}
                    />
                    <StatCard 
                        label="Comptes Bloqués" 
                        value={stats.users.blocked}
                        color="#ef4444"
                        icon={icons.block}
                        isDark={isDark}
                    />
                    <StatCard 
                        label="Candidatures" 
                        value={stats.applications.total}
                        color="#ec4899"
                        icon={icons.document}
                        isDark={isDark}
                    />
                </div>
            )}

            {/* Search and Filters Bar */}
            <div style={{
                background: cardBg,
                backdropFilter: isDark ? 'blur(10px)' : 'none',
                border: cardBorder,
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '25px',
                boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search Input */}
                    <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                        <span style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: textSecondary
                        }}>
                            {icons.search}
                        </span>
                        <input
                            type="text"
                            placeholder="Rechercher par nom, prénom ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 15px 12px 40px',
                                borderRadius: '10px',
                                background: inputBg,
                                border: inputBorder,
                                color: textPrimary,
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        style={{
                            padding: '12px 15px',
                            borderRadius: '10px',
                            background: inputBg,
                            border: inputBorder,
                            color: textPrimary,
                            fontSize: '14px',
                            cursor: 'pointer',
                            minWidth: '140px'
                        }}
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="Etudiant">Étudiants</option>
                        <option value="Recruteur">Recruteurs</option>
                        <option value="admin">Administrateurs</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '12px 15px',
                            borderRadius: '10px',
                            background: inputBg,
                            border: inputBorder,
                            color: textPrimary,
                            fontSize: '14px',
                            cursor: 'pointer',
                            minWidth: '140px'
                        }}
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Comptes actifs</option>
                        <option value="blocked">Comptes bloqués</option>
                    </select>

                    {/* Reset Filters Button */}
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setRoleFilter('all');
                                setStatusFilter('all');
                            }}
                            style={{
                                padding: '12px 20px',
                                background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                color: textSecondary,
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s'
                            }}
                        >
                            {icons.refresh} Réinitialiser
                        </button>
                    )}
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                    <div style={{
                        marginTop: '15px',
                        paddingTop: '15px',
                        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        alignItems: 'center'
                    }}>
                        <span style={{ color: textSecondary, fontSize: '13px' }}>Filtres actifs:</span>
                        {searchTerm && (
                            <span style={{
                                background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff',
                                color: '#6c63ff',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                Recherche: "{searchTerm}"
                                <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff' }}>✕</button>
                            </span>
                        )}
                        {roleFilter !== 'all' && (
                            <span style={{
                                background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4',
                                color: '#10b981',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                Rôle: {roleFilter}
                                <button onClick={() => setRoleFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981' }}>✕</button>
                            </span>
                        )}
                        {statusFilter !== 'all' && (
                            <span style={{
                                background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2',
                                color: '#ef4444',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                Statut: {statusFilter === 'blocked' ? 'Bloqués' : 'Actifs'}
                                <button onClick={() => setStatusFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>✕</button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Users Table */}
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '300px',
                    color: textSecondary
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>{icons.spinner}</div>
                        <p>Chargement des utilisateurs...</p>
                    </div>
                </div>
            ) : users.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: cardBg,
                    borderRadius: '16px',
                    border: cardBorder
                }}>
                    <div style={{ fontSize: '50px', marginBottom: '15px', opacity: 0.4 }}>{icons.users}</div>
                    <p style={{ color: textSecondary }}>Aucun utilisateur trouvé</p>
                </div>
            ) : (
                <>
                    <div style={{
                        background: cardBg,
                        backdropFilter: isDark ? 'blur(10px)' : 'none',
                        border: cardBorder,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(200px, 2fr) minmax(200px, 2fr) minmax(100px, 1fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr)',
                            gap: '16px',
                            padding: '16px 20px',
                            background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
                            borderBottom: cardBorder,
                            fontWeight: '600',
                            color: textSecondary,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            <span>Utilisateur</span>
                            <span>Email</span>
                            <span>Rôle</span>
                            <span>Date inscription</span>
                            <span>Statut</span>
                            <span style={{ textAlign: 'center' }}>Actions</span>
                        </div>

                        {/* Table Rows */}
                        {currentUsers.map((user, index) => (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(200px, 2fr) minmax(200px, 2fr) minmax(100px, 1fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr)',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    borderBottom: index < users.length - 1 ? cardBorder : 'none',
                                    alignItems: 'center',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.03)' : '#fafafa';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: `linear-gradient(135deg, ${getRoleColor(user.role)}, ${getRoleColor(user.role)}cc)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '18px',
                                        fontWeight: 'bold'
                                    }}>
                                        {user.prenom?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div style={{ color: textPrimary, fontWeight: '500' }}>
                                            {user.prenom} {user.nom}
                                        </div>
                                        {user.stats && (
                                            <div style={{ color: textSecondary, fontSize: '11px', marginTop: '4px' }}>
                                                {user.role === 'Etudiant' && (
                                                    <span>{user.stats.applicationsCount || 0} candidatures</span>
                                                )}
                                                {user.role === 'Recruteur' && (
                                                    <span>{user.stats.offersCount || 0} offres</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ color: textSecondary, fontSize: '14px' }}>{user.email}</div>
                                <div>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        background: `${getRoleColor(user.role)}20`,
                                        color: getRoleColor(user.role),
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {getRoleIcon(user.role)}
                                        {user.role === 'Etudiant' ? 'Étudiant' : user.role === 'Recruteur' ? 'Recruteur' : 'Admin'}
                                    </span>
                                </div>
                                <div style={{ color: textSecondary, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {icons.calendar} {formatDate(user.dateCreation)}
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: user.isBlocked 
                                            ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2')
                                            : (isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4'),
                                        color: user.isBlocked ? '#ef4444' : '#10b981'
                                    }}>
                                        {user.isBlocked ? 'Bloqué' : 'Actif'}
                                    </span>
                                    {user.blockedReason && user.isBlocked && (
                                        <div style={{ fontSize: '10px', color: textSecondary, marginTop: '4px', maxWidth: '150px' }}>
                                            Motif: {user.blockedReason.substring(0, 30)}...
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    {user.role !== 'admin' && (
                                        <>
                                            {user.isBlocked ? (
                                                <button
                                                    onClick={() => handleUnblockUser(user)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4',
                                                        color: '#10b981',
                                                        border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #bbf7d0',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        fontWeight: '500',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                >
                                                    {icons.unblock} Débloquer
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowBlockModal(true);
                                                    }}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2',
                                                        color: '#ef4444',
                                                        border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        fontWeight: '500',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                >
                                                    {icons.block} Bloquer
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowDeleteModal(true);
                                                }}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                                    color: textSecondary,
                                                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.3s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2';
                                                    e.currentTarget.style.color = '#ef4444';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9';
                                                    e.currentTarget.style.color = textSecondary;
                                                }}
                                            >
                                                {icons.trash} Supprimer
                                            </button>
                                        </>
                                    )}
                                    {user.role === 'admin' && (
                                        <span style={{ color: textSecondary, fontSize: '12px', fontStyle: 'italic' }}>
                                            Actions limitées
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '25px',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                    color: textPrimary,
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                {icons.chevronLeft} Précédent
                            </button>
                            
                            {[...Array(totalPages).keys()].map(number => (
                                <button
                                    key={number + 1}
                                    onClick={() => setCurrentPage(number + 1)}
                                    style={{
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        background: currentPage === number + 1
                                            ? 'linear-gradient(135deg, #6c63ff, #4834d4)'
                                            : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9'),
                                        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                        color: currentPage === number + 1 ? 'white' : textPrimary,
                                        cursor: 'pointer',
                                        fontWeight: currentPage === number + 1 ? 'bold' : 'normal'
                                    }}
                                >
                                    {number + 1}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                    color: textPrimary,
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === totalPages ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                Suivant {icons.chevronRight}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: overlayBg,
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: modalBg,
                                border: modalBorder,
                                borderRadius: '20px',
                                width: '100%',
                                maxWidth: '450px',
                                padding: '30px',
                                boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.1)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 15px',
                                    color: '#ef4444'
                                }}>
                                    {icons.trash}
                                </div>
                                <h3 style={{ color: textPrimary, fontSize: '20px', marginBottom: '10px' }}>
                                    Supprimer l'utilisateur ?
                                </h3>
                                <p style={{ color: textSecondary, fontSize: '14px', lineHeight: '1.6' }}>
                                    Êtes-vous sûr de vouloir supprimer <strong>{selectedUser.prenom} {selectedUser.nom}</strong> ?
                                    Cette action est irréversible et supprimera toutes les données associées.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleDeleteUser}
                                    disabled={actionLoading}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        opacity: actionLoading ? 0.7 : 1,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {actionLoading ? 'Suppression...' : 'Confirmer la suppression'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedUser(null);
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                        color: textSecondary,
                                        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Block Confirmation Modal */}
            <AnimatePresence>
                {showBlockModal && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: overlayBg,
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}
                        onClick={() => setShowBlockModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: modalBg,
                                border: modalBorder,
                                borderRadius: '20px',
                                width: '100%',
                                maxWidth: '450px',
                                padding: '30px',
                                boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.1)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 15px',
                                    color: '#ef4444'
                                }}>
                                    {icons.block}
                                </div>
                                <h3 style={{ color: textPrimary, fontSize: '20px', marginBottom: '10px' }}>
                                    Bloquer l'utilisateur ?
                                </h3>
                                <p style={{ color: textSecondary, fontSize: '14px', lineHeight: '1.6' }}>
                                    Êtes-vous sûr de vouloir bloquer <strong>{selectedUser.prenom} {selectedUser.nom}</strong> ?
                                    <br />
                                    Cela suspendra toutes ses activités (offres, candidatures, entretiens).
                                </p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ color: textSecondary, fontSize: '13px', marginBottom: '8px', display: 'block' }}>
                                    Motif du blocage (optionnel) :
                                </label>
                                <textarea
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    placeholder="Ex: Comportement inapproprié, fausses informations..."
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        background: inputBg,
                                        border: inputBorder,
                                        color: textPrimary,
                                        fontSize: '14px',
                                        resize: 'vertical',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleBlockUser}
                                    disabled={actionLoading}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        opacity: actionLoading ? 0.7 : 1,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {actionLoading ? 'Blocage...' : 'Confirmer le blocage'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowBlockModal(false);
                                        setSelectedUser(null);
                                        setBlockReason('');
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                                        color: textSecondary,
                                        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

// Stat Card Component
const StatCard = ({ label, value, color, icon, isDark }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        style={{
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            transition: 'all 0.3s ease',
            cursor: 'default',
            height: '100px',
            width: '170px'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: color }}>{icon}</span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: isDark ? 'white' : '#0f172a' }}>{value}</span>
        </div>
        <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b', fontSize: '13px', fontWeight: '500' }}>
            {label}
        </p>
    </motion.div>
);

export default Users;