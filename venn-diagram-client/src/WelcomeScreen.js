import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.svg';

export default function WelcomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="layout-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center'
        }}>
            <img src={logo} alt="VennSpace Logo" style={{ height: '150px', marginBottom: 'var(--spacing-lg)' }} />

            <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                Welcome to <span className="text-primary">VennSpace</span>
            </h1>

            <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: 'var(--spacing-xl)' }}>
                Explore the intersection of possibilities. Create, manage, and analyze sets with our powerful Venn diagram tools.
            </p>

            <button
                className="btn btn-primary"
                style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                onClick={() => navigate('/dashboard')}
            >
                Get Started &rarr;
            </button>
        </div>
    );
}
