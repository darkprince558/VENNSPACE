import React from 'react';

/**
 * Renders the "All Sets" card
 */
export const SetList = ({ setNames, onOpenCreateSetModal, onOpenEditSetModal }) => {
    return (
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
    );
};