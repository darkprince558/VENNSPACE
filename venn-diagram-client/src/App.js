import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import DiagramEditor from './DiagramEditor';


function App() {
    return (
        <div>
            <h1 style={{ padding: '10px 20px', margin: 0, background: '#99aec4', borderBottom: '1px solid #ddd' }}>
                VennSpace
            </h1>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/diagram/:diagramId" element={<DiagramEditor />} />
            </Routes>
        </div>
    );
}

// FIX: Added default export
export default App;