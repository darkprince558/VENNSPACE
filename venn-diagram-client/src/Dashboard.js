import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from './api/api';

// FIX: Changed to a default export
export default function Dashboard() {
    const [diagrams, setDiagrams] = useState([]);
    const [newDiagramName, setNewDiagramName] = useState('');
    const [newDiagramType, setNewDiagramType] = useState('STRING');
    const [template, setTemplate] = useState('DECK_OF_CARDS');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch all existing diagrams
    const fetchDiagrams = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.fetchDiagrams();
            setDiagrams(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDiagrams();
    }, [fetchDiagrams]);

    // Handler for creating a blank project
    const handleCreateBlank = async (e) => {
        e.preventDefault();
        if (!newDiagramName) return;
        setIsLoading(true);
        try {
            const newDiagram = await api.createBlankDiagram(newDiagramName, newDiagramType);
            navigate(`/diagram/${newDiagram.diagramId}`);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    // Handler for creating from a template
    const handleCreateFromTemplate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newDiagram = await api.createTemplateDiagram(template);
            navigate(`/diagram/${newDiagram.diagramId}`);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const styles = {
        dashboard: { padding: '20px', maxWidth: '800px', margin: 'auto' },
        card: { border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
        input: { padding: '8px', marginRight: '10px', minWidth: '200px' },
        select: { padding: '8px', marginRight: '10px' },
        button: { padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
        diagramList: { listStyle: 'none', padding: 0 },
        diagramItem: { padding: '10px', border: '1px solid #eee', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' },
        error: { color: 'red', marginTop: '10px' },
    };

    if (isLoading && diagrams.length === 0) return <div style={styles.dashboard}>Loading diagrams...</div>;

    return (
        <div style={styles.dashboard}>

            {/* Card 1: Create Blank Project */}
            <div style={styles.card}>
                <h2>Create a New Diagram Space</h2>
                <form onSubmit={handleCreateBlank}>
                    <input
                        type="text"
                        value={newDiagramName}
                        onChange={(e) => setNewDiagramName(e.target.value)}
                        placeholder="New Space Name"
                        style={styles.input}
                        disabled={isLoading}
                    />
                    <select
                        value={newDiagramType}
                        onChange={(e) => setNewDiagramType(e.target.value)}
                        style={styles.select}
                        disabled={isLoading}
                    >
                        <option value="STRING">Text</option>
                        <option value="NUMBER">Numbers</option>
                        <option value="IMAGE_URL">Images</option>
                    </select>
                    <button type="submit" style={styles.button} disabled={isLoading || !newDiagramName}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>

            {/* Card 2: Create from Template */}
            <div style={styles.card}>
                <h2>Create from Template</h2>
                <form onSubmit={handleCreateFromTemplate}>
                    <select
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        style={styles.select}
                        disabled={isLoading}
                    >
                        <option value="DECK_OF_CARDS">Standard 52-Card Deck</option>
                        <option value="TWO_DICE_ROLLS">Two 6-Sided Dice</option>
                    </select>
                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>

            {/* Card 3: Load Existing Project */}
            <div style={styles.card}>
                <h2>Load Existing Project</h2>
                {error && <div style={styles.error}>{error}</div>}
                {diagrams.length > 0 ? (
                    <ul style={styles.diagramList}>
                        {diagrams.map(diag => (
                            <li
                                key={diag.diagramId}
                                style={styles.diagramItem}
                                onClick={() => !isLoading && navigate(`/diagram/${diag.diagramId}`)}
                            >
                                <span>{diag.name} <i>({diag.elementType})</i></span>
                                <span>&rarr;</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No projects found. Create one!</p>
                )}
            </div>

        </div>
    );
}