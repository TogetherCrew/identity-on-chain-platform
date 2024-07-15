// CustomTable.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CustomTable, { Platform, AccessData } from './CustomTable';

// Mock AccessControlButton component
vi.mock('./AccessControlButton', () => ({
    __esModule: true,
    default: ({ hasAccess, onToggleAccess }: { hasAccess: boolean, onToggleAccess: () => void }) => (
        <button onClick={onToggleAccess}>
            {hasAccess ? 'Revoke Access' : 'Grant Access'}
        </button>
    ),
}));

describe('CustomTable', () => {
    const platforms: Platform[] = [
        { name: 'Platform1', icon: <div>Icon1</div> },
        { name: 'Platform2', icon: <div>Icon2</div> },
    ];

    const data: AccessData[] = [
        { application: 'App1', Platform1: true, Platform2: false },
        { application: 'App2', Platform1: false, Platform2: true },
    ];

    it('renders the table with correct headers and data', () => {
        render(<CustomTable xcolumns={platforms} ycolumns={data} data={data} />);

        expect(screen.getByText('Applications \\ Identifiers')).toBeInTheDocument();
        expect(screen.getByText('Platform1')).toBeInTheDocument();
        expect(screen.getByText('Platform2')).toBeInTheDocument();

        expect(screen.getByText('App1')).toBeInTheDocument();
        expect(screen.getByText('App2')).toBeInTheDocument();

        expect(screen.getAllByText('Revoke Access').length).toBe(2);
        expect(screen.getAllByText('Grant Access').length).toBe(2);
    });
});
