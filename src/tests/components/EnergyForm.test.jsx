import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CarbonProvider } from '../../context/CarbonContext';
import EnergyForm from '../../components/Tracker/EnergyForm';

describe('EnergyForm Component', () => {
  it('renders labels and submits energy logs successfully', async () => {
    render(
      <CarbonProvider>
        <EnergyForm />
      </CarbonProvider>
    );

    expect(screen.getByLabelText(/Utility Type/i)).toBeInTheDocument();
    
    const qtyInput = screen.getByLabelText(/Quantity/i);
    const submitBtn = screen.getByRole('button', { name: /Add Energy Activity/i });

    fireEvent.change(qtyInput, { target: { value: '150' } });
    fireEvent.click(submitBtn);

    const successBanner = await screen.findByRole('status');
    expect(successBanner).toHaveTextContent(/logged successfully/i);
  });
});
