import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from './api/api';
import { DiceCountModal } from './components/DiceCountModal';

// FIX: Changed to a default export
export default function Dashboard() {
    const [diagrams, setDiagrams] = useState([]);
    const [newDiagramName, setNewDiagramName] = useState('');
    const [newDiagramType, setNewDiagramType] = useState('STRING');
    const [template, setTemplate] = useState('DECK_OF_CARDS');
    const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);
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
    // Helper to perform the API call
    const createTemplate = async (templateName) => {
        console.log("Attempting to create from template:", templateName);
        setIsLoading(true);
        try {
            const newDiagram = await api.createTemplateDiagram(templateName);
            console.log("Creation successful:", newDiagram);
            navigate(`/diagram/${newDiagram.diagramId}`);
        } catch (err) {
            console.error("Creation failed:", err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    // Handler for creating from a template
    const handleCreateFromTemplate = async (e) => {
        e.preventDefault();
        if (template === 'DICE_ROLLS') {
            setIsDiceModalOpen(true);
        } else {
            createTemplate(template);
        }
    };

    const handleDiceConfirm = (count) => {
        setIsDiceModalOpen(false);
        createTemplate(`DICE_ROLLS_${count}`);
    };

    if (isLoading && diagrams.length === 0) {
        return (
            <div className="layout-container text-center">
                <p className="text-muted">Loading diagrams...</p>
            </div>
        );
    }

    return (
        <div className="layout-container">
            <h1 className="text-center mb-0">Venn Diagram Manager</h1>
            <p className="text-center text-muted">Create and manage your diagram spaces</p>

            <div className="flex flex-col gap-lg mt-md">

                {/* Create Blank Project */}
                <div className="card">
                    <h2>Create a New Diagram Space</h2>
                    <form onSubmit={handleCreateBlank} className="flex gap-md items-center" style={{ flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                className="input"
                                value={newDiagramName}
                                onChange={(e) => setNewDiagramName(e.target.value)}
                                placeholder="New Space Name"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <select
                                className="select"
                                value={newDiagramType}
                                onChange={(e) => setNewDiagramType(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="STRING">Text</option>
                                <option value="NUMBER">Numbers</option>
                                <option value="IMAGE_URL">Images</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isLoading || !newDiagramName}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                </div>

                {/* Create from Template */}
                <div className="card">
                    <h2>Create from Template</h2>
                    <form onSubmit={handleCreateFromTemplate} className="flex gap-md items-center">
                        <div style={{ flex: 1 }}>
                            <select
                                className="select"
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="DECK_OF_CARDS">Standard 52-Card Deck</option>
                                <option value="DICE_ROLLS">Dice Rolls</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-secondary" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                </div>

                {/* Existing Projects */}
                <div className="card">
                    <h2>Load Existing Project</h2>
                    {error && <div className="text-danger mb-md">{error}</div>}

                    {diagrams.length > 0 ? (
                        <ul className="list-none">
                            {diagrams.map(diag => (
                                <li
                                    key={diag.diagramId}
                                    className="list-item list-item-action"
                                    onClick={() => !isLoading && navigate(`/diagram/${diag.diagramId}`)}
                                >
                                    <div>
                                        <span className="font-bold">{diag.name}</span>
                                        <span className="text-muted text-sm" style={{ marginLeft: '10px' }}>({diag.elementType})</span>
                                    </div>
                                    <span className="text-muted">&rarr;</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No projects found. Create one above!</p>
                    )}
                </div>
            </div>
            <DiceCountModal
                isOpen={isDiceModalOpen}
                onClose={() => setIsDiceModalOpen(false)}
                onConfirm={handleDiceConfirm}
            />
        </div>
    );
}