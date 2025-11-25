import React from 'react';
import { Dice } from './Dice';

/**
 * Renders a single element in the list, adapting to its type.
 */
const ElementItem = ({ element, onClick, elementType }) => {
    const handleClick = () => {
        onClick(element);
    };

    // Check if element is a DiceRoll object (has die1 and die2)
    const isDice = elementType === 'DICE_ROLL' && element && typeof element === 'object' && 'die1' in element;

    return (
        <button
            onClick={handleClick}
            className="list-item list-item-action w-100 flex items-center"
            style={{
                width: '100%',
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border)'
            }}
        >
            {isDice ? (
                <Dice die1={element.die1} die2={element.die2} size={30} />
            ) : elementType === 'IMAGE_URL' ? (
                <img
                    src={element}
                    alt={element}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.insertAdjacentHTML('afterend', '<span class="text-danger text-sm">(Broken Image)</span>'); }}
                />
            ) : null}

            <span className="text-sm text-muted" style={{ marginLeft: isDice ? '10px' : '0' }}>
                {isDice ? `(${element.die1},${element.die2})` : element}
            </span>
        </button>
    );
};

/**
 * Renders the "All Elements" card
 */
export const ElementList = ({
    elements = [],
    onOpenCreateElementModal,
    onOpenEditElementModal,
    elementType
}) => {
    return (
        <div className="card">
            <div className="flex justify-between items-center mb-md">
                <h2 className="mb-0">All Elements</h2>
                <button
                    onClick={onOpenCreateElementModal}
                    className="btn btn-primary btn-sm"
                >
                    + Create New
                </button>
            </div>
            <p className="text-muted text-sm mb-sm">
                Click an element to edit or delete it.
            </p>
            <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--spacing-xs)'
            }}>
                {elements && elements.length > 0 ? elements.map((el, idx) => (
                    <ElementItem
                        key={idx}
                        element={el}
                        onClick={onOpenEditElementModal}
                        elementType={elementType}
                    />
                )) : <p className="text-muted p-sm mb-0">No elements exist.</p>}
            </div>
        </div>
    );
};