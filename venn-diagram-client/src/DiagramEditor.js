import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import all our components and API functions
import * as api from './api/api';
import { SetList } from './components/SetList';
import { ElementList } from './components/ElementList';
import { OperationsColumn } from './components/OperationsColumn';
import { PartitionsColumn } from './components/PartitionsColumn';
import { ElementEditModal } from './components/ElementEditModal';
import { SetEditModal } from './components/SetEditModal';

// FIX: Changed to a default export
export default function DiagramEditor() {
    const { diagramId } = useParams(); // Get diagramId from the URL
    const navigate = useNavigate();

    // --- State Hooks ---
    const [diagramName, setDiagramName] = useState('');
    const [elementType, setElementType] = useState('STRING');
    const [setNames, setSetNames] = useState([]);
    const [setsInfo, setSetsInfo] = useState([]); // Store full SetDTOs {name, size}
    const [partitions, setPartitions] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allElements, setAllElements] = useState([]);
    const [opResult, setOpResult] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    const [showProbability, setShowProbability] = useState(false);
    const [showPartitions, setShowPartitions] = useState(true);

    // --- Element Modal State ---
    const [isElementModalOpen, setIsElementModalOpen] = useState(false);
    const [currentElement, setCurrentElement] = useState(null);

    // --- Set Modal State ---
    const [isSetModalOpen, setIsSetModalOpen] = useState(false);
    const [currentSet, setCurrentSet] = useState(null);

    // --- Data Fetching ---
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Pass the diagramId to the API
            const {
                diagramName,
                elementType,
                setsData,
                partitionsData,
                elementsData
            } = await api.fetchAllData(diagramId);

            setDiagramName(diagramName);
            setElementType(elementType);

            // setsData is now List<SetDTO> {name, size}
            const safeSetsData = setsData || [];
            setSetsInfo(safeSetsData);
            setSetNames(safeSetsData.map(s => s.name));

            setPartitions(partitionsData || '');
            setAllElements(elementsData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [diagramId]); // Now depends on diagramId

    // Initial Data Load
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // --- Event Handlers for Set Operations ---
    const handleRunOperation = async (operation, setA, setB) => {
        setOpResult('Loading query...');
        try {
            const data = await api.runOperation(diagramId, operation, setA, setB);
            setOpResult(data);
        } catch (error) {
            setOpResult(`Error: ${error.message}`);
        }
    };


    // --- Handlers for Element Modal ---
    const handleOpenCreateElementModal = () => {
        setEditStatus('');
        setCurrentElement(null);
        setIsElementModalOpen(true);
    };

    const getApiElementName = (element) => {
        if (typeof element === 'object' && element !== null && 'die1' in element) {
            return `(${element.die1},${element.die2})`;
        }
        return element;
    };

    const handleOpenEditElementModal = async (elementName) => {
        setEditStatus('');
        try {
            const apiName = getApiElementName(elementName);
            const memberSets = await api.getElementDetails(diagramId, apiName);
            setCurrentElement({ name: elementName, memberSets });
            setIsElementModalOpen(true);
        } catch (error) {
            setEditStatus(`Error: ${error.message}`);
        }
    };

    const handleCloseElementModal = () => setIsElementModalOpen(false);

    const handleSaveElementModal = async (oldName, newName, elementSetMemberships) => {
        if (!newName) {
            setEditStatus('Error: Element name cannot be empty.');
            return;
        }
        const isCreating = oldName === null;
        const actionText = isCreating ? 'Creating' : 'Updating';
        setEditStatus(`${actionText} "${newName}"...`);

        try {
            const oldApiName = getApiElementName(oldName);
            const newApiName = getApiElementName(newName);

            const isRename = !isCreating && newApiName !== oldApiName;
            if (isRename) {
                await api.renameElement(diagramId, oldApiName, newApiName);
            }

            const setsToJoin = Object.keys(elementSetMemberships)
                .filter(setName => elementSetMemberships[setName] === true);

            // For creation/update membership, we use the new name
            await api.updateElementMembership(diagramId, newApiName, setsToJoin);

            setEditStatus(`Successfully ${actionText.toLowerCase()}d: ${newApiName}`);
            handleCloseElementModal();
            await fetchAllData();

        } catch (error) {
            setEditStatus(`Error: ${error.message}`);
        }
    };

    const handleDeleteElementModal = async (elementName) => {
        const apiName = getApiElementName(elementName);
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete "${apiName}"?`)) {
            return;
        }
        setEditStatus(`Deleting "${apiName}"...`);
        try {
            await api.deleteElement(diagramId, apiName);
            setEditStatus(`Successfully deleted: ${apiName}`);
            handleCloseElementModal();
            await fetchAllData();
        } catch (error) {
            setEditStatus(`Error: ${error.message}`);
        }
    };


    // --- Handlers for Set Modal ---
    const handleOpenCreateSetModal = () => {
        setEditStatus('');
        setCurrentSet(null);
        setIsSetModalOpen(true);
    };

    const handleOpenEditSetModal = async (setName) => {
        setEditStatus('');
        try {
            const memberElements = await api.getSetDetails(diagramId, setName);
            setCurrentSet({ name: setName, memberElements });
            setIsSetModalOpen(true);
        } catch (error) {
            setEditStatus(`Error: ${error.message}`);
        }
    };

    const handleCloseSetModal = () => setIsSetModalOpen(false);

    const handleSaveSetModal = async (oldName, newName, setElementMemberships) => {
        if (!newName) {
            setEditStatus('Error: Set name cannot be empty.');
            return;
        }

        const isCreating = oldName === null;
        const actionText = isCreating ? 'Creating' : 'Updating';
        setEditStatus(`${actionText} set "${newName}"...`);

        try {
            if (isCreating) {
                await api.createSet(diagramId, newName);
            } else if (newName !== oldName) {
                await api.renameSet(diagramId, oldName, newName);
            }

            const elementsToJoin = Object.keys(setElementMemberships)
                .filter(elementName => setElementMemberships[elementName] === true);

            await api.updateSetMembership(diagramId, newName, elementsToJoin);

            setEditStatus(`Successfully ${actionText.toLowerCase()}d: ${newName}`);
            handleCloseSetModal();
            await fetchAllData();

        } catch (error) {
            setEditStatus(`Error: ${error.message}`);
        }
    };

    const handleDeleteSetModal = async (setName) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete the set "${setName}"?`)) {
            return;
        }
        setEditStatus(`Deleting set "${setName}"...`);
        try {
            await api.deleteSet(diagramId, setName);
            setEditStatus(`Successfully deleted: ${setName}`);
            handleCloseSetModal();
            await fetchAllData();
        } catch (error) {
            setEditStatus(`Error: ${error.message}`);
        }
    };

    // --- Render ---
    if (error) {
        return (
            <div className="layout-container text-center text-danger">
                <h2>Error loading diagram</h2>
                <p>{error.message}</p>
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>
        );
    }



    return (
        <div>
            {/* New Toolbar */}
            <div className="toolbar">
                <div className="flex items-center gap-md">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/dashboard')}
                        style={{ border: 'none', background: 'transparent', padding: '4px 8px' }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>&larr;</span>
                    </button>
                    <h2 className="toolbar-title">{isLoading ? 'Loading...' : diagramName}</h2>
                </div>

                <div className="flex items-center gap-lg">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            className="toggle-input"
                            checked={showProbability}
                            onChange={e => setShowProbability(e.target.checked)}
                        />
                        Probability
                    </label>
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            className="toggle-input"
                            checked={showPartitions}
                            onChange={e => setShowPartitions(e.target.checked)}
                        />
                        Partitions
                    </label>
                </div>
            </div>

            <div className="layout-container">
                <div className="flex gap-lg" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>

                    {/* Column 1: Management */}
                    <div className="flex flex-col gap-md" style={{ flex: 1, minWidth: '300px' }}>
                        <SetList
                            setNames={setNames}
                            setsInfo={setsInfo}
                            totalElements={allElements.length}
                            showProbability={showProbability}
                            onOpenCreateSetModal={handleOpenCreateSetModal}
                            onOpenEditSetModal={handleOpenEditSetModal}
                        />
                        <ElementList
                            elements={allElements}
                            elementType={elementType}
                            onOpenCreateElementModal={handleOpenCreateElementModal}
                            onOpenEditElementModal={handleOpenEditElementModal}
                        />
                        {/* Status message area for all editors */}
                        {editStatus && (
                            <div className="card" style={{ padding: '10px', background: 'var(--bg-hover)' }}>
                                <pre className="mb-0 text-sm" style={{ whiteSpace: 'pre-wrap' }}>{editStatus}</pre>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Operations */}
                    <OperationsColumn
                        setNames={setNames}
                        opResult={opResult}
                        totalElements={allElements.length}
                        showProbability={showProbability}
                        onRunOperation={handleRunOperation}
                    />

                    {/* Column 3: Partitions */}
                    {showPartitions && (
                        <PartitionsColumn
                            partitions={partitions}
                            totalElements={allElements.length}
                            showProbability={showProbability}
                            isLoading={isLoading}
                        />
                    )}

                    {/* Modals */}
                    <ElementEditModal
                        isOpen={isElementModalOpen}
                        currentElement={currentElement}
                        elementType={elementType}
                        setNames={setNames}
                        editStatus={editStatus}
                        onClose={handleCloseElementModal}
                        onSave={handleSaveElementModal}
                        onDelete={handleDeleteElementModal}
                    />

                    <SetEditModal
                        isOpen={isSetModalOpen}
                        currentSet={currentSet}
                        allElements={allElements}
                        elementType={elementType}
                        editStatus={editStatus}
                        onClose={handleCloseSetModal}
                        onSave={handleSaveSetModal}
                        onDelete={handleDeleteSetModal}
                    />

                </div>
            </div>
        </div>
    );
}