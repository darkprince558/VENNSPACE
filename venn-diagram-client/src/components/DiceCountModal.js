import React, { useState } from 'react';

export const DiceCountModal = ({ isOpen, onClose, onConfirm }) => {
    const [count, setCount] = useState(2);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!count || count < 1 || count > 5) return;
        onConfirm(count);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="mb-md">Select Dice Count</h2>
                <p className="text-muted mb-md">How many dice would you like to roll?</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Number of Dice (1-5)</label>
                        <input
                            type="number"
                            className="input"
                            min="1"
                            max="5"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            autoFocus
                        />
                    </div>
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
