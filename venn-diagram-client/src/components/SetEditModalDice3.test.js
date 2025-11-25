import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SetEditModal } from './SetEditModal';

describe('SetEditModal 3-Dice Rules', () => {
    const mockOnSave = jest.fn();
    const mockOnClose = jest.fn();
    const allElements = [
        { dice: [1, 1, 1] }, // Sum 3, All Same
        { dice: [1, 2, 3] }, // Sum 6
        { dice: [2, 2, 2] }, // Sum 6, All Same
        { dice: [4, 5, 6] }, // Sum 15
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('applies SUM rule correctly for 3 dice', () => {
        render(
            <SetEditModal
                isOpen={true}
                currentSet={null}
                allElements={allElements}
                elementType="DICE_ROLL"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText('Rule Builder'));

        // Default is SUM = 7. Let's change to SUM = 6
        fireEvent.change(screen.getByDisplayValue('7'), { target: { value: '6' } });
        fireEvent.click(screen.getByText('Apply Rule'));

        const checkbox123 = screen.getByLabelText(/\(1,2,3\)/);
        const checkbox222 = screen.getByLabelText(/\(2,2,2\)/);
        const checkbox111 = screen.getByLabelText(/\(1,1,1\)/);

        expect(checkbox123).toBeChecked();
        expect(checkbox222).toBeChecked();
        expect(checkbox111).not.toBeChecked();
    });

    test('applies DOUBLES (All Same) rule correctly for 3 dice', () => {
        render(
            <SetEditModal
                isOpen={true}
                currentSet={null}
                allElements={allElements}
                elementType="DICE_ROLL"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText('Rule Builder'));

        fireEvent.change(screen.getByDisplayValue('Sum of Dice'), { target: { value: 'DOUBLES' } });
        fireEvent.click(screen.getByText('Apply Rule'));

        const checkbox111 = screen.getByLabelText(/\(1,1,1\)/);
        const checkbox222 = screen.getByLabelText(/\(2,2,2\)/);
        const checkbox123 = screen.getByLabelText(/\(1,2,3\)/);

        expect(checkbox111).toBeChecked();
        expect(checkbox222).toBeChecked();
        expect(checkbox123).not.toBeChecked();
    });
});
