import React from 'react';

/**
 * Renders a single element in the list, adapting to its type.
 */
const ElementItem = ({ element, elementType, onClick }) => {
    const style = {
        display: 'block', width: '100%', textAlign: 'left',
        padding: '8px 10px', border: 'none', background: 'transparent',
        cursor: 'pointer', borderBottom: '1px solid #f0f0f0'
    };

    const handleClick = () => onClick(element);

    // Adaptive Rendering based on elementType
    if (elementType === 'IMAGE_URL') {
        return (
            <button onClick={handleClick} style={{...style, padding: '5px 10px'}}>
                <img
                    src={element}
                    alt={element}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px', verticalAlign: 'middle' }}
                    // Handle broken images
                    onError={(e) => { e.target.style.display = 'none'; e.target.insertAdjacentHTML('afterend', '<span>(Broken Image Link)</span>'); }}
                />
                <span style={{ verticalAlign: 'middle', fontSize: '0.9em', color: '#555' }}>{element}</span>
            </button>
        );
    }

    // Default for STRING or NUMBER
    return (
        <button onClick={handleClick} style={style}>
            {element.toString()}
        </button>
    );
};

/**
 * Renders the "All Elements" card
 */
export const ElementList = ({ allElements, elementType, onOpenCreateElementModal, onOpenEditElementModal }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>All Elements</h2>
                <button
                    onClick={onOpenCreateElementModal}
                    style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    + Create New
                </button>
            </div>
            <p style={{marginTop: '10px', marginBottom: '10px', fontSize: '0.9em', color: '#999'}}>
                Click an element to edit or delete it.
            </p>
            <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #eee',
                borderRadius: '5px',
                padding: '5px'
            }}>
                {allElements.length > 0 ? allElements.map(element => (
                    <ElementItem
                        key={element.toString()} // Use element.toString() as key
                        element={element}
                        elementType={elementType}
                        onClick={onOpenEditElementModal}
                    />
                )) : <p style={{padding: '10px'}}>No elements exist.</p>}
            </div>
        </div>
    );
};