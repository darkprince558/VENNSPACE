import React, { useState, useEffect, useCallback } from 'react';

// Import all our new components and API functions
import * as api from './api/api';
import { ManagementColumn } from './components/ManagementColumn';
import { OperationsColumn } from './components/OperationsColumn';
import { PartitionsColumn } from './components/PartitionsColumn';
import { ElementEditModal } from './components/ElementEditModal';
import { SetEditModal } from './components/SetEditModal';

function App() {
    // --- State Hooks ---
    // These all remain here, as App is the "owner" of all state
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
            // We now call our new api.js function
            const { setsData, partitionsData, elementsData } = await api.fetchAllData();

            setSetNames(setsData);
            setPartitions(partitionsData);
            setAllElements(elementsData);

        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []); // This no longer needs any dependencies

    // Initial Data Load
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);


    // --- Event Handlers for Set Operations ---
    const handleRunOperation = async (operation, setA, setB) => {
        setOpResult('Loading query...');
        try {
            // Call the API
            const data = await api.runOperation(operation, setA, setB);
            const resultString = `[ ${data.join(', ')} ]`;
            setOpResult(resultString);
        } catch (error) {
            setOpResult(`Error: ${error.message}`);
        }
    };


    // --- Handlers for Element Modal ---

    const handleOpenCreateElementModal = () => {
        setEditStatus('');
        setCurrentElement(null); // null = "Create" mode
        setIsElementModalOpen(true);
    };

    const handleOpenEditElementModal = async (elementName) => {
        setEditStatus('');
        try {
            // Fetch the element's current sets
            const memberSets = await api.getElementDetails(elementName);
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
            // Step 1: Handle Rename (if necessary)
            if (!isCreating && newName !== oldName) {
                await api.renameElement(oldName, newName);
            }

            // Step 2: Update Memberships
            const setsToJoin = Object.keys(elementSetMemberships)
                .filter(setName => elementSetMemberships[setName] === true);

            await api.updateElementMembership(newName, setsToJoin);

            setEditStatus(`Successfully ${actionText.toLowerCase()}d: ${newName}`);
            handleCloseElementModal();
            await fetchAllData(); // REFRESH ALL DATA

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
            await api.deleteElement(elementName);
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
        setCurrentSet(null); // null = "Create" mode
        setIsSetModalOpen(true);
    };

    const handleOpenEditSetModal = async (setName) => {
        setEditStatus('');
        try {
            // Fetch the set's current elements
            const memberElements = await api.getSetDetails(setName);
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
            // Step 1: Handle Create or Rename
            if (isCreating) {
                await api.createSet(newName);
            } else if (newName !== oldName) {
                await api.renameSet(oldName, newName);
            }

            // Step 2: Update Set Membership
            const elementsToJoin = Object.keys(setElementMemberships)
                .filter(elementName => setElementMemberships[elementName] === true);

            await api.updateSetMembership(newName, elementsToJoin);

            setEditStatus(`Successfully ${actionText.toLowerCase()}d: ${newName}`);
            handleCloseSetModal();
            await fetchAllData(); // REFRESH ALL DATA

        } catch (error)
        {
            setEditStatus(`Error: ${error.message}`);
        }
    };

    const handleDeleteSetModal = async (setName) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete the set "${setName}"?`)) {
            return;
        }
        setEditStatus(`Deleting set "${setName}"...`);
        try {
            await api.deleteSet(setName);
            setEditStatus(`Successfully deleted: ${setName}`);
            handleCloseSetModal();
            await fetchAllData();
        } catch (error) {
            setEditStatus(`Error: ${error.message}`);
        }
    };

    // --- Render ---
    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>Error: {error.message}</div>;
    }

    // The JSX is now just a clean layout of components
    return (
        <div style={{ display: 'flex', fontFamily: 'sans-serif', padding: '20px', gap: '20px', flexWrap: 'wrap' }}>

            <ManagementColumn
                setNames={setNames}
                allElements={allElements}
                editStatus={editStatus}
                onOpenCreateSetModal={handleOpenCreateSetModal}
                onOpenEditSetModal={handleOpenEditSetModal}
                onOpenCreateElementModal={handleOpenCreateElementModal}
                onOpenEditElementModal={handleOpenEditElementModal}
            />

            <OperationsColumn
                setNames={setNames}
                opResult={opResult}
                onRunOperation={handleRunOperation}
            />

            <PartitionsColumn
                partitions={partitions}
                isLoading={isLoading}
            />

            <ElementEditModal
                isOpen={isElementModalOpen}
                currentElement={currentElement}
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
                editStatus={editStatus}
                onClose={handleCloseSetModal}
                onSave={handleSaveSetModal}
                onDelete={handleDeleteSetModal}
            />

        </div>
    );
}

export default App;