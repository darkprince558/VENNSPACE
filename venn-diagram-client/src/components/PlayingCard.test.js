import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlayingCard } from './PlayingCard';

describe('PlayingCard Component', () => {
    test('renders Hearts correctly (Red)', () => {
        render(<PlayingCard rank="A" suit="H" />);
        const symbols = screen.getAllByText('♥');
        expect(symbols.length).toBeGreaterThan(0);
        const ranks = screen.getAllByText('A');
        expect(ranks.length).toBeGreaterThan(0);
    });

    test('renders Spades correctly (Black)', () => {
        render(<PlayingCard rank="10" suit="S" />);
        const symbols = screen.getAllByText('♠');
        expect(symbols.length).toBeGreaterThan(0);
        const ranks = screen.getAllByText('10');
        expect(ranks.length).toBeGreaterThan(0);
    });
});
