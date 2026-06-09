import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CarbonProvider } from '../../context/CarbonContext';
import EcosystemVisualizer from '../../components/ClimateTwin/EcosystemVisualizer';

describe('EcosystemVisualizer Climate Twin Component', () => {
  it('renders correctly with stable status and projections', () => {
    render(
      <CarbonProvider>
        <EcosystemVisualizer />
      </CarbonProvider>
    );

    expect(screen.getByText(/Ecosystem Digital Twin/i)).toBeInTheDocument();
    expect(screen.getByText(/System Health:/i)).toBeInTheDocument();
    expect(screen.getByText(/Stable/i)).toBeInTheDocument(); // 283.55 initial emissions bracket
    expect(screen.getByText(/2030 Carbon Legacy/i)).toBeInTheDocument();
    expect(screen.getByText(/2050 Carbon Legacy/i)).toBeInTheDocument();
  });
});
