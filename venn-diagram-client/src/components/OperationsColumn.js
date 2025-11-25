import React, { useState } from 'react';
import { Dice } from './Dice';

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

        // Try to parse if it looks like a list of DiceRolls
        // The backend returns a list of objects, which might be stringified or passed as array
        // If opResult is an array of objects with die1/die2
        if (Array.isArray(opResult) && opResult.length > 0 && opResult[0].die1) {
            return (
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                    {opResult.map((roll, i) => (
                        <div key={i} title={`(${roll.die1},${roll.die2})`}>
                            <Dice die1={roll.die1} die2={roll.die2} size={24} />
                        </div>
                    ))}
                </div>
            );
        }

        // Fallback for string representation (e.g. "[ (1,1), (1,2) ]")
        // We can try to regex parse it if it's a string
        if (typeof opResult === 'string' && opResult.includes('die1')) {
            try {
                const parsed = JSON.parse(opResult);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].die1) {
                    return (
                        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                            {parsed.map((roll, i) => (
                                <div key={i} title={`(${roll.die1},${roll.die2})`}>
                                    <Dice die1={roll.die1} die2={roll.die2} size={24} />
                                </div>
                            ))}
                        </div>
                    );
                }
            } catch (e) {
                // Ignore parse error, just show string
            }
        }

        return opResult.toString();
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