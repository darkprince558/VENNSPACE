import React, { useMemo } from 'react';
import { Dice } from './Dice';

// This component renders the "Live Partitions" card
export const PartitionsColumn = ({ partitions, isLoading }) => {
    return (
        <div className="card" style={{ flex: 2, minWidth: '400px' }}>
            <h2 className="mb-md">Live Partitions</h2>
            {isLoading ? (
                <p className="text-muted">Loading...</p>
            ) : (
                <div style={{ overflowX: 'auto', maxHeight: '700px' }}>
                    <PartitionTable partitionText={partitions} />
                </div>
            )}
        </div>
    );
};

/**
 * A dedicated component to parse and display the partition text
 * in a clean table.
 */
const PartitionTable = ({ partitionText }) => {
    const parsedPartitions = useMemo(() => {
        if (!partitionText) return [];
        // The partition text format is: "Region <mask> (<desc>): [elements]"
        // Elements might be a string list "[ (1,1), (2,2) ]" or object list JSON
        const lines = partitionText.split('\n');
        const data = [];
        const lineRegex = /Region (\d+) \((.*)\): \[(.*)]/;

        for (const line of lines) {
            const match = line.match(lineRegex);
            if (match) {
                let elementsRaw = match[3] || '';
                let elements = elementsRaw;
                let isDice = false;

                // Try to detect if elements are DiceRoll objects
                // This is a bit hacky because we are parsing the string representation from the backend
                // Ideally backend should return structured data for partitions too
                if (elementsRaw.includes('DiceRoll')) {
                    // If backend toString() includes class name, or if we can regex match
                    // For now, let's assume the backend toString is "(d1,d2)" which is what we implemented
                    // But if we want to be smarter, we might need to parse the JSON if available
                }

                // If the backend returns JSON for partitions, we could parse it. 
                // Currently it returns a formatted string. 
                // Let's rely on the string format "(d1,d2)" for now, but we can't easily distinguish 
                // between string "(1,2)" and dice roll (1,2) without more context.
                // However, we can check if the string matches the dice pattern and try to render it.

                const diceRegex = /\((\d),(\d)\)/g;
                const diceMatches = [...elementsRaw.matchAll(diceRegex)];

                if (diceMatches.length > 0) {
                    elements = diceMatches.map(m => ({ die1: parseInt(m[1]), die2: parseInt(m[2]) }));
                    isDice = true;
                } else if (elementsRaw.trim() === '') {
                    elements = ' (empty)';
                }

                data.push({
                    region: match[1],
                    description: match[2],
                    elements: elements,
                    isDice: isDice
                });
            }
        }
        return data;
    }, [partitionText]);

    if (parsedPartitions.length === 0) {
        return <p className="text-muted">No partitions to display. Add some elements!</p>;
    }

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ background: 'var(--bg-hover)' }}>
                    <th style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', textAlign: 'left' }}>Region</th>
                    <th style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', textAlign: 'left' }}>Elements</th>
                </tr>
            </thead>
            <tbody>
                {parsedPartitions.map(row => (
                    <tr key={row.region}>
                        <td style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', verticalAlign: 'top' }}>{row.region}</td>
                        <td style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', verticalAlign: 'top' }}>{row.description}</td>
                        <td style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', verticalAlign: 'top', wordBreak: 'break-word' }}>
                            {row.isDice ? (
                                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                    {row.elements.map((d, i) => (
                                        <div key={i} title={`(${d.die1},${d.die2})`}>
                                            <Dice die1={d.die1} die2={d.die2} size={20} />
                                        </div>
                                    ))}
                                </div>
                            ) : row.elements}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};