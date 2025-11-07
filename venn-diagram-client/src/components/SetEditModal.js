import React, { useState, useEffect } from 'react';

// This component is the modal for creating/editing a Set
export const SetEditModal = ({
                                 isOpen,
                                 currentSet,
                                 allElements,
                                 editStatus,
                                 onClose,
                                 onSave,
                                 onDelete
                             }) => {
    const [setNewName, setSetNewName] = useState('');
    const [setElementMemberships, setSetElementMemberships] = useState({});

    const isCreating = currentSet === null;

    // Sync local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSetNewName(isCreating ? '' : currentSet.name);
            // currentSet.memberElements is the list we get from the API
            const newMemberships = {};
            allElements.forEach(name => {
                newMemberships[name] = isCreating ? false : currentSet.memberElements.includes(name);
            });
            setSetElementMemberships(newMemberships);
        }
    }, [isOpen, currentSet, isCreating, allElements]);

    const handleCheckboxChange = (elementName) => {
        setSetElementMemberships(prev => ({ ...prev, [elementName]: !prev[elementName] }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave(currentSet ? currentSet.name : null, setNewName, setElementMemberships);
    };

    const handleDelete = () => {
        onDelete(currentSet.name);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
                <h2 style={{ marginTop: 0 }}>
                    {isCreating ? 'Create New Set' : `Edit Set: ${currentSet.name}`}
                </h2>

                <form onSubmit={handleSave}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Set Name:
                            <input
                                type="text"
                                value={setNewName}
                                onChange={e => setSetNewName(e.target.value)}
                                placeholder={isCreating ? 'New set name' : ''}
                                style={{ padding: '5px', marginLeft: '10px', width: 'calc(100% - 120px)' }}
                            />
                        </label>
                    </div>

                    <h4 style={{marginTop: '15px', marginBottom: '10px'}}>Element Membership (Quick Menu):</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
                        {allElements.length > 0 ? allElements.map(name => (
                            <label key={name}>
                                <input
                                    type="checkbox"
                                    checked={setElementMemberships[name] || false}
                                    onChange={() => handleCheckboxChange(name)}
                                />
                                {name}
                            </label>
                        )) : <p>No elements exist. Create an element first.</p>}
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                                {isCreating ? 'Create Set' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={onClose} style={{ marginLeft: '10px', padding: '10px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
                                Cancel
                            </button>
                        </div>
                        {!isCreating && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                style={{ padding: '10px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                Delete Set
                            </button>
                        )}
                    </div>
                </form>

                {editStatus && (
                    <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '15px' }}>
            {editStatus}
          </pre>
                )}
            </div>
        </div>
    );
};