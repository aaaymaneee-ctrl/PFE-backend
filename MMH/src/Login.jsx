// Login.jsx - Updated to handle blocked accounts

import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';

function Login(){
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [blockedInfo, setBlockedInfo] = useState(null); // New state for blocked user info
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
        setBlockedInfo(null); // Clear blocked info when user types again
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError("");
        setBlockedInfo(null);
        setLoading(true);

        console.log("Submitting:", formData);

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log("Response:", res.status, data);

            if (!res.ok) {
                // Check if this is a blocked account error (403)
                if (res.status === 403 && data.isBlocked) {
                    setBlockedInfo({
                        reason: data.blockedReason,
                        blockedAt: data.blockedAt
                    });
                } else {
                    setError(data.error || "Email ou mot de passe incorrect");
                }
            } else {
                console.log("Login successful:", data);
                localStorage.setItem('user', JSON.stringify(data.user || data));
                navigate('/dashboard', { 
                    state: { user: data.user || data },
                    replace: true
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Impossible de se connecter au serveur");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    // SVG Icons
    const icons = {
        wave: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}>
                <path d="M7 11.5a.5.5 0 0 1 1 0v4a.5.5 0 0 1-1 0v-4z"/>
                <path d="M10 9.5a.5.5 0 0 1 1 0v6a.5.5 0 0 1-1 0v-6z"/>
                <path d="M4 8a.5.5 0 0 1 1 0v8.5a.5.5 0 0 1-1 0V8z"/>
                <path d="M13 6a.5.5 0 0 1 1 0v9a.5.5 0 0 1-1 0V6z"/>
                <path d="M16 8.5a.5.5 0 0 1 1 0v6.5a.5.5 0 0 1-1 0V8.5z"/>
                <path d="M19 11a.5.5 0 0 1 1 0v4a.5.5 0 0 1-1 0v-4z"/>
            </svg>
        ),
        mail: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
        ),
        lock: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        ),
        check: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        ),
        warning: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        ),
        spinner: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        userCircle: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        ),
        sparkle: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>
            </svg>
        ),
        blockIcon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                <path d="M12 8v4l3 3"/>
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
    };

    const textPrimary = isDark ? '#fefae0' : '#2d2424';
    const textSecondary = isDark ? 'rgba(254, 250, 224, 0.55)' : '#8b7e74';

    return(
        <>
            <motion.div 
                className="container"
                style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100vw', 
                    minHeight: '100vh', 
                    padding: '40px',
                    background: isDark 
                        ? 'linear-gradient(180deg, #1a1a2e 0%, #2d2424 100%)' 
                        : 'linear-gradient(180deg, #fef9f3 0%, #fdf6ec 50%, #f0f4ff 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Background decorations */}
                <motion.div
                    style={{
                        position: 'absolute',
                        width: '500px',
                        height: '500px',
                        background: isDark 
                            ? 'radial-gradient(circle, rgba(108, 99, 255, 0.08), transparent)' 
                            : 'radial-gradient(circle, rgba(108, 99, 255, 0.06), transparent)',
                        borderRadius: '50%',
                        top: '-200px',
                        right: '-150px',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                    animate={{ y: [0, 30, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    style={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        background: isDark 
                            ? 'radial-gradient(circle, rgba(168, 125, 247, 0.06), transparent)' 
                            : 'radial-gradient(circle, rgba(168, 125, 247, 0.04), transparent)',
                        borderRadius: '50%',
                        bottom: '-150px',
                        left: '-100px',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                    animate={{ y: [0, -25, 0], scale: [1, 1.03, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Login Card */}
                <motion.div
                    style={{
                        zIndex: 1,
                        width: '100%',
                        maxWidth: '440px',
                        background: isDark ? 'rgba(45, 36, 36, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(30px)',
                        borderRadius: '28px',
                        padding: '48px 40px',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.1)',
                        boxShadow: isDark 
                            ? '0 8px 48px rgba(0, 0, 0, 0.3)' 
                            : '0 8px 48px rgba(139, 126, 116, 0.08)',
                    }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Logo */}
                    <motion.div 
                        variants={itemVariants} 
                        style={{ textAlign: 'center', marginBottom: '32px' }}
                    >
                        <div style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            fontFamily: "'Quicksand', sans-serif",
                            background: 'linear-gradient(135deg, #6c63ff, #A87DF7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px'
                        }}>
                            StageConnect
                        </div>
                        <div style={{
                            width: '40px',
                            height: '3px',
                            background: 'linear-gradient(135deg, #6c63ff, #A87DF7)',
                            borderRadius: '2px',
                            margin: '0 auto 20px'
                        }}></div>
                        <div style={{
                            color: isDark ? 'rgba(254, 250, 224, 0.4)' : '#a39a92',
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '4px'
                        }}>
                            {icons.userCircle}
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div variants={itemVariants} style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <h1 style={{
                            color: textPrimary,
                            fontSize: '28px',
                            fontWeight: '700',
                            margin: '0 0 8px 0',
                            fontFamily: "'Quicksand', sans-serif"
                        }}>
                            Bienvenue {icons.wave}
                        </h1>
                        <p style={{
                            color: textSecondary,
                            fontSize: '15px',
                            margin: 0,
                            fontWeight: '400',
                            lineHeight: 1.5
                        }}>
                            Connectez-vous pour accéder à votre tableau de bord
                        </p>
                    </motion.div>

                    {/* Blocked Account Message */}
                    {blockedInfo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                marginBottom: '24px',
                                padding: '20px',
                                borderRadius: '16px',
                                background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                                border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`,
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ color: '#ef4444', marginBottom: '12px' }}>
                                {icons.blockIcon}
                            </div>
                            <h3 style={{ color: '#ef4444', fontSize: '18px', marginBottom: '8px', fontWeight: 'bold' }}>
                                Compte Bloqué
                            </h3>
                            <p style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#7f1d1d', fontSize: '14px', marginBottom: '12px' }}>
                                Votre compte a été bloqué par l'administrateur.
                            </p>
                            <div style={{
                                background: isDark ? 'rgba(0,0,0,0.3)' : '#fff',
                                borderRadius: '12px',
                                padding: '12px',
                                marginTop: '8px'
                            }}>
                                <p style={{ 
                                    color: isDark ? 'rgba(255,255,255,0.7)' : '#991b1b', 
                                    fontSize: '13px',
                                    marginBottom: '8px',
                                    fontWeight: '500'
                                }}>
                                    Motif du blocage :
                                </p>
                                <p style={{ 
                                    color: isDark ? 'rgba(255,255,255,0.9)' : '#b91c1c', 
                                    fontSize: '14px',
                                    fontStyle: 'italic',
                                    marginBottom: '8px'
                                }}>
                                    "{blockedInfo.reason}"
                                </p>
                                {blockedInfo.blockedAt && (
                                    <p style={{ 
                                        color: isDark ? 'rgba(255,255,255,0.5)' : '#7f1d1d', 
                                        fontSize: '11px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px'
                                    }}>
                                        {icons.calendar} Bloqué le {new Date(blockedInfo.blockedAt).toLocaleDateString('fr-FR')}
                                    </p>
                                )}
                            </div>
                            <p style={{ 
                                color: isDark ? 'rgba(255,255,255,0.5)' : '#7f1d1d', 
                                fontSize: '12px', 
                                marginTop: '12px',
                                paddingTop: '12px',
                                borderTop: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #fecaca'
                            }}>
                                Pour toute question, veuillez contacter l'administrateur.
                            </p>
                        </motion.div>
                    )}

                    {!blockedInfo && (
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <motion.div 
                                variants={itemVariants}
                                style={{ position: 'relative' }}
                            >
                                <label style={{
                                    color: isDark ? 'rgba(254, 250, 224, 0.7)' : '#5c4f45',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    display: 'block',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {icons.mail} Email
                                </label>
                                <motion.input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    placeholder="votre@email.com"
                                    style={{
                                        width: '100%',
                                        padding: '14px 40px 14px 16px',
                                        borderRadius: '14px',
                                        border: focusedField === 'email' 
                                            ? '2px solid #6c63ff' 
                                            : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 126, 116, 0.15)',
                                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 126, 116, 0.03)',
                                        color: textPrimary,
                                        fontSize: '15px',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box',
                                        outline: 'none'
                                    }}
                                    animate={{
                                        boxShadow: focusedField === 'email' 
                                            ? '0 0 0 4px rgba(108, 99, 255, 0.1)' 
                                            : '0 0 0 0px rgba(108, 99, 255, 0)'
                                    }}
                                />
                                {formData.email && (
                                    <motion.span 
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '44px',
                                            color: '#7ED9A0'
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {icons.check}
                                    </motion.span>
                                )}
                            </motion.div>

                            {/* Password Field */}
                            <motion.div 
                                variants={itemVariants}
                                style={{ position: 'relative' }}
                            >
                                <label style={{
                                    color: isDark ? 'rgba(254, 250, 224, 0.7)' : '#5c4f45',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    display: 'block',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {icons.lock} Mot de passe
                                </label>
                                <motion.input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '14px 40px 14px 16px',
                                        borderRadius: '14px',
                                        border: focusedField === 'password' 
                                            ? '2px solid #6c63ff' 
                                            : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 126, 116, 0.15)',
                                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 126, 116, 0.03)',
                                        color: textPrimary,
                                        fontSize: '15px',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box',
                                        outline: 'none'
                                    }}
                                    animate={{
                                        boxShadow: focusedField === 'password' 
                                            ? '0 0 0 4px rgba(108, 99, 255, 0.1)' 
                                            : '0 0 0 0px rgba(108, 99, 255, 0)'
                                    }}
                                />
                                {formData.password && (
                                    <motion.span 
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '44px',
                                            color: '#7ED9A0'
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {icons.check}
                                    </motion.span>
                                )}
                            </motion.div>
                            
                            {/* Error Message */}
                            {error && (
                                <motion.div 
                                    variants={itemVariants}
                                    style={{
                                        color: "#FF8E7A",
                                        backgroundColor: isDark ? 'rgba(255, 142, 122, 0.08)' : 'rgba(255, 142, 122, 0.06)',
                                        padding: "12px 14px",
                                        borderRadius: "12px",
                                        fontSize: "13px",
                                        textAlign: "center",
                                        border: isDark ? '1px solid rgba(255, 142, 122, 0.15)' : '1px solid rgba(255, 142, 122, 0.12)',
                                        fontWeight: "500",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {icons.warning} {error}
                                </motion.div>
                            )}
                            
                            {/* Submit Button */}
                            <motion.button 
                                variants={itemVariants}
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '15px',
                                    borderRadius: '14px',
                                    border: 'none',
                                    background: loading 
                                        ? (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0') 
                                        : 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                    color: loading 
                                        ? (isDark ? 'rgba(254, 250, 224, 0.3)' : '#94a3b8') 
                                        : '#fff',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    letterSpacing: '0.5px',
                                    boxShadow: loading ? 'none' : '0 6px 24px rgba(108, 99, 255, 0.3)',
                                    marginTop: '4px',
                                    fontFamily: "'Quicksand', sans-serif"
                                }}
                                whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 32px rgba(108, 99, 255, 0.45)' } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                            >
                                {loading ? (
                                    <motion.span
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: isDark ? 'rgba(254, 250, 224, 0.5)' : '#94a3b8' }}
                                    >
                                         Connexion...
                                    </motion.span>
                                ) : (
                                    "Se connecter"
                                )}
                            </motion.button>

                            {/* Divider */}
                            <motion.div 
                                variants={itemVariants}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px',
                                    margin: '8px 0'
                                }}
                            >
                                <div style={{ flex: 1, height: '1px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}></div>
                                <span style={{ color: textSecondary, fontSize: '12px', fontWeight: '500' }}>ou</span>
                                <div style={{ flex: 1, height: '1px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}></div>
                            </motion.div>

                            {/* Signup Link */}
                            <motion.div 
                                variants={itemVariants}
                                style={{ textAlign: 'center' }}
                            >
                                <p style={{
                                    color: textSecondary,
                                    fontSize: '14px',
                                    margin: '0 0 4px 0'
                                }}>
                                    Pas encore de compte ?
                                </p>
                                <Link 
                                    to="/signup"
                                    style={{
                                        color: '#6c63ff',
                                        textDecoration: 'none',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        fontFamily: "'Quicksand', sans-serif",
                                        position: 'relative',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        paddingBottom: '4px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.gap = '10px';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.gap = '6px';
                                    }}
                                >
                                    Créer un compte {icons.sparkle}
                                </Link>
                            </motion.div>
                        </form>
                    )}

                    {/* Show contact admin button if blocked */}
                    {blockedInfo && (
                        <motion.div 
                            variants={itemVariants}
                            style={{ marginTop: '20px', textAlign: 'center' }}
                        >
                            <Link to="/">
                                <button
                                    style={{
                                        padding: '12px 24px',
                                        background: isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff',
                                        color: '#6c63ff',
                                        border: isDark ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid #c7d2fe',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = isDark ? 'rgba(108, 99, 255, 0.3)' : '#e0e7ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = isDark ? 'rgba(108, 99, 255, 0.2)' : '#eef2ff';
                                    }}
                                >
                                    Retour à l'accueil
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
}

export default Login;