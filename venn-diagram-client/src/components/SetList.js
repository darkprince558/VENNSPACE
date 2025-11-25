import React from 'react';

/**
 * Renders the "All Sets" card
 */
export const SetList = ({ setNames = [], onOpenCreateSetModal, onOpenEditSetModal }) => {
    return (
        <div className="card">
            <div className="flex justify-between items-center mb-md">
                <h2 className="mb-0">All Sets</h2>
                <button
                    onClick={onOpenCreateSetModal}
                    className="btn btn-primary btn-sm"
                >
                    + Create New
                </button>
            </div>
            <p className="text-muted text-sm mb-sm">
                Click a set to edit it.
            </p>
            <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--spacing-xs)'
            }}>
                {setNames && setNames.length > 0 ? setNames.map(name => (
                    <button
                        key={name}
                        onClick={() => onOpenEditSetModal(name)}
                        className="list-item list-item-action w-100"
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--border)'
                        }}
                    >
                        {name}
                    </button>
                )) : <p className="text-muted p-sm mb-0">No sets exist.</p>}
            </div>
        </div>
    );
};