import { PlayingCard } from './PlayingCard';
import { Dice } from './Dice';

import React, { useMemo } from 'react';

// This component renders the "Live Partitions" card
export const PartitionsColumn = ({ partitions, isLoading, totalElements, showProbability }) => {
    return (
        <div className="card" style={{ flex: 2, minWidth: '400px' }}>
            <h2 className="mb-md">Live Partitions</h2>
            {isLoading ? (
                <p className="text-muted">Loading...</p>
            ) : (
                <div style={{ overflowX: 'auto', maxHeight: '700px' }}>
                    <PartitionTable partitionText={partitions} totalElements={totalElements} showProbability={showProbability} />
                </div>
            )}
        </div>
    );
};

/**
 * A dedicated component to parse and display the partition text
 * in a clean table.
 */
const PartitionTable = ({ partitionText, totalElements, showProbability }) => {
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
                let isCard = false;
                let count = 0;

                const diceRegex = /\{"die1":(\d+),"die2":(\d+)\}/g; // Updated to match JSON format if changed, but wait, formatter outputs JSON now?
                // Wait, let's check VennDiagramFormatter.java again.
                // But wait, the previous regex was /\((\d),(\d)\)/g; which matched the OLD toString() format.
                // I changed the formatter to output JSON for DiceRoll too!
                // So I need to update Dice parsing as well.

                const diceJsonRegex = /\{"dice":\s*\[(.*?)\]\}/g; // Matches {"dice": [1, 2]}
                const cardJsonRegex = /\{"rank":"([^"]+)","suit":"([^"]+)"\}/g;

                const diceMatches = [...elementsRaw.matchAll(diceJsonRegex)];
                const cardMatches = [...elementsRaw.matchAll(cardJsonRegex)];

                if (diceMatches.length > 0) {
                    elements = diceMatches.map(m => {
                        // m[1] is "1, 2"
                        const dice = m[1].split(',').map(s => parseInt(s.trim()));
                        return { dice };
                    });
                    isDice = true;
                    count = diceMatches.length;
                } else if (cardMatches.length > 0) {
                    elements = cardMatches.map(m => ({ rank: m[1], suit: m[2] }));
                    isCard = true;
                    count = cardMatches.length;
                } else {
                    // Fallback for old format or simple strings
                    // Old dice format: {"die1":1,"die2":2} or (1,2)
                    const oldDiceJsonRegex = /\{"die1":(\d+),"die2":(\d+)\}/g;
                    const oldDiceMatches = [...elementsRaw.matchAll(oldDiceJsonRegex)];

                    if (oldDiceMatches.length > 0) {
                        elements = oldDiceMatches.map(m => ({ dice: [parseInt(m[1]), parseInt(m[2])] }));
                        isDice = true;
                        count = oldDiceMatches.length;
                    } else if (elementsRaw.trim() === '') {
                        elements = ' (empty)';
                        count = 0;
                    } else {
                        const parts = elementsRaw.split(',').filter(s => s.trim().length > 0);
                        count = parts.length;
                    }
                }

                data.push({
                    region: match[1],
                    description: match[2],
                    elements: elements,
                    isDice: isDice,
                    isCard: isCard,
                    count: count
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
                    {showProbability && (
                        <th style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', textAlign: 'left' }}>Stats</th>
                    )}
                    <th style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', textAlign: 'left' }}>Elements</th>
                </tr>
            </thead>
            <tbody>
                {parsedPartitions.map(row => {
                    const percentage = totalElements > 0 ? ((row.count / totalElements) * 100).toFixed(1) : '0.0';
                    return (
                        <tr key={row.region}>
                            <td style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', verticalAlign: 'top' }}>{row.region}</td>
                            <td style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', verticalAlign: 'top' }}>{row.description}</td>
                            {showProbability && (
                                <td style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                                    <div style={{ fontWeight: 'bold' }}>{row.count} items</div>
                                    <div className="text-muted text-sm">{percentage}%</div>
                                </td>
                            )}
                            <td style={{ padding: 'var(--spacing-sm)', border: '1px solid var(--border)', verticalAlign: 'top', wordBreak: 'break-word' }}>
                                {row.isDice ? (
                                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                        {row.elements.map((d, i) => (
                                            <div key={i} title={`(${d.dice.join(',')})`}>
                                                <Dice dice={d.dice} size={20} />
                                            </div>
                                        ))}
                                    </div>
                                ) : row.isCard ? (
                                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                        {row.elements.map((c, i) => (
                                            <div key={i} title={`${c.rank}${c.suit}`}>
                                                <PlayingCard rank={c.rank} suit={c.suit} size={30} />
                                            </div>
                                        ))}
                                    </div>
                                ) : row.elements}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};