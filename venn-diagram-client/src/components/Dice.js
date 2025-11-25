import React from 'react';

const DieFace = ({ value, size = 40 }) => {
    const dotSize = size / 5;
    const padding = size / 4;
    const center = size / 2;
    const far = size - padding;

    // Dot positions
    const dots = [];
    if (value % 2 === 1) dots.push([center, center]); // Center dot for 1, 3, 5
    if (value > 1) {
        dots.push([padding, padding]); // Top-left
        dots.push([far, far]);         // Bottom-right
    }
    if (value > 3) {
        dots.push([far, padding]);     // Top-right
        dots.push([padding, far]);     // Bottom-left
    }
    if (value === 6) {
        dots.push([padding, center]);  // Middle-left
        dots.push([far, center]);      // Middle-right
    }

    return (
        <svg width={size} height={size} style={{ display: 'inline-block', margin: '2px' }}>
            <rect
                x="0" y="0" width={size} height={size} rx={size / 5} ry={size / 5}
                fill="white" stroke="#333" strokeWidth="2"
            />
            {dots.map((pos, i) => (
                <circle key={i} cx={pos[0]} cy={pos[1]} r={dotSize / 2} fill="#333" />
            ))}
        </svg>
    );
};

export const Dice = ({ die1, die2, size = 30 }) => {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <DieFace value={die1} size={size} />
            <DieFace value={die2} size={size} />
        </div>
    );
};
