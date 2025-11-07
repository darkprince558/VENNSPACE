import React, { useState } from 'react';

// This component renders the "Set Operations" card
export const OperationsColumn = ({
                                     setNames,
                                     opResult,
                                     defaultSetA,
                                     defaultSetB,
                                     onRunOperation
                                 }) => {
    // These states are now local to this component
    const [operation, setOperation] = useState('union');
    const [setA, setSetA] = useState(defaultSetA || (setNames.length > 0 ? setNames[0] : ''));
    const [setB, setSetB] = useState(defaultSetB || (setNames.length > 0 ? setNames[0] : ''));

    // Update local state if props change (e.g., after set list is fetched)
    React.useEffect(() => {
        if (setNames.length > 0) {
            if (!setA) setSetA(setNames[0]);
            if (!setB) setSetB(setNames[0]);
        }
    }, [setNames, setA, setB]);

    const handleRun = () => {
        onRunOperation(operation, setA, setB);
    };

    return (
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
            <h2>Set Operations</h2>
            <div style={{ marginBottom: '10px' }}>
                <label>
                    Operation:
                    <select value={operation} onChange={e => setOperation(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
                        <option value="union">{'Union (A \u222A B)'}</option>
                        <option value="intersection">{'Intersection (A \u2229 B)'}</option>
                        <option value="difference">{'Difference (A \\ B)'}</option>
                        <option value="complement">{'Complement (A\')'}</option>
                    </select>
                </label>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label>
                    Set A:
                    <select value={setA} onChange={e => setSetA(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
                        {setNames.length > 0 ?
                            setNames.map(name => <option key={name} value={name}>{name}</option>) :
                            <option>No sets available</option>
                        }
                    </select>
                </label>
            </div>
            {operation !== 'complement' && (
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Set B:
                        <select value={setB} onChange={e => setSetB(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
                            {setNames.length > 0 ?
                                setNames.map(name => <option key={name} value={name}>{name}</option>) :
                                <option>No sets available</option>
                            }
                        </select>
                    </label>
                </div>
            )}
            <button onClick={handleRun} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }} disabled={setNames.length === 0}>
                Run Operation
            </button>
            <h3 style={{ marginTop: '20px' }}>Result:</h3>
            <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', minHeight: '50px' }}>
        {opResult}
      </pre>
        </div>
    );
};