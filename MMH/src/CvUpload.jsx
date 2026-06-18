// CvUpload.jsx - Updated with NLP Analysis
import { useState, useEffect } from "react";
import { useTheme } from './ThemeContext.jsx';

function CVUpload() {
    const { isDark } = useTheme();
    const [userId, setUserId] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    
    // NLP Analysis states
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);

    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData && userData.id) {
                setUserId(userData.id);
                setUser(userData);
                // Check if user already has a CV
                checkExistingCV(userData.id);
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }, []);

    // Check if CV exists and analyze it
    const checkExistingCV = async (userId) => {
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/users/${userId}`);
            const userData = await res.json();
            if (userData.cv && userData.cv.filename) {
                // Auto-analyze existing CV
                analyzeCV(userId);
            }
        } catch (err) {
            console.error("Error checking CV:", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setMessage("");
        } else if (selectedFile) {
            setFile(null);
            setMessage("❌ Veuillez sélectionner un fichier PDF");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setMessage("❌ Veuillez sélectionner un fichier");
            return;
        }
        if (!userId) {
            setMessage("❌ Utilisateur non identifié");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("cv", file);

        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/users/${userId}/cv`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage(" CV téléchargé avec succès!");
                setFile(null);
                setShowAnalysis(true);
                // Automatically analyze after upload
                analyzeCV(userId);
            } else {
                setMessage(data.error || "❌ Erreur lors du téléchargement");
            }
        } catch (err) {
            setMessage("❌ Impossible de se connecter au serveur");
        } finally {
            setUploading(false);
        }
    };

    // NLP Analysis function
    const analyzeCV = async (userId) => {
        setAnalyzing(true);
        try {
            const res = await fetch(`https://pfe-backend-five.vercel.app/cv/analyze/${userId}`, {
                method: 'POST'
            });
            
            if (res.ok) {
                const data = await res.json();
                setAnalysis(data);
                setShowAnalysis(true);
            } else {
                const data = await res.json();
                console.error("Analysis error:", data.error);
            }
        } catch (err) {
            console.error("Error analyzing CV:", err);
        } finally {
            setAnalyzing(false);
        }
    };

    // Helper function for score color
    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#f59e0b';
        return '#ff6b6b';
    };

    // Helper function for score message
    const getScoreMessage = (score) => {
        if (score >= 80) return 'Excellent CV !';
        if (score >= 70) return 'Très bon CV';
        if (score >= 60) return 'Bon CV, peut être amélioré';
        if (score >= 40) return 'CV moyen, nécessite des améliorations';
        return 'CV a besoin d\'améliorations significatives';
    };

    // SVG Icons
    const icons = {
        lock: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
        ),
        upload: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
        ),
        document: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
        ),
        robot: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="12" y1="2" x2="12" y2="5"/>
                <circle cx="8" cy="12" r="1"/>
                <circle cx="16" cy="12" r="1"/>
                <path d="M8 16h8"/>
            </svg>
        ),
        star: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        ),
        zap: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
        ),
        checkCircle: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        bullet: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <circle cx="12" cy="12" r="4"/>
            </svg>
        ),
        refresh: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
        ),
        mail: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
        ),
        phone: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
        ),
        linkedin: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
            </svg>
        ),
        github: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
        ),
        globe: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
        ),
        graduation: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>
            </svg>
        ),
        briefcase: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
        ),
        lightbulb: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
            </svg>
        ),
    };

    if (!user) {
        return (
            <div style={{ 
                padding: '60px 40px', 
                color: isDark ? '#fefae0' : '#2d2424', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{ 
                    color: isDark ? '#8b7e74' : '#a39a92',
                    marginBottom: '8px'
                }}>
                    {icons.lock}
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Please Log In</h2>
                <p style={{ color: isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74', margin: 0, fontSize: '15px' }}>
                    You need to be logged in to upload your CV
                </p>
            </div>
        );
    }


    const safeMessageStr = String(message?.props?.children || message);
const isErrorMessage = safeMessageStr.includes('Erreur') || safeMessageStr.includes('Impossible');


    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ 
                    color: isDark ? '#fefae0' : '#2d2424', 
                    fontSize: '28px', 
                    marginBottom: '8px',
                    fontWeight: '700',
                    fontFamily: "'Quicksand', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ color: '#6c63ff' }}>{icons.upload}</span>
                    Dépôt / Modification du CV
                </h1>
                <p style={{ 
                    color: isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74', 
                    fontSize: '15px',
                    marginLeft: '34px'
                }}>
                    Téléchargez votre CV au format PDF et obtenez une analyse automatique
                </p>
            </div>

            {/* Upload Section */}
            <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                backdropFilter: isDark ? 'blur(20px)' : 'none',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '30px',
                boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139, 126, 116, 0.06)'
            }}>
                <form onSubmit={handleUpload}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '10px',
                            color: isDark ? 'rgba(254,250,224,0.6)' : '#8b7e74',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Sélectionnez votre fichier CV :
                        </label>
                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            disabled={uploading}
                            style={{ 
                                width: '100%',
                                padding: '14px',
                                background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#fef9f3',
                                border: isDark ? '2px dashed rgba(255, 255, 255, 0.1)' : '2px dashed rgba(139, 126, 116, 0.2)',
                                borderRadius: '14px',
                                color: isDark ? '#fefae0' : '#2d2424',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    
                    {file && (
                        <p style={{ 
                            padding: '12px 16px',
                            background: isDark ? 'rgba(108, 99, 255, 0.08)' : 'rgba(108, 99, 255, 0.04)',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            color: isDark ? '#fefae0' : '#2d2424',
                            border: isDark ? '1px solid rgba(108, 99, 255, 0.15)' : '1px solid rgba(108, 99, 255, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px'
                        }}>
                            <span style={{ color: '#6c63ff' }}>{icons.document}</span>
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </p>
                    )}
                    
                    
                    
                    <button 
                        type="submit" 
                        disabled={!file || uploading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: !file 
                                ? (isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9') 
                                : 'linear-gradient(135deg, #6c63ff, #4834d4)',
                            color: !file 
                                ? (isDark ? 'rgba(254,250,224,0.3)' : '#94a3b8') 
                                : 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: !file ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: !file ? 'none' : '0 4px 16px rgba(108, 99, 255, 0.25)'
                        }}
                        onMouseEnter={(e) => {
                            if (file && !uploading) e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {uploading ? (
                            <>⏳ Téléchargement...</>
                        ) : (
                            <><span>{icons.upload}</span> Télécharger le CV</>
                        )}
                    </button>
                </form>
            </div>

            {/* Analysis Section */}
            {(analyzing || analysis) && (
                <div style={{ marginTop: '30px' }}>
                    <h2 style={{ 
                        color: isDark ? '#fefae0' : '#2d2424', 
                        fontSize: '22px', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: '700',
                        fontFamily: "'Quicksand', sans-serif"
                    }}>
                        <span style={{ color: '#6c63ff' }}>{icons.robot}</span>
                        Analyse automatique de votre CV
                        {analyzing && <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '500' }}>⏳ Analyse en cours...</span>}
                    </h2>

                    {analyzing && (
                        <div style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                            backdropFilter: isDark ? 'blur(20px)' : 'none',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                            borderRadius: '20px',
                            padding: '48px',
                            textAlign: 'center',
                            color: isDark ? '#fefae0' : '#2d2424',
                            boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139, 126, 116, 0.06)'
                        }}>
                            <div style={{ 
                                color: '#6c63ff',
                                marginBottom: '20px',
                                animation: 'breathe 2s ease-in-out infinite'
                            }}>
                                {icons.robot}
                            </div>
                            <p style={{ fontSize: '17px', marginBottom: '8px', fontWeight: '500' }}>Analyse de votre CV en cours...</p>
                            <p style={{ color: isDark ? 'rgba(254,250,224,0.4)' : '#8b7e74', fontSize: '14px', margin: 0 }}>
                                Extraction des compétences, langues, formations...
                            </p>
                        </div>
                    )}

                    {analysis && !analyzing && (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {/* Score Card */}
                            <div style={{
                                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                                backdropFilter: isDark ? 'blur(20px)' : 'none',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                                borderRadius: '20px',
                                padding: '32px',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139, 126, 116, 0.06)'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '20px',
                                    color: getScoreColor(analysis.cvScore),
                                    opacity: 0.8
                                }}>
                                    {icons.star}
                                </div>
                                <h3 style={{ 
                                    color: isDark ? '#fefae0' : '#2d2424', 
                                    marginBottom: '12px',
                                    fontSize: '18px',
                                    fontWeight: '600'
                                }}>
                                    Score Global du CV
                                </h3>
                                <div style={{
                                    fontSize: '64px',
                                    fontWeight: '700',
                                    color: getScoreColor(analysis.cvScore),
                                    marginBottom: '8px',
                                    fontFamily: "'Quicksand', sans-serif",
                                    lineHeight: 1
                                }}>
                                    {analysis.cvScore}/100
                                </div>
                                <p style={{ 
                                    color: isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74', 
                                    fontSize: '15px',
                                    marginBottom: '20px'
                                }}>
                                    {getScoreMessage(analysis.cvScore)}
                                </p>
                                
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,0.04)',
                                    borderRadius: '10px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${analysis.cvScore}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${getScoreColor(analysis.cvScore)}, ${getScoreColor(analysis.cvScore)}dd)`,
                                        borderRadius: '10px',
                                        transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }} />
                                </div>
                            </div>

                            {/* Summary Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '15px'
                            }}>
                                {[
                                    { icon: icons.document, value: analysis.summary.wordCount, label: 'Mots', color: '#A87DF7' },
                                    { icon: icons.zap, value: analysis.skills.length, label: 'Compétences', color: '#7ED9A0' },
                                    { icon: icons.globe, value: Object.keys(analysis.languages).length, label: 'Langues', color: '#FFC759' },
                                    { icon: icons.graduation, value: analysis.education.length, label: 'Formations', color: '#FF8E7A' },
                                ].map((stat, idx) => (
                                    <div key={idx} style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                                        backdropFilter: isDark ? 'blur(20px)' : 'none',
                                        border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.1)' : '0 2px 12px rgba(139, 126, 116, 0.04)',
                                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        cursor: 'default'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{ color: stat.color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                                            {stat.icon}
                                        </div>
                                        <div style={{ fontSize: '28px', color: isDark ? '#fefae0' : '#2d2424', fontWeight: '700', fontFamily: "'Quicksand', sans-serif" }}>
                                            {stat.value}
                                        </div>
                                        <div style={{ color: isDark ? 'rgba(254,250,224,0.4)' : '#8b7e74', fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Skills */}
                            <div style={{
                                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                                backdropFilter: isDark ? 'blur(20px)' : 'none',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                                borderRadius: '20px',
                                padding: '28px',
                                boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139, 126, 116, 0.06)'
                            }}>
                                <h3 style={{ 
                                    color: isDark ? '#fefae0' : '#2d2424', 
                                    marginBottom: '16px',
                                    fontSize: '17px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <span style={{ color: '#A87DF7' }}>{icons.zap}</span>
                                    Compétences détectées
                                    <span style={{
                                        background: isDark ? 'rgba(168, 125, 247, 0.15)' : 'rgba(168, 125, 247, 0.08)',
                                        color: '#A87DF7',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {analysis.skills.length}
                                    </span>
                                </h3>
                                {analysis.skills.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {analysis.skills.map((skill, index) => (
                                            <span key={index} style={{
                                                background: isDark ? 'rgba(168, 125, 247, 0.1)' : 'rgba(168, 125, 247, 0.05)',
                                                color: '#A87DF7',
                                                padding: '7px 15px',
                                                borderRadius: '20px',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                border: isDark ? '1px solid rgba(168, 125, 247, 0.2)' : '1px solid rgba(168, 125, 247, 0.12)',
                                                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                cursor: 'default'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.background = isDark ? 'rgba(168, 125, 247, 0.18)' : 'rgba(168, 125, 247, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.background = isDark ? 'rgba(168, 125, 247, 0.1)' : 'rgba(168, 125, 247, 0.05)';
                                            }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: isDark ? 'rgba(254,250,224,0.4)' : '#8b7e74', fontStyle: 'italic', fontSize: '14px', margin: 0 }}>
                                        Aucune compétence technique détectée
                                    </p>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div style={{
                                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                                backdropFilter: isDark ? 'blur(20px)' : 'none',
                                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                                borderRadius: '20px',
                                padding: '28px',
                                boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139, 126, 116, 0.06)'
                            }}>
                                <h3 style={{ 
                                    color: isDark ? '#fefae0' : '#2d2424', 
                                    marginBottom: '16px', 
                                    fontSize: '17px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <span style={{ color: '#8ECAE6' }}>{icons.mail}</span>
                                    Informations de contact
                                </h3>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {analysis.contactInfo.email && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px',
                                            padding: '10px 14px',
                                            background: isDark ? 'rgba(142, 202, 230, 0.05)' : 'rgba(142, 202, 230, 0.04)',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            color: isDark ? '#fefae0' : '#2d2424'
                                        }}>
                                            <span style={{ color: '#8ECAE6' }}>{icons.mail}</span>
                                            <span style={{ flex: 1 }}>{analysis.contactInfo.email}</span>
                                            <span style={{
                                                background: isDark ? 'rgba(126, 217, 160, 0.12)' : 'rgba(126, 217, 160, 0.08)',
                                                color: '#7ED9A0',
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: '600'
                                            }}>
                                                ✓ Détecté
                                            </span>
                                        </div>
                                    )}
                                    {analysis.contactInfo.phone && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px',
                                            padding: '10px 14px',
                                            background: isDark ? 'rgba(142, 202, 230, 0.05)' : 'rgba(142, 202, 230, 0.04)',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            color: isDark ? '#fefae0' : '#2d2424'
                                        }}>
                                            <span style={{ color: '#8ECAE6' }}>{icons.phone}</span>
                                            <span style={{ flex: 1 }}>{analysis.contactInfo.phone}</span>
                                            <span style={{
                                                background: isDark ? 'rgba(126, 217, 160, 0.12)' : 'rgba(126, 217, 160, 0.08)',
                                                color: '#7ED9A0',
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: '600'
                                            }}>
                                                ✓ Détecté
                                            </span>
                                        </div>
                                    )}
                                    {analysis.contactInfo.linkedin && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px',
                                            padding: '10px 14px',
                                            background: isDark ? 'rgba(142, 202, 230, 0.05)' : 'rgba(142, 202, 230, 0.04)',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            color: isDark ? '#fefae0' : '#2d2424'
                                        }}>
                                            <span style={{ color: '#8ECAE6' }}>{icons.linkedin}</span>
                                            <span>{analysis.contactInfo.linkedin}</span>
                                        </div>
                                    )}
                                    {analysis.contactInfo.github && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px',
                                            padding: '10px 14px',
                                            background: isDark ? 'rgba(142, 202, 230, 0.05)' : 'rgba(142, 202, 230, 0.04)',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            color: isDark ? '#fefae0' : '#2d2424'
                                        }}>
                                            <span style={{ color: '#8ECAE6' }}>{icons.github}</span>
                                            <span>{analysis.contactInfo.github}</span>
                                        </div>
                                    )}
                                    {!analysis.contactInfo.email && !analysis.contactInfo.phone && (
                                        <p style={{ color: isDark ? 'rgba(254,250,224,0.4)' : '#8b7e74', fontStyle: 'italic', fontSize: '14px', margin: 0 }}>
                                            Aucune information de contact détectée
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Languages & Education in 2 columns */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '20px'
                            }}>
                                {/* Languages */}
                                <div style={{
                                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                                    backdropFilter: isDark ? 'blur(20px)' : 'none',
                                    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                                    borderRadius: '20px',
                                    padding: '28px',
                                    boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139, 126, 116, 0.06)'
                                }}>
                                    <h3 style={{ 
                                        color: isDark ? '#fefae0' : '#2d2424', 
                                        marginBottom: '16px', 
                                        fontSize: '17px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span style={{ color: '#7ED9A0' }}>{icons.globe}</span>
                                        Langues
                                    </h3>
                                    {Object.keys(analysis.languages).length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {Object.entries(analysis.languages).map(([lang, level]) => (
                                                <div key={lang} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '10px 14px',
                                                    background: isDark ? 'rgba(126, 217, 160, 0.05)' : 'rgba(126, 217, 160, 0.04)',
                                                    borderRadius: '12px',
                                                    border: isDark ? '1px solid rgba(126, 217, 160, 0.1)' : '1px solid rgba(126, 217, 160, 0.08)',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'default'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                                >
                                                    <span style={{ 
                                                        color: isDark ? '#fefae0' : '#2d2424', 
                                                        textTransform: 'capitalize',
                                                        fontSize: '14px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {lang}
                                                    </span>
                                                    <span style={{
                                                        background: isDark ? 'rgba(126, 217, 160, 0.12)' : 'rgba(126, 217, 160, 0.08)',
                                                        color: '#7ED9A0',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {level}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: isDark ? 'rgba(254,250,224,0.4)' : '#8b7e74', fontStyle: 'italic', fontSize: '14px', margin: 0 }}>
                                            Aucune langue détectée
                                        </p>
                                    )}
                                </div>

                                {/* Education */}
                                <div style={{
                                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                                    backdropFilter: isDark ? 'blur(20px)' : 'none',
                                    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                                    borderRadius: '20px',
                                    padding: '28px',
                                    boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139, 126, 116, 0.06)'
                                }}>
                                    <h3 style={{ 
                                        color: isDark ? '#fefae0' : '#2d2424', 
                                        marginBottom: '16px', 
                                        fontSize: '17px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span style={{ color: '#FFC759' }}>{icons.graduation}</span>
                                        Formations
                                    </h3>
                                    {analysis.education.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {analysis.education.map((edu, index) => (
                                                <div key={index} style={{
                                                    padding: '10px 14px',
                                                    background: isDark ? 'rgba(255, 199, 89, 0.05)' : 'rgba(255, 199, 89, 0.04)',
                                                    borderRadius: '12px',
                                                    color: isDark ? '#fefae0' : '#2d2424',
                                                    fontSize: '14px',
                                                    borderLeft: '3px solid #FFC759',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'default'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                                >
                                                    {edu}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: isDark ? 'rgba(254,250,224,0.4)' : '#8b7e74', fontStyle: 'italic', fontSize: '14px', margin: 0 }}>
                                            Aucune formation détectée
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Experience */}
                            {analysis.experienceYears && (
                                <div style={{
                                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                                    backdropFilter: isDark ? 'blur(20px)' : 'none',
                                    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(139, 126, 116, 0.12)',
                                    borderRadius: '20px',
                                    padding: '28px',
                                    boxShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.15)' : '0 4px 24px rgba(139, 126, 116, 0.06)'
                                }}>
                                    <h3 style={{ 
                                        color: isDark ? '#fefae0' : '#2d2424', 
                                        marginBottom: '16px', 
                                        fontSize: '17px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span style={{ color: '#FF8E7A' }}>{icons.briefcase}</span>
                                        Expérience
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px'
                                    }}>
                                        <div style={{
                                            fontSize: '40px',
                                            fontWeight: '700',
                                            color: '#FF8E7A',
                                            fontFamily: "'Quicksand', sans-serif"
                                        }}>
                                            {analysis.experienceYears}
                                        </div>
                                        <div style={{ 
                                            color: isDark ? 'rgba(254,250,224,0.5)' : '#8b7e74', 
                                            fontSize: '15px' 
                                        }}>
                                            années d'expérience détectées
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {analysis.suggestions.length > 0 && (
                                <div style={{
                                    background: isDark ? 'rgba(255, 199, 89, 0.04)' : 'rgba(255, 199, 89, 0.03)',
                                    backdropFilter: isDark ? 'blur(20px)' : 'none',
                                    border: isDark ? '1px solid rgba(255, 199, 89, 0.12)' : '1px solid rgba(255, 199, 89, 0.1)',
                                    borderRadius: '20px',
                                    padding: '28px'
                                }}>
                                    <h3 style={{ 
                                        color: '#f59e0b', 
                                        marginBottom: '16px',
                                        fontSize: '17px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span>{icons.lightbulb}</span>
                                        Suggestions d'amélioration
                                        <span style={{
                                            background: isDark ? 'rgba(255, 199, 89, 0.12)' : 'rgba(255, 199, 89, 0.08)',
                                            color: '#f59e0b',
                                            padding: '3px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {analysis.suggestions.length}
                                        </span>
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {analysis.suggestions.map((suggestion, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '10px',
                                                padding: '12px 16px',
                                                background: isDark ? 'rgba(255, 199, 89, 0.03)' : 'rgba(255, 199, 89, 0.02)',
                                                borderRadius: '12px',
                                                color: isDark ? 'rgba(254,250,224,0.8)' : '#2d2424',
                                                fontSize: '14px',
                                                borderLeft: '3px solid #f59e0b',
                                                transition: 'all 0.2s ease',
                                                cursor: 'default'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                            >
                                                <span style={{ color: '#f59e0b', marginTop: '1px', flexShrink: 0 }}>{icons.bullet}</span>
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reanalyze Button */}
                            <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                <button
                                    onClick={() => analyzeCV(userId)}
                                    disabled={analyzing}
                                    style={{
                                        padding: '13px 32px',
                                        background: analyzing 
                                            ? (isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9') 
                                            : 'linear-gradient(135deg, #6c63ff, #4834d4)',
                                        color: analyzing ? (isDark ? 'rgba(254,250,224,0.3)' : '#94a3b8') : 'white',
                                        border: 'none',
                                        borderRadius: '14px',
                                        cursor: analyzing ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: analyzing ? 'none' : '0 4px 16px rgba(108, 99, 255, 0.2)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!analyzing) e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {analyzing ? (
                                        '⏳ Analyse en cours...'
                                    ) : (
                                        <><span>{icons.refresh}</span> Réanalyser le CV</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

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
                </div>
            )}
            <style>{`
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.15); opacity: 1; }
                }
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
            `}</style>
        </div>
    );
}

export default CVUpload;