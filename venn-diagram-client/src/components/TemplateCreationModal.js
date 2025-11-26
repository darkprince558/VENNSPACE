import React, { useState, useEffect } from 'react';

export const TemplateCreationModal = ({ isOpen, onClose, onConfirm, templateType }) => {
    const [name, setName] = useState('');
    const [diceCount, setDiceCount] = useState(2);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setName('');
            setDiceCount(2);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isDice = templateType === 'DICE_ROLLS';
    const title = isDice ? 'Create Dice Roll Diagram' : 'Create Card Diagram';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isDice && (!diceCount || diceCount < 1 || diceCount > 5)) return;

        onConfirm({
            name: name.trim() || undefined, // Send undefined if empty so backend uses default
            diceCount: isDice ? diceCount : undefined
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="mb-md">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Diagram Name</label>
                        <input
                            type="text"
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isDice ? "My Dice Rolls" : "My Card Deck"}
                            autoFocus
                        />
                    </div>

                    {isDice && (
                        <div className="form-group">
                            <label className="label">Number of Dice (1-5)</label>
                            <input
                                type="number"
                                className="input"
                                min="1"
                                max="5"
                                value={diceCount}
                                onChange={(e) => setDiceCount(parseInt(e.target.value))}
                            />
                        </div>
                    )}

                    <div className="flex justify-between mt-lg">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
