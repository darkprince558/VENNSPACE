import React from 'react';
import { render, screen } from '@testing-library/react';
import { SetList } from './SetList';
import { PartitionsColumn } from './PartitionsColumn';
import { OperationsColumn } from './OperationsColumn';

describe('Probability Stats', () => {

    test('SetList displays correct count and percentage when showProbability is true', () => {
        const setsInfo = [{ name: 'Set A', size: 5 }];
        const totalElements = 20; // 5/20 = 25%

        render(
            <SetList
                setsInfo={setsInfo}
                totalElements={totalElements}
                showProbability={true}
                onOpenCreateSetModal={() => { }}
                onOpenEditSetModal={() => { }}
            />
        );

        expect(screen.getByText('Set A')).toBeInTheDocument();
        expect(screen.getByText('5 items (25.0%)')).toBeInTheDocument();
    });

    test('SetList hides stats when showProbability is false', () => {
        const setsInfo = [{ name: 'Set A', size: 5 }];
        const totalElements = 20;

        render(
            <SetList
                setsInfo={setsInfo}
                totalElements={totalElements}
                showProbability={false}
                onOpenCreateSetModal={() => { }}
                onOpenEditSetModal={() => { }}
            />
        );

        expect(screen.getByText('Set A')).toBeInTheDocument();
        expect(screen.queryByText(/items/)).not.toBeInTheDocument();
    });

    test('PartitionsColumn displays correct count and percentage when showProbability is true', () => {
        const partitions = 'Region 1 (Only A): [1, 2, 3]';
        const totalElements = 10; // 3/10 = 30%

        render(
            <PartitionsColumn
                partitions={partitions}
                totalElements={totalElements}
                showProbability={true}
                isLoading={false}
            />
        );

        expect(screen.getByText('3 items')).toBeInTheDocument();
        expect(screen.getByText('30.0%')).toBeInTheDocument();
    });

    test('PartitionsColumn hides stats when showProbability is false', () => {
        const partitions = 'Region 1 (Only A): [1, 2, 3]';
        const totalElements = 10;

        render(
            <PartitionsColumn
                partitions={partitions}
                totalElements={totalElements}
                showProbability={false}
                isLoading={false}
            />
        );

        expect(screen.queryByText('3 items')).not.toBeInTheDocument();
        expect(screen.queryByText('30.0%')).not.toBeInTheDocument();
    });

    test('OperationsColumn displays correct count and percentage when showProbability is true', () => {
        const setNames = ['A'];
        const opResult = [1, 2, 3, 4];
        const totalElements = 40; // 4/40 = 10%

        render(
            <OperationsColumn
                setNames={setNames}
                opResult={opResult}
                totalElements={totalElements}
                showProbability={true}
                onRunOperation={() => { }}
            />
        );

        expect(screen.getByText(/4 items \(10.0%\)/)).toBeInTheDocument();
    });

    test('OperationsColumn hides stats when showProbability is false', () => {
        const setNames = ['A'];
        const opResult = [1, 2, 3, 4];
        const totalElements = 40;

        render(
            <OperationsColumn
                setNames={setNames}
                opResult={opResult}
                totalElements={totalElements}
                showProbability={false}
                onRunOperation={() => { }}
            />
        );

        expect(screen.queryByText(/items/)).not.toBeInTheDocument();
    });
});
