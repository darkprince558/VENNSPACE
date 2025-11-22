import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* Wrap the App in BrowserRouter to enable routing */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);