import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CarbonProvider } from '../../context/CarbonContext';
import TransportForm from '../../components/Tracker/TransportForm';

describe('TransportForm Component', () => {
  it('renders correctly with labels and inputs', () => {
    render(
      <CarbonProvider>
        <TransportForm />
      </CarbonProvider>
    );

    expect(screen.getByLabelText(/Mode of Travel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Distance \/ Duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Journey/i)).toBeInTheDocument();
  });

  it('submits correctly and displays success message', async () => {
    render(
      <CarbonProvider>
        <TransportForm />
      </CarbonProvider>
    );

    const distanceInput = screen.getByLabelText(/Distance \/ Duration/i);
    const submitBtn = screen.getByRole('button', { name: /Add Transport Activity/i });

    // Enter mileage
    fireEvent.change(distanceInput, { target: { value: '50' } });
    fireEvent.click(submitBtn);

    // Verify success banner appears
    const successBanner = await screen.findByRole('status');
    expect(successBanner).toHaveTextContent(/activity logged successfully/i);
    expect(distanceInput.value).toBe(''); // Form resets
  });

  it('handles negative or zero values with error banners', () => {
    render(
      <CarbonProvider>
        <TransportForm />
      </CarbonProvider>
    );

    const distanceInput = screen.getByLabelText(/Distance \/ Duration/i);
    const submitBtn = screen.getByRole('button', { name: /Add Transport Activity/i });

    // Enter invalid quantity
    fireEvent.change(distanceInput, { target: { value: '-10' } });
    fireEvent.click(submitBtn);

    // Verify error banner
    expect(screen.getByRole('alert')).toHaveTextContent(/please enter a valid positive number/i);
  });
});
