import React, { useState, useEffect } from 'react';
import { Dice } from './Dice';
import { PlayingCard } from './PlayingCard';

// Helper to get a unique string key for any element
const getElementKey = (element) => {
    if (typeof element === 'object' && element !== null) {
        if ('dice' in element) return `(${element.dice.join(',')})`;
        if ('die1' in element) return `(${element.die1},${element.die2})`;
        if ('rank' in element) return `${element.rank}${element.suit}`;
        return JSON.stringify(element);
    }
    return String(element);
};

// Helper to check if an element exists in a list (handling objects)
const isElementInList = (element, list) => {
    if (!list) return false;
    const key = getElementKey(element);
    return list.some(item => getElementKey(item) === key);
};

// This component is the modal for creating/editing a Set
export const SetEditModal = ({
    isOpen,
    currentSet,
    allElements = [],
    elementType,
    editStatus,
    onClose,
    onSave,
    onDelete
}) => {
    const [setNewName, setSetNewName] = useState('');
    const [setElementMemberships, setSetElementMemberships] = useState({});

    // Smart Set Creation State
    const [creationMode, setCreationMode] = useState('MANUAL'); // 'MANUAL' | 'RULE'

    // Dice Rules
    const [ruleType, setRuleType] = useState('SUM'); // 'SUM' | 'DOUBLES' | 'DIE_VALUE'
    const [condition, setCondition] = useState('EQ'); // 'GT' | 'LT' | 'EQ' | 'EVEN' | 'ODD'
    const [ruleValue, setRuleValue] = useState(7);

    // Card Rules
    const [cardRuleType, setCardRuleType] = useState('SUIT'); // 'SUIT' | 'RANK' | 'COLOR' | 'FACE_CARD'
    const [cardRuleValue, setCardRuleValue] = useState('H'); // H, D, C, S, RED, BLACK, etc.

    const isCreating = currentSet === null;

    // Sync local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSetNewName(isCreating ? '' : currentSet.name);
            setCreationMode('MANUAL'); // Default to manual
            // currentSet.memberElements is the list we get from the API
            const newMemberships = {};
            allElements.forEach(el => {
                const key = getElementKey(el);
                newMemberships[key] = isCreating ? false : isElementInList(el, currentSet.memberElements);
            });
            setSetElementMemberships(newMemberships);
        }
    }, [isOpen, currentSet, isCreating, allElements]);

    const handleCheckboxChange = (element) => {
        const key = getElementKey(element);
        setSetElementMemberships(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const applyRule = () => {
        const newMemberships = { ...setElementMemberships };
        let matchCount = 0;

        allElements.forEach(el => {
            let matches = false;

            if (elementType === 'DICE_ROLL' && typeof el === 'object' && ('dice' in el || 'die1' in el)) {
                const dice = el.dice || [el.die1, el.die2];
                const sum = dice.reduce((a, b) => a + b, 0);

                if (ruleType === 'SUM') {
                    if (condition === 'GT') matches = sum > ruleValue;
                    else if (condition === 'LT') matches = sum < ruleValue;
                    else if (condition === 'EQ') matches = sum === parseInt(ruleValue);
                    else if (condition === 'EVEN') matches = sum % 2 === 0;
                    else if (condition === 'ODD') matches = sum % 2 !== 0;
                } else if (ruleType === 'DOUBLES') {
                    // Check if all dice are the same
                    matches = dice.every(d => d === dice[0]);
                } else if (ruleType === 'DIE_VALUE') {
                    const checkVal = (val) => {
                        if (condition === 'GT') return val > ruleValue;
                        if (condition === 'LT') return val < ruleValue;
                        if (condition === 'EQ') return val === parseInt(ruleValue);
                        if (condition === 'EVEN') return val % 2 === 0;
                        if (condition === 'ODD') return val % 2 !== 0;
                        return false;
                    };
                    matches = dice.some(d => checkVal(d));
                }
            } else if (elementType === 'PLAYING_CARD' && typeof el === 'object' && 'rank' in el) {
                if (cardRuleType === 'SUIT') {
                    matches = el.suit === cardRuleValue;
                } else if (cardRuleType === 'RANK') {
                    matches = el.rank === cardRuleValue;
                } else if (cardRuleType === 'COLOR') {
                    const isRed = el.suit === 'H' || el.suit === 'D';
                    matches = (cardRuleValue === 'RED' && isRed) || (cardRuleValue === 'BLACK' && !isRed);
                } else if (cardRuleType === 'FACE_CARD') {
                    const isFace = ['J', 'Q', 'K'].includes(el.rank);
                    matches = isFace;
                }
            }

            if (matches) {
                newMemberships[getElementKey(el)] = true;
                matchCount++;
            } else {
                // Optional: Do we uncheck non-matches? 
                // Let's decide to ONLY select matches, not deselect others (additive)
                // Or maybe reset? Let's make it replace selection for clarity
                newMemberships[getElementKey(el)] = false;
                if (matches) { // Re-check if it matched (redundant but clear)
                    newMemberships[getElementKey(el)] = true;
                }
            }
        });

        setSetElementMemberships(newMemberships);
        // alert(`Selected ${matchCount} elements based on rule.`);
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave(currentSet ? currentSet.name : null, setNewName, setElementMemberships);
    };

    const handleDelete = () => {
        onDelete(currentSet.name);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <h2 className="mb-md">
                    {isCreating ? 'Create New Set' : `Edit Set: ${currentSet.name}`}
                </h2>

                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label className="label">
                            Set Name:
                        </label>
                        <input
                            type="text"
                            value={setNewName}
                            onChange={e => setSetNewName(e.target.value)}
                            placeholder={isCreating ? 'New set name' : ''}
                            className="input"
                        />
                    </div>

                    {/* Mode Toggle */}
                    {(elementType === 'DICE_ROLL' || elementType === 'PLAYING_CARD') && (
                        <div className="flex gap-md mb-md border-b" style={{ borderColor: 'var(--border)' }}>
                            <button
                                type="button"
                                className={`btn btn-sm ${creationMode === 'MANUAL' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setCreationMode('MANUAL')}
                                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                            >
                                Manual Selection
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${creationMode === 'RULE' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setCreationMode('RULE')}
                                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                            >
                                Rule Builder
                            </button>
                        </div>
                    )}

                    {/* Rule Builder UI */}
                    {creationMode === 'RULE' && (
                        <div className="card mb-md p-md" style={{ background: 'var(--bg-hover)' }}>
                            <h4 className="mb-sm">Define Rule</h4>
                            <div className="flex gap-sm items-center flex-wrap">

                                {/* DICE RULES */}
                                {elementType === 'DICE_ROLL' && (
                                    <>
                                        <select
                                            className="input"
                                            style={{ width: 'auto' }}
                                            value={ruleType}
                                            onChange={e => setRuleType(e.target.value)}
                                        >
                                            <option value="SUM">Sum of Dice</option>
                                            <option value="DOUBLES">Doubles (e.g. 1,1)</option>
                                            <option value="DIE_VALUE">Specific Die Value</option>
                                        </select>

                                        {ruleType !== 'DOUBLES' && (
                                            <select
                                                className="input"
                                                style={{ width: 'auto' }}
                                                value={condition}
                                                onChange={e => setCondition(e.target.value)}
                                            >
                                                <option value="EQ">Equals (=)</option>
                                                <option value="GT">Greater Than (&gt;)</option>
                                                <option value="LT">Less Than (&lt;)</option>
                                                <option value="EVEN">Is Even</option>
                                                <option value="ODD">Is Odd</option>
                                            </select>
                                        )}

                                        {ruleType !== 'DOUBLES' && !['EVEN', 'ODD'].includes(condition) && (
                                            <input
                                                type="number"
                                                className="input"
                                                style={{ width: '80px' }}
                                                value={ruleValue}
                                                onChange={e => setRuleValue(e.target.value)}
                                            />
                                        )}
                                    </>
                                )}

                                {/* CARD RULES */}
                                {elementType === 'PLAYING_CARD' && (
                                    <>
                                        <select
                                            className="input"
                                            style={{ width: 'auto' }}
                                            value={cardRuleType}
                                            onChange={e => {
                                                const newType = e.target.value;
                                                setCardRuleType(newType);
                                                // Reset value based on type
                                                if (newType === 'SUIT') setCardRuleValue('H');
                                                else if (newType === 'RANK') setCardRuleValue('A');
                                                else if (newType === 'COLOR') setCardRuleValue('RED');
                                                else if (newType === 'FACE_CARD') setCardRuleValue(''); // No value needed
                                            }}
                                        >
                                            <option value="SUIT">Suit</option>
                                            <option value="RANK">Rank</option>
                                            <option value="COLOR">Color</option>
                                            <option value="FACE_CARD">Face Cards</option>
                                        </select>

                                        {cardRuleType === 'SUIT' && (
                                            <select
                                                className="input"
                                                style={{ width: 'auto' }}
                                                value={cardRuleValue}
                                                onChange={e => setCardRuleValue(e.target.value)}
                                            >
                                                <option value="H">Hearts (♥)</option>
                                                <option value="D">Diamonds (♦)</option>
                                                <option value="C">Clubs (♣)</option>
                                                <option value="S">Spades (♠)</option>
                                            </select>
                                        )}

                                        {cardRuleType === 'RANK' && (
                                            <select
                                                className="input"
                                                style={{ width: 'auto' }}
                                                value={cardRuleValue}
                                                onChange={e => setCardRuleValue(e.target.value)}
                                            >
                                                {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        )}

                                        {cardRuleType === 'COLOR' && (
                                            <select
                                                className="input"
                                                style={{ width: 'auto' }}
                                                value={cardRuleValue}
                                                onChange={e => setCardRuleValue(e.target.value)}
                                            >
                                                <option value="RED">Red</option>
                                                <option value="BLACK">Black</option>
                                            </select>
                                        )}
                                    </>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={applyRule}
                                >
                                    Apply Rule
                                </button>
                            </div>
                            <p className="text-muted text-sm mt-sm mb-0">
                                Clicking "Apply Rule" will select all matching elements below.
                            </p>
                        </div>
                    )}

                    <h4 className="mt-md mb-sm">
                        Selected Elements ({Object.values(setElementMemberships).filter(Boolean).length}):
                    </h4>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid var(--border)',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--radius)'
                    }}>
                        {allElements && allElements.length > 0 ? allElements.map((el, idx) => {
                            const key = getElementKey(el);
                            const isDice = elementType === 'DICE_ROLL' && typeof el === 'object' && ('dice' in el || 'die1' in el);
                            const isCard = elementType === 'PLAYING_CARD' && typeof el === 'object' && 'rank' in el;

                            const diceValues = isDice ? (el.dice || [el.die1, el.die2]) : [];

                            return (
                                <label key={key} className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={setElementMemberships[key] || false}
                                        onChange={() => handleCheckboxChange(el)}
                                    />
                                    {isDice ? (
                                        <div className="flex items-center gap-sm">
                                            <Dice dice={diceValues} size={20} />
                                            <span className="text-sm text-muted">({diceValues.join(',')})</span>
                                        </div>
                                    ) : isCard ? (
                                        <div className="flex items-center gap-sm">
                                            <PlayingCard rank={el.rank} suit={el.suit} size={30} />
                                            <span className="text-sm text-muted">{el.rank}{el.suit}</span>
                                        </div>
                                    ) : (
                                        <span>{String(el)}</span>
                                    )}
                                </label>
                            );
                        }) : <p className="text-muted">No elements exist. Create an element first.</p>}
                    </div>

                    <div className="flex justify-between mt-lg pt-md" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="flex gap-sm">
                            <button type="submit" className="btn btn-primary">
                                {isCreating ? 'Create Set' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                        {!isCreating && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn btn-danger"
                            >
                                Delete Set
                            </button>
                        )}
                    </div>
                </form>

                {editStatus && (
                    <pre className="mt-md p-sm text-sm" style={{ background: 'var(--bg-hover)', borderRadius: 'var(--radius)' }}>
                        {editStatus}
                    </pre>
                )}
            </div>
        </div>
    );
};