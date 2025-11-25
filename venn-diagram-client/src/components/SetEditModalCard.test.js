import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SetEditModal } from './SetEditModal';

describe('SetEditModal Card Rules', () => {
    const mockOnSave = jest.fn();
    const mockOnClose = jest.fn();
    const allElements = [
        { rank: 'A', suit: 'H' }, // Red, Heart, Ace
        { rank: '10', suit: 'S' }, // Black, Spade, 10
        { rank: 'K', suit: 'D' }, // Red, Diamond, King (Face)
        { rank: '3', suit: 'C' }, // Black, Club, 3
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('applies SUIT rule correctly', () => {
        render(
            <SetEditModal
                isOpen={true}
                currentSet={null}
                allElements={allElements}
                elementType="PLAYING_CARD"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText('Rule Builder'));

        // Default is SUIT = Hearts
        fireEvent.click(screen.getByText('Apply Rule'));

        const checkboxAH = screen.getByLabelText(/AH/);
        const checkbox10S = screen.getByLabelText(/10S/);

        expect(checkboxAH).toBeChecked();
        expect(checkbox10S).not.toBeChecked();
    });

    test('applies FACE_CARD rule correctly', () => {
        render(
            <SetEditModal
                isOpen={true}
                currentSet={null}
                allElements={allElements}
                elementType="PLAYING_CARD"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText('Rule Builder'));

        fireEvent.change(screen.getByDisplayValue('Suit'), { target: { value: 'FACE_CARD' } });
        fireEvent.click(screen.getByText('Apply Rule'));

        const checkboxAH = screen.getByLabelText(/AH/); // Ace is not face card usually? Wait, logic says J, Q, K.
        const checkboxKD = screen.getByLabelText(/KD/);

        expect(checkboxAH).not.toBeChecked();
        expect(checkboxKD).toBeChecked();
    });

    test('applies COLOR rule correctly', () => {
        render(
            <SetEditModal
                isOpen={true}
                currentSet={null}
                allElements={allElements}
                elementType="PLAYING_CARD"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText('Rule Builder'));

        fireEvent.change(screen.getByDisplayValue('Suit'), { target: { value: 'COLOR' } });
        // Default is RED
        fireEvent.click(screen.getByText('Apply Rule'));

        const checkboxAH = screen.getByLabelText(/AH/); // Red
        const checkbox10S = screen.getByLabelText(/10S/); // Black

        expect(checkboxAH).toBeChecked();
        expect(checkbox10S).not.toBeChecked();
    });
});
