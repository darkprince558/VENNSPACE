import React, { useMemo } from 'react';

// This component renders the "Live Partitions" card
export const PartitionsColumn = ({ partitions, isLoading }) => {
    return (
        <div style={{ flex: 2, border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '400px' }}>
            <h2>Live Partitions</h2>
            {isLoading ? (
                <p>Loading...</p>
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
        const lines = partitionText.split('\n');
        const data = [];
        const lineRegex = /Region (\d+) \((.*)\): \[(.*)]/;
        for (const line of lines) {
            const match = line.match(lineRegex);
            if (match) {
                data.push({
                    region: match[1],
                    description: match[2],
                    elements: match[3] || ' (empty)',
                });
            }
        }
        return data;
    }, [partitionText]);

    if (parsedPartitions.length === 0) {
        return <p>No partitions to display. Add some elements!</p>;
    }

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Region</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Elements</th>
            </tr>
            </thead>
            <tbody>
            {parsedPartitions.map(row => (
                <tr key={row.region}>
                    <td style={{ padding: '8px', border: '1px solid #ddd', verticalAlign: 'top' }}>{row.region}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', verticalAlign: 'top' }}>{row.description}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', verticalAlign: 'top', wordBreak: 'break-word' }}>{row.elements}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};