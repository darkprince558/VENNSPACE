import React from 'react';

export const PlayingCard = ({ rank, suit, size = 60 }) => {
    const isRed = suit === 'H' || suit === 'D';
    const color = isRed ? '#e74c3c' : '#2c3e50';

    const getSuitSymbol = (s) => {
        switch (s) {
            case 'H': return '♥';
            case 'D': return '♦';
            case 'C': return '♣';
            case 'S': return '♠';
            default: return '?';
        }
    };

    const symbol = getSuitSymbol(suit);

    // Scale font sizes based on card height (size)
    // Assuming standard card ratio roughly 2.5:3.5 or similar
    // Let's make it a bit rectangular
    const width = size * 0.7;
    const height = size;
    const fontSize = size * 0.4;
    const smallFontSize = size * 0.25;

    return (
        <div style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: 'white',
            border: `1px solid ${color}`,
            borderRadius: `${size * 0.1}px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: `${size * 0.05}px`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: color,
            userSelect: 'none',
            position: 'relative'
        }}>
            {/* Top Left */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                lineHeight: 1,
                position: 'absolute',
                top: '2px',
                left: '2px'
            }}>
                <span style={{ fontSize: `${smallFontSize}px`, fontWeight: 'bold' }}>{rank}</span>
                <span style={{ fontSize: `${smallFontSize}px` }}>{symbol}</span>
            </div>

            {/* Center */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                fontSize: `${fontSize}px`
            }}>
                {symbol}
            </div>

            {/* Bottom Right (Rotated) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                lineHeight: 1,
                transform: 'rotate(180deg)',
                position: 'absolute',
                bottom: '2px',
                right: '2px'
            }}>
                <span style={{ fontSize: `${smallFontSize}px`, fontWeight: 'bold' }}>{rank}</span>
                <span style={{ fontSize: `${smallFontSize}px` }}>{symbol}</span>
            </div>
        </div>
    );
};
