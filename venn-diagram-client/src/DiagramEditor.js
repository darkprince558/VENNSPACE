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
    const [partitions, setPartitions] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allElements, setAllElements] = useState([]);
    const [opResult, setOpResult] = useState(null);
    const [editStatus, setEditStatus] = useState('');

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
            setSetNames(setsData);
            setPartitions(partitionsData);
            setAllElements(elementsData);

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
            const resultString = `[ ${data.join(', ')} ]`;
            setOpResult(resultString);
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

    const handleOpenEditElementModal = async (elementName) => {
        setEditStatus('');
        try {
            const memberSets = await api.getElementDetails(diagramId, elementName);
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
            const isRename = !isCreating && newName !== oldName;
            if (isRename) {
                await api.renameElement(diagramId, oldName, newName);
            }

            const setsToJoin = Object.keys(elementSetMemberships)
                .filter(setName => elementSetMemberships[setName] === true);

            await api.updateElementMembership(diagramId, newName, setsToJoin);

            setEditStatus(`Successfully ${actionText.toLowerCase()}d: ${newName}`);
            handleCloseElementModal();
            await fetchAllData();

        } catch (error) {
            setEditStatus(`Error: ${error.message}`);
        }
    };

    const handleDeleteElementModal = async (elementName) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete "${elementName}"?`)) {
            return;
        }
        setEditStatus(`Deleting "${elementName}"...`);
        try {
            await api.deleteElement(diagramId, elementName);
            setEditStatus(`Successfully deleted: ${elementName}`);
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
            <div style={{ color: 'red', padding: '20px' }}>
                <h2>Error loading diagram</h2>
                <p>{error.message}</p>
                <button onClick={() => navigate('/')}>Back to Dashboard</button>
            </div>
        );
    }

    // Header for the diagram editor page
    const header = (
        <div style={{ padding: '0 20px 20px 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => navigate('/')} style={{ padding: '8px 12px' }}>
                &larr; Back
            </button>
            <div>
                <h2 style={{ margin: 0 }}>{isLoading ? 'Loading...' : diagramName}</h2>
                <span style={{ color: '#666', fontSize: '0.9em' }}>
          ID: {diagramId} (Type: {elementType})
        </span>
            </div>
        </div>
    );

    return (
        <div>
            {header}
            <div style={{ display: 'flex', fontFamily: 'sans-serif', padding: '0 20px 20px 20px', gap: '20px', flexWrap: 'wrap' }}>

                {/* Column 1: Management */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px' }}>
                    <SetList
                        setNames={setNames}
                        onOpenCreateSetModal={handleOpenCreateSetModal}
                        onOpenEditSetModal={handleOpenEditSetModal}
                    />
                    <ElementList
                        allElements={allElements}
                        elementType={elementType}
                        onOpenCreateElementModal={handleOpenCreateElementModal}
                        onOpenEditElementModal={handleOpenEditElementModal}
                    />
                    {/* Status message area for all editors */}
                    {editStatus && (
                        <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
              {editStatus}
            </pre>
                    )}
                </div>

                {/* Column 2: Operations */}
                <OperationsColumn
                    setNames={setNames}
                    opResult={opResult}
                    onRunOperation={handleRunOperation}
                />

                {/* Column 3: Partitions */}
                <PartitionsColumn
                    partitions={partitions}
                    isLoading={isLoading}
                />

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
                    // FIX: Corrected typo 'editDStatus' to 'editStatus'
                    editStatus={editStatus}
                    onClose={handleCloseSetModal}
                    onSave={handleSaveSetModal}
                    onDelete={handleDeleteSetModal}
                />

            </div>
        </div>
    );
}