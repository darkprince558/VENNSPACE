import React from 'react';

/**
 * Renders the "All Sets" card
 */
export const SetList = ({ setsInfo = [], onOpenCreateSetModal, onOpenEditSetModal, totalElements, showProbability }) => {
    const safeSetsInfo = setsInfo || [];
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
                {safeSetsInfo.length > 0 ? safeSetsInfo.map(set => {
                    const percentage = totalElements > 0 ? ((set.size / totalElements) * 100).toFixed(1) : '0.0';
                    return (
                        <button
                            key={set.name}
                            onClick={() => onOpenEditSetModal(set.name)}
                            className="list-item list-item-action w-100"
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ fontWeight: 500 }}>{set.name}</span>
                            {showProbability && (
                                <span className="text-muted text-sm" style={{ background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: '4px' }}>
                                    {set.size} items ({percentage}%)
                                </span>
                            )}
                        </button>
                    );
                }) : <p className="text-muted p-sm mb-0">No sets exist.</p>}
            </div>
        </div>
    );
};