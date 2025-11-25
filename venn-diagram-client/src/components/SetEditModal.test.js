import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SetEditModal } from './SetEditModal';

describe('SetEditModal Smart Sets', () => {
    const mockOnSave = jest.fn();
    const mockOnClose = jest.fn();
    const allElements = [
        { die1: 1, die2: 1 }, // Sum 2, Doubles
        { die1: 3, die2: 4 }, // Sum 7
        { die1: 5, die2: 5 }, // Sum 10, Doubles
        { die1: 6, die2: 3 }, // Sum 9
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders manual mode by default', () => {
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
        expect(screen.getByText('Manual Selection')).toHaveClass('btn-primary');
        expect(screen.queryByText('Define Rule')).not.toBeInTheDocument();
    });

    test('switches to rule mode', () => {
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
        expect(screen.getByText('Define Rule')).toBeInTheDocument();
    });

    test('applies SUM > 8 rule correctly', () => {
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

        // Switch to Rule Mode
        fireEvent.click(screen.getByText('Rule Builder'));

        // Set Rule: Sum > 8
        // Default is Sum EQ 7. Change condition to GT and value to 8.
        fireEvent.change(screen.getByDisplayValue('Equals (=)'), { target: { value: 'GT' } });
        fireEvent.change(screen.getByDisplayValue('7'), { target: { value: '8' } });

        // Apply Rule
        fireEvent.click(screen.getByText('Apply Rule'));

        // Check checkboxes
        // (1,1) Sum 2 -> Unchecked
        // (3,4) Sum 7 -> Unchecked
        // (5,5) Sum 10 -> Checked
        // (6,3) Sum 9 -> Checked

        // Note: We need to find checkboxes by their label or some other way.
        // The label contains the text "(1,1)", "(3,4)", etc.

        const checkbox11 = screen.getByLabelText(/\(1,1\)/);
        const checkbox34 = screen.getByLabelText(/\(3,4\)/);
        const checkbox55 = screen.getByLabelText(/\(5,5\)/);
        const checkbox63 = screen.getByLabelText(/\(6,3\)/);

        expect(checkbox11).not.toBeChecked();
        expect(checkbox34).not.toBeChecked();
        expect(checkbox55).toBeChecked();
        expect(checkbox63).toBeChecked();
    });

    test('applies DOUBLES rule correctly', () => {
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

        // Change Rule Type to DOUBLES
        fireEvent.change(screen.getByDisplayValue('Sum of Dice'), { target: { value: 'DOUBLES' } });

        fireEvent.click(screen.getByText('Apply Rule'));

        const checkbox11 = screen.getByLabelText(/\(1,1\)/);
        const checkbox34 = screen.getByLabelText(/\(3,4\)/);
        const checkbox55 = screen.getByLabelText(/\(5,5\)/);

        expect(checkbox11).toBeChecked();
        expect(checkbox34).not.toBeChecked();
        expect(checkbox55).toBeChecked();
    });
});
