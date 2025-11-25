import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import * as api from './api/api';
import { BrowserRouter } from 'react-router-dom';

// Mock the API module
jest.mock('./api/api');
// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('Dashboard Component', () => {
    beforeEach(() => {
        // Reset mocks
        mockedNavigate.mockReset();
        api.fetchDiagrams.mockResolvedValue([]);
        api.createTemplateDiagram.mockReset();
    });

    test('renders create buttons', async () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
        expect(screen.getByText('Create a New Diagram Space')).toBeInTheDocument();
        expect(screen.getByText('Create from Template')).toBeInTheDocument();
    });

    test('calls createTemplateDiagram and navigates on success', async () => {
        // Mock successful creation
        api.createTemplateDiagram.mockResolvedValue({ diagramId: '123' });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        // Find the "Create from Template" button (the second "Create" button)
        // We can find by text "Create" inside the second form
        const createButtons = screen.getAllByText('Create');
        const templateCreateButton = createButtons[1]; // Assuming order

        fireEvent.click(templateCreateButton);

        await waitFor(() => {
            expect(api.createTemplateDiagram).toHaveBeenCalledWith('DECK_OF_CARDS'); // Default value
            expect(mockedNavigate).toHaveBeenCalledWith('/diagram/123');
        });
    });

    test('displays error on creation failure', async () => {
        // Mock failure
        api.createTemplateDiagram.mockRejectedValue(new Error('Backend failed'));

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        const createButtons = screen.getAllByText('Create');
        const templateCreateButton = createButtons[1];

        fireEvent.click(templateCreateButton);

        await waitFor(() => {
            expect(screen.getByText('Backend failed')).toBeInTheDocument();
            expect(mockedNavigate).not.toHaveBeenCalled();
        });
    });
});
