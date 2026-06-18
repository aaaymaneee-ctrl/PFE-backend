import { useTheme } from './ThemeContext.jsx';
import { Outlet } from 'react-router-dom';
import Bar from './Bar';
import { useEffect } from 'react';

function Layout() {
    const { isDark } = useTheme();


        useEffect(() => {
        document.body.style.backgroundColor = isDark ? '#0f172a' : '#f1f5f9';
        document.body.style.transition = 'background-color 0.3s ease';
    }, [isDark]);

    useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
        root.style.setProperty('--page-background', '#0f172a');
    } else {
        root.style.setProperty('--page-background', '#f1f5f9');
    }
    }, [isDark]);

    useEffect(() => {
        if (isDark) {
            document.body.style.background = '#0f172a';
            document.body.style.color = '#ffffff';
        } else {
            document.body.style.background = '#f1f5f9';
            document.body.style.color = '#0f172a';
        }
    }, [isDark]);
    return (
        <div style={{ 
            display: 'flex',
            minHeight: '100vh',
            width: '100vw',
            position: 'relative'
        }}>
            <Bar />
            
            <div style={{ 
                flex: 1,
                padding: '40px',
                overflowY: 'auto',
                minWidth: 0,
                background: 'transparent'
            }}>
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;