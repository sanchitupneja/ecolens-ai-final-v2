import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CarbonProvider } from '../../context/CarbonContext';
import SimulatedCamera from '../../components/Scanner/SimulatedCamera';

describe('SimulatedCamera Scanner Component', () => {
  it('renders initial state with camera container and placeholder results text', () => {
    render(
      <CarbonProvider>
        <SimulatedCamera />
      </CarbonProvider>
    );

    expect(screen.getByText(/Simulated AI Vision Scanner/i)).toBeInTheDocument();
    expect(screen.getByText(/Scan an item using the viewfinder panel/i)).toBeInTheDocument();
  });

  it('runs scanning simulation and displays detailed results and alternatives', async () => {
    vi.useFakeTimers();
    
    render(
      <CarbonProvider>
        <SimulatedCamera />
      </CarbonProvider>
    );

    const selectEl = screen.getByLabelText(/Select Scanning Target/i);
    const scanBtn = screen.getByRole('button', { name: /Scan Product \/ Receipt/i });

    // Select beef patty
    fireEvent.change(selectEl, { target: { value: 'beef_patty' } });
    fireEvent.click(scanBtn);

    // Should enter scanning loader state
    expect(screen.getByText(/Activating Lens Matrix/i)).toBeInTheDocument();

    // Advance mock timers to bypass scanning wait
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Should display final assessment report
    expect(screen.getByText(/Beef Patty \(Red Meat\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Eco Grade/i)).toBeInTheDocument();
    expect(screen.getByText(/4.5 kg CO2e/i)).toBeInTheDocument(); // Beef footprint
    expect(screen.getByText(/Impossible Plant-Based Patty/i)).toBeInTheDocument(); // alternative

    vi.useRealTimers();
  });
});
