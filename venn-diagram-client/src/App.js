import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import DiagramEditor from './DiagramEditor';


function App() {
    // Theme State
    const [theme, setTheme] = useState('light');

    // Toggle Theme
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Apply Theme to HTML element
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div>
            <header className="card" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0, padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                <div className="layout-container flex justify-between items-center" style={{ padding: 0 }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 className="mb-0 text-primary" style={{ cursor: 'pointer' }}>
                            VennSpace
                        </h1>
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="btn btn-secondary btn-sm"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                </div>
            </header>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/diagram/:diagramId" element={<DiagramEditor />} />
            </Routes>
        </div>
    );
}

// FIX: Added default export
export default App;