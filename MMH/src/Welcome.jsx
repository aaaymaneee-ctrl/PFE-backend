// Welcome.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext.jsx';

function Welcome() {
    const { isDark, toggleTheme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // SVG Icons - clean, professional set
    const icons = {
        document: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
        ),
        robot: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="12" y1="2" x2="12" y2="5"/>
                <circle cx="8" cy="12" r="1"/>
                <circle cx="16" cy="12" r="1"/>
                <path d="M8 16h8"/>
            </svg>
        ),
        target: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
        ),
        chart: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
        ),
        briefcase: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
        ),
        lock: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        ),
        sun: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
        ),
        moon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        ),
        arrowDown: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
            </svg>
        ),
    };

    const features = [
        {
            icon: icons.document,
            title: 'CV Intelligent',
            description: 'Téléchargez votre CV et obtenez une analyse automatique de vos compétences, formations et langues.'
        },
        {
            icon: icons.robot,
            title: 'Entretiens IA',
            description: 'Préparez-vous avec notre assistant d\'entretien virtuel qui simule un vrai recruteur.'
        },
        {
            icon: icons.target,
            title: 'Matching Intelligent',
            description: 'Postulez automatiquement aux offres qui correspondent le mieux à votre profil.'
        },
        {
            icon: icons.chart,
            title: 'Suivi en Temps Réel',
            description: 'Suivez l\'état de vos candidatures et recevez des retours détaillés des recruteurs.'
        },
        {
            icon: icons.briefcase,
            title: 'Pour les Recruteurs',
            description: 'Publiez vos offres, gérez les candidatures et trouvez les meilleurs talents facilement.'
        },
        {
            icon: icons.lock,
            title: 'Sécurisé',
            description: 'Vos données sont protégées avec les meilleurs standards de sécurité.'
        }
    ];

    const stats = [
        { value: '500+', label: 'Offres de stage' },
        { value: '1000+', label: 'Étudiants inscrits' },
        { value: '95%', label: 'Taux de satisfaction' },
        { value: '24/7', label: 'Support disponible' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: isDark ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' : 'linear-gradient(135deg, #f0f4ff, #e8eeff, #f5f3ff)',
            color: isDark ? 'white' : '#0f172a',
            overflow: 'hidden'
        }}>
            {/* Navigation */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 40px',
                background: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    StageConnect
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ display: 'flex', gap: '15px', alignItems: 'center' }}
                >
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                            background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            color: isDark ? '#fbbf24' : '#6c63ff'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#6c63ff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1';
                        }}
                        title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
                    >
                        {isDark ? icons.sun : icons.moon}
                    </button>

                    <Link to="/login">
                        <button style={{
                            padding: '10px 25px',
                            background: 'transparent',
                            color: isDark ? 'white' : '#1e293b',
                            border: isDark ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid #cbd5e1',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = '#6c63ff';
                            e.target.style.color = '#6c63ff';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.3)' : '#cbd5e1';
                            e.target.style.color = isDark ? 'white' : '#1e293b';
                        }}
                        >
                            Se connecter
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button style={{
                            padding: '10px 25px',
                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                        >
                            S'inscrire
                        </button>
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: '100px 40px 80px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '400px',
                    height: '400px',
                    background: isDark ? 'radial-gradient(circle, rgba(108, 99, 255, 0.2), transparent)' : 'radial-gradient(circle, rgba(108, 99, 255, 0.1), transparent)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-150px',
                    left: '-100px',
                    width: '500px',
                    height: '500px',
                    background: isDark ? 'radial-gradient(circle, rgba(40, 167, 69, 0.1), transparent)' : 'radial-gradient(circle, rgba(16, 185, 129, 0.08), transparent)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        fontSize: 'clamp(36px, 6vw, 60px)',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        lineHeight: '1.2',
                        color: isDark ? 'white' : '#0f172a'
                    }}
                >
                    Trouvez le stage de vos rêves
                    <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        avec l'IA
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                        fontSize: 'clamp(16px, 2.5vw, 20px)',
                        color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b',
                        maxWidth: '700px',
                        margin: '0 auto 40px',
                        lineHeight: '1.6'
                    }}
                >
                    La plateforme intelligente qui connecte les étudiants aux meilleures offres de stage.
                    Analyse de CV, entretiens virtuels et matching automatique pour booster votre carrière.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
                >
                    <Link to="/signup">
                        <button style={{
                            padding: '16px 40px',
                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s',
                            boxShadow: '0 10px 30px rgba(108, 99, 255, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 15px 40px rgba(108, 99, 255, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.3)';
                        }}
                        >
                            Commencer maintenant 🚀
                        </button>
                    </Link>
                    <a href="#features">
                        <button style={{
                            padding: '16px 40px',
                            background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
                            color: isDark ? 'white' : '#1e293b',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: '500',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9';
                        }}
                        >
                            En savoir plus {icons.arrowDown}
                        </button>
                    </a>
                </motion.div>
            </section>

            {/* Stats Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    padding: '60px 40px',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(10px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '30px',
                            textAlign: 'center',
                            transition: 'all 0.3s',
                            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        }}
                    >
                        <div style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '10px'
                        }}>
                            {stat.value}
                        </div>
                        <div style={{
                            color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </motion.section>

            {/* Features Section */}
            <section id="features" style={{
                padding: '80px 40px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 40px)',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                        color: isDark ? 'white' : '#0f172a'
                    }}>
                        Pourquoi choisir{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            StageConnect
                        </span>
                        ?
                    </h2>
                    <p style={{
                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b',
                        fontSize: '18px',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Tout ce dont vous avez besoin pour réussir votre recherche de stage en un seul endroit.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px'
                }}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            style={{
                                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                                backdropFilter: isDark ? 'blur(10px)' : 'none',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                                borderRadius: '16px',
                                padding: '30px',
                                transition: 'all 0.3s ease',
                                cursor: 'default',
                                boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.4)';
                                e.currentTarget.style.boxShadow = isDark ? '0 10px 40px rgba(0, 0, 0, 0.3)' : '0 10px 40px rgba(108, 99, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0';
                                e.currentTarget.style.boxShadow = isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                            }}
                        >
                            <div style={{
                                color: '#6c63ff',
                                marginBottom: '15px'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                marginBottom: '10px',
                                color: isDark ? 'white' : '#1e293b'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#64748b',
                                fontSize: '14px',
                                lineHeight: '1.7'
                            }}>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '100px 40px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    background: isDark ? 'radial-gradient(circle, rgba(108, 99, 255, 0.1), transparent)' : 'radial-gradient(circle, rgba(108, 99, 255, 0.06), transparent)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 40px)',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: isDark ? 'white' : '#0f172a'
                    }}>
                        Prêt à décrocher votre stage ?
                    </h2>
                    <p style={{
                        color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b',
                        fontSize: '18px',
                        marginBottom: '40px',
                        maxWidth: '500px',
                        margin: '0 auto 40px'
                    }}>
                        Inscrivez-vous gratuitement et laissez notre IA vous aider à trouver le stage parfait.
                    </p>
                    <Link to="/signup">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '18px 50px',
                                background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                boxShadow: '0 10px 30px rgba(108, 99, 255, 0.4)'
                            }}
                        >
                            Créer un compte gratuit 🚀
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* Scroll to Top Button */}
<motion.button
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
        transition: 'all 0.3s ease'
    }}
    title="Retour en haut"
>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
    </svg>
</motion.button>

            {/* Footer */}
            <footer style={{
                padding: '40px',
                textAlign: 'center',
                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#f8fafc'
            }}>
                <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    background: 'linear-gradient(135deg, #6c63ff, #4834d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    StageConnect
                </div>
                <p style={{
                    color: isDark ? 'rgba(255, 255, 255, 0.4)' : '#94a3b8',
                    fontSize: '14px'
                }}>
                    © 2025 StageConnect. Tous droits réservés.
                </p>
            </footer>
        </div>
    );
}

export default Welcome;