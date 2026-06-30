import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';

function SignUp(){
 
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    dateCreation: "",
    role: ""
  });

  const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    });
    setError("");
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
    }

    if (form.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return;
    }

    if (!form.role) {
        setError("Veuillez sélectionner un rôle");
        return;
    }

    setLoading(true);

    try {
        const res = await fetch("https://pfe-backend-five.vercel.app/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard', { 
                state: { user: data.user },
                replace: true 
            });
        } else {
            setError(data.error || "Erreur lors de la création du compte");
        }
    } catch (err) {
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
            staggerChildren: 0.12,
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

  // SVG Icons - matching Login page
  const icons = {
    user: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    mail: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
        </svg>
    ),
    lock: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    ),
    lockCheck: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            <polyline points="9 16 11 18 15 14"/>
        </svg>
    ),
    role: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    check: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    ),
    warning: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    ),
    spinner: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    sparkle: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>
        </svg>
    ),
  };

  const textPrimary = isDark ? '#fefae0' : '#2d2424';
  const textSecondary = isDark ? 'rgba(254, 250, 224, 0.55)' : '#8b7e74';

    return(
        <motion.div
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

            {/* SignUp Card */}
            <motion.div
                style={{
                    zIndex: 1,
                    width: '100%',
                    maxWidth: '500px',
                    background: isDark ? 'rgba(45, 36, 36, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: '28px',
                    padding: '40px',
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
                    style={{ textAlign: 'center', marginBottom: '28px' }}
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
                        margin: '0 auto 16px'
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
                <motion.div variants={itemVariants} style={{ marginBottom: '28px', textAlign: 'center' }}>
                    <h1 style={{
                        color: textPrimary,
                        fontSize: '26px',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                        fontFamily: "'Quicksand', sans-serif"
                    }}>
                        Créez votre compte
                    </h1>
                    <p style={{
                        color: textSecondary,
                        fontSize: '14px',
                        margin: 0,
                        fontWeight: '400',
                        lineHeight: 1.5
                    }}>
                        Rejoignez StageConnect et trouvez le stage de vos rêves
                    </p>
                </motion.div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} onSubmit={handleSubmit}>
                
                    {/* Prenom and Nom Row */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <motion.div variants={itemVariants} style={{ flex: 1, position: 'relative' }}>
                            <label style={{
                                color: isDark ? 'rgba(254, 250, 224, 0.7)' : '#5c4f45',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'block',
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {icons.user} Prénom
                            </label>
                            <motion.input 
                                type="text" 
                                name="prenom" 
                                value={form.prenom} 
                                onChange={handleChange}
                                onFocus={() => setFocusedField('prenom')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="John"
                                style={{
                                    width: '100%',
                                    padding: '12px 36px 12px 14px',
                                    borderRadius: '14px',
                                    border: focusedField === 'prenom' 
                                        ? '2px solid #6c63ff' 
                                        : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 126, 116, 0.15)',
                                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 126, 116, 0.03)',
                                    color: textPrimary,
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    outline: 'none'
                                }}
                                animate={{
                                    boxShadow: focusedField === 'prenom' 
                                        ? '0 0 0 4px rgba(108, 99, 255, 0.1)' 
                                        : '0 0 0 0px rgba(108, 99, 255, 0)'
                                }}
                            />
                            {form.prenom && (
                                <motion.span 
                                    style={{
                                        position: 'absolute',
                                        right: '14px',
                                        top: '40px',
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
                        <motion.div variants={itemVariants} style={{ flex: 1, position: 'relative' }}>
                            <label style={{
                                color: isDark ? 'rgba(254, 250, 224, 0.7)' : '#5c4f45',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'block',
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {icons.user} Nom
                            </label>
                            <motion.input 
                                type="text" 
                                name="nom" 
                                value={form.nom} 
                                onChange={handleChange}
                                onFocus={() => setFocusedField('nom')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="Doe"
                                style={{
                                    width: '100%',
                                    padding: '12px 36px 12px 14px',
                                    borderRadius: '14px',
                                    border: focusedField === 'nom' 
                                        ? '2px solid #6c63ff' 
                                        : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 126, 116, 0.15)',
                                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 126, 116, 0.03)',
                                    color: textPrimary,
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    outline: 'none'
                                }}
                                animate={{
                                    boxShadow: focusedField === 'nom' 
                                        ? '0 0 0 4px rgba(108, 99, 255, 0.1)' 
                                        : '0 0 0 0px rgba(108, 99, 255, 0)'
                                }}
                            />
                            {form.nom && (
                                <motion.span 
                                    style={{
                                        position: 'absolute',
                                        right: '14px',
                                        top: '40px',
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
                    </div>

                    {/* Email */}
                    <motion.div variants={itemVariants} style={{ position: 'relative' }}>
                        <label style={{
                            color: isDark ? 'rgba(254, 250, 224, 0.7)' : '#5c4f45',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {icons.mail} Email
                        </label>
                        <motion.input 
                            type="email" 
                            name="email" 
                            value={form.email} 
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="votre@email.com"
                            style={{
                                width: '100%',
                                padding: '12px 36px 12px 14px',
                                borderRadius: '14px',
                                border: focusedField === 'email' 
                                    ? '2px solid #6c63ff' 
                                    : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 126, 116, 0.15)',
                                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 126, 116, 0.03)',
                                color: textPrimary,
                                fontSize: '14px',
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
                        {form.email && (
                            <motion.span 
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '38px',
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

                    {/* Password and Confirm Password Row */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <motion.div variants={itemVariants} style={{ flex: 1, position: 'relative' }}>
                            <label style={{
                                color: isDark ? 'rgba(254, 250, 224, 0.7)' : '#5c4f45',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'block',
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {icons.lock} Mot de passe
                            </label>
                            <motion.input 
                                type="password" 
                                name="password" 
                                value={form.password} 
                                onChange={handleChange}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '12px 36px 12px 14px',
                                    borderRadius: '14px',
                                    border: focusedField === 'password' 
                                        ? '2px solid #6c63ff' 
                                        : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 126, 116, 0.15)',
                                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 126, 116, 0.03)',
                                    color: textPrimary,
                                    fontSize: '14px',
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
                            {form.password && form.password.length >= 6 && (
                                <motion.span 
                                    style={{
                                        position: 'absolute',
                                        right: '14px',
                                        top: '40px',
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
                        <motion.div variants={itemVariants} style={{ flex: 1, position: 'relative' }}>
                            <label style={{
                                color: isDark ? 'rgba(254, 250, 224, 0.7)' : '#5c4f45',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'block',
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {icons.lockCheck} Confirmer
                            </label>
                            <motion.input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                                onFocus={() => setFocusedField('confirm')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '12px 36px 12px 14px',
                                    borderRadius: '14px',
                                    border: focusedField === 'confirm' 
                                        ? '2px solid #6c63ff' 
                                        : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 126, 116, 0.15)',
                                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 126, 116, 0.03)',
                                    color: textPrimary,
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    outline: 'none'
                                }}
                                animate={{
                                    boxShadow: focusedField === 'confirm' 
                                        ? '0 0 0 4px rgba(108, 99, 255, 0.1)' 
                                        : '0 0 0 0px rgba(108, 99, 255, 0)'
                                }}
                            />
                            {confirmPassword && confirmPassword === form.password && (
                                <motion.span 
                                    style={{
                                        position: 'absolute',
                                        right: '14px',
                                        top: '40px',
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
                    </div>

                    {/* Role Selection */}
                    <motion.div variants={itemVariants} style={{ position: 'relative' }}>
                        <label style={{
                            color: isDark ? 'rgba(254, 250, 224, 0.7)' : '#5c4f45',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {icons.role} Vous êtes un(e)
                        </label>
                        <motion.select 
                            name='role' 
                            value={form.role} 
                            onChange={handleChange}
                            onFocus={() => setFocusedField('role')}
                            onBlur={() => setFocusedField(null)}
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                borderRadius: '14px',
                                border: focusedField === 'role' 
                                    ? '2px solid #6c63ff' 
                                    : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(139, 126, 116, 0.15)',
                                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(139, 126, 116, 0.03)',
                                color: form.role ? textPrimary : textSecondary,
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box',
                                cursor: 'pointer',
                                outline: 'none',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                backgroundImage: isDark 
                                    ? "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(254,250,224,0.5)' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E\")"
                                    : "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238b7e74' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E\")",
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 14px center',
                                paddingRight: '40px'
                            }}
                            animate={{
                                boxShadow: focusedField === 'role' 
                                    ? '0 0 0 4px rgba(108, 99, 255, 0.1)' 
                                    : '0 0 0 0px rgba(108, 99, 255, 0)'
                            }}
                        >
                            <option value="" disabled style={{ backgroundColor: isDark ? '#2d2424' : '#fff', color: isDark ? 'rgba(254,250,224,0.3)' : '#8b7e74' }}>Sélectionnez votre rôle</option>
                            <option value="Etudiant" style={{ backgroundColor: isDark ? '#2d2424' : '#fff', color: isDark ? '#fefae0' : '#2d2424' }}>Étudiant</option>
                            <option value="Recruteur" style={{ backgroundColor: isDark ? '#2d2424' : '#fff', color: isDark ? '#fefae0' : '#2d2424' }}>Recruteur</option>
                        </motion.select>
                        {form.role && (
                            <motion.span 
                                style={{
                                    position: 'absolute',
                                    right: '40px',
                                    top: '40px',
                                    color: '#7ED9A0',
                                    pointerEvents: 'none'
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
                            marginTop: '6px',
                            fontFamily: "'Quicksand', sans-serif"
                        }}
                        whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 32px rgba(108, 99, 255, 0.45)' } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                    >
                        {loading ? (
                             "Création..."
                        ) : (
                            "Créer mon compte"
                        )}
                    </motion.button>

                    {/* Divider */}
                    <motion.div 
                        variants={itemVariants}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            margin: '4px 0'
                        }}
                    >
                        <div style={{ flex: 1, height: '1px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}></div>
                        <span style={{ color: textSecondary, fontSize: '12px', fontWeight: '500' }}>ou</span>
                        <div style={{ flex: 1, height: '1px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}></div>
                    </motion.div>

                    {/* Login Link */}
                    <motion.div 
                        variants={itemVariants}
                        style={{ textAlign: 'center' }}
                    >
                        <p style={{
                            color: textSecondary,
                            fontSize: '14px',
                            margin: '0 0 4px 0'
                        }}>
                            Déjà un compte ?
                        </p>
                        <Link 
                            to="/login"
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
                            Se connecter {icons.sparkle}
                        </Link>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default SignUp;