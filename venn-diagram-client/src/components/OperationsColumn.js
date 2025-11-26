import React, { useState } from 'react';
import { Dice } from './Dice';
import { PlayingCard } from './PlayingCard';

// This component renders the "Set Operations" card
export const OperationsColumn = ({
    setNames = [],
    opResult,
    defaultSetA,
    defaultSetB,
    onRunOperation,
    totalElements,
    showProbability
}) => {
    const safeSetNames = setNames || [];
    // These states are now local to this component
    const [operation, setOperation] = useState('union');
    const [setA, setSetA] = useState(defaultSetA || (safeSetNames.length > 0 ? safeSetNames[0] : ''));
    const [setB, setSetB] = useState(defaultSetB || (safeSetNames.length > 0 ? safeSetNames[0] : ''));

    // Update local state if props change (e.g., after set list is fetched)
    React.useEffect(() => {
        if (safeSetNames.length > 0) {
            if (!setA) setSetA(safeSetNames[0]);
            if (!setB) setSetB(safeSetNames[0]);
        }
    }, [safeSetNames, setA, setB]);

    const handleRun = () => {
        onRunOperation(operation, setA, setB);
    };

    // Helper to render the result content
    const renderResult = () => {
        if (!opResult) return null;

        // If it's a string (error message or legacy), show it
        if (typeof opResult === 'string') return opResult;

        if (Array.isArray(opResult)) {
            if (opResult.length === 0) return <span className="text-muted">Empty Set</span>;

            // Check for Dice (supports both old {die1, die2} and new {dice: []} formats)
            if (opResult[0].dice !== undefined || opResult[0].die1 !== undefined) {
                return (
                    <div className="result-list">
                        {opResult.map((roll, i) => {
                            const diceValues = roll.dice || [roll.die1, roll.die2];
                            return (
                                <div key={i} className="result-item">
                                    <div className="flex gap-sm">
                                        <Dice dice={diceValues} size={24} />
                                    </div>
                                    <span className="text-muted">({diceValues.join(', ')})</span>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            // Check for Cards
            if (opResult[0].rank !== undefined && opResult[0].suit !== undefined) {
                return (
                    <div className="result-list">
                        {opResult.map((card, i) => (
                            <div key={i} className="result-item">
                                <PlayingCard rank={card.rank} suit={card.suit} size={40} />
                                <span className="text-muted">{card.rank}{card.suit}</span>
                            </div>
                        ))}
                    </div>
                );
            }

            // Default: List of strings/numbers
            return (
                <div className="result-list">
                    {opResult.map((item, i) => (
                        <div key={i} className="result-item">
                            <span style={{ fontWeight: 500 }}>
                                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }

        return String(opResult);
    };

    return (
        <div className="card" style={{ flex: 1, minWidth: '300px' }}>
            <h2 className="mb-md">Set Operations</h2>
            <div className="form-group">
                <label className="label">
                    Operation:
                </label>
                <select
                    value={operation}
                    onChange={e => setOperation(e.target.value)}
                    className="select"
                >
                    <option value="union">{'Union (A \u222A B)'}</option>
                    <option value="intersection">{'Intersection (A \u2229 B)'}</option>
                    <option value="difference">{'Difference (A \\ B)'}</option>
                    <option value="complement">{'Complement (A\')'}</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label">
                    Set A:
                </label>
                <select
                    value={setA}
                    onChange={e => setSetA(e.target.value)}
                    className="select"
                >
                    {safeSetNames.length > 0 ?
                        safeSetNames.map(name => <option key={name} value={name}>{name}</option>) :
                        <option>No sets available</option>
                    }
                </select>
            </div>
            {operation !== 'complement' && (
                <div className="form-group">
                    <label className="label">
                        Set B:
                    </label>
                    <select
                        value={setB}
                        onChange={e => setSetB(e.target.value)}
                        className="select"
                    >
                        {safeSetNames.length > 0 ?
                            safeSetNames.map(name => <option key={name} value={name}>{name}</option>) :
                            <option>No sets available</option>
                        }
                    </select>
                </div>
            )}
            <button
                onClick={handleRun}
                className="btn btn-primary w-100"
                style={{ width: '100%' }}
                disabled={safeSetNames.length === 0}
            >
                Run Operation
            </button>
            <h3 className="mt-lg mb-sm flex justify-between items-center">
                <span>Result:</span>
                {opResult && showProbability && (
                    <span className="text-muted text-sm" style={{ fontWeight: 'normal' }}>
                        {(() => {
                            let count = 0;
                            if (Array.isArray(opResult)) {
                                count = opResult.length;
                            } else if (typeof opResult === 'string') {
                                // Try to parse if stringified JSON
                                try {
                                    const parsed = JSON.parse(opResult);
                                    if (Array.isArray(parsed)) count = parsed.length;
                                } catch (e) {
                                    // Fallback for simple strings or formatted lists
                                    // This is rough, but better than nothing
                                    if (opResult.includes('die1')) {
                                        const diceRegex = /\((\d),(\d)\)/g;
                                        const matches = [...opResult.matchAll(diceRegex)];
                                        count = matches.length;
                                    } else {
                                        // Assume comma separated if not empty
                                        if (opResult.trim().length > 0 && opResult !== '[]') {
                                            count = opResult.split(',').length;
                                        }
                                    }
                                }
                            }
                            const percentage = totalElements > 0 ? ((count / totalElements) * 100).toFixed(1) : '0.0';
                            return `${count} items (${percentage}%)`;
                        })()}
                    </span>
                )}
            </h3>
            <div className="code-block">
                {renderResult()}
            </div>
        </div>
    );
};