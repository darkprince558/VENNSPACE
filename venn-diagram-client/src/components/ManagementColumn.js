import React from 'react';

// This component renders the two "management" cards for Sets and Elements
export const ManagementColumn = ({
                                     setNames,
                                     allElements,
                                     editStatus,
                                     onOpenCreateSetModal,
                                     onOpenEditSetModal,
                                     onOpenCreateElementModal,
                                     onOpenEditElementModal
                                 }) => {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px' }}>

            {/* Card 1a: All Sets */}
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>All Sets</h2>
                    <button
                        onClick={onOpenCreateSetModal}
                        style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Create New
                    </button>
                </div>
                <p style={{marginTop: '10px', marginBottom: '10px', fontSize: '0.9em', color: '#999'}}>
                    Click a set to edit it.
                </p>
                <div style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    padding: '5px'
                }}>
                    {setNames.length > 0 ? setNames.map(name => (
                        <button
                            key={name}
                            onClick={() => onOpenEditSetModal(name)}
                            style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '8px 10px', border: 'none', background: 'transparent',
                                cursor: 'pointer', borderBottom: '1px solid #f0f0f0'
                            }}
                        >
                            {name}
                        </button>
                    )) : <p style={{padding: '10px'}}>No sets exist.</p>}
                </div>
            </div>

            {/* Card 1b: All Elements */}
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>All Elements</h2>
                    <button
                        onClick={onOpenCreateElementModal}
                        style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Create New
                    </button>
                </div>
                <p style={{marginTop: '10px', marginBottom: '10px', fontSize: '0.9em', color: '#999'}}>
                    Click an element to edit or delete it.
                </p>
                <div style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    padding: '5px'
                }}>
                    {allElements.length > 0 ? allElements.map(name => (
                        <button
                            key={name}
                            onClick={() => onOpenEditElementModal(name)}
                            style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '8px 10px', border: 'none', background: 'transparent',
                                cursor: 'pointer', borderBottom: '1px solid #f0f0f0'
                            }}
                        >
                            {name}
                        </button>
                    )) : <p style={{padding: '10px'}}>No elements exist.</p>}
                </div>
            </div>

            {/* Status message area for all editors */}
            {editStatus && (
                <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '15px' }}>
          {editStatus}
        </pre>
            )}
        </div>
    );
};