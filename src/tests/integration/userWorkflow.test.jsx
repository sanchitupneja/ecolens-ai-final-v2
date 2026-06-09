import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';

describe('EcoPulse User Journey Integration Test', () => {
  it('navigates, logs activities, verifies dashboard carbon tallies, and claims reward points', async () => {
    render(<App />);

    // 1. Initial Dashboard State Verification
    // Pre-populated emissions start at 283.55 kg - wait for async load
    const emissionValueNode = await screen.findByText('283.55');
    expect(emissionValueNode).toBeInTheDocument();
    
    // Check initial points balance (which might also appear as SVG grid labels)
    const pointsNode = await screen.findAllByText('150');
    expect(pointsNode.length).toBeGreaterThan(0);

    // 2. Navigate to Tracker Tab
    const trackerTabBtn = screen.getByRole('tab', { name: /Tracker/i });
    fireEvent.click(trackerTabBtn);

    // Verify Tracker Panel is shown (wait for dynamic load)
    expect(await screen.findByText(/Log Transportation/i)).toBeInTheDocument();

    // 3. Log a new Transport Activity: 100 miles petrol car (100 * 0.404 = 40.4 kg)
    const distanceInput = screen.getByLabelText(/Distance \/ Duration/i);
    const submitBtn = screen.getByRole('button', { name: /Add Transport Activity/i });

    fireEvent.change(distanceInput, { target: { value: '100' } });
    fireEvent.click(submitBtn);

    // Wait for success alert message
    const successBanner = await screen.findByRole('status');
    expect(successBanner).toHaveTextContent(/Logged successfully/i);

    // 4. Navigate back to Dashboard Tab and verify emissions updated
    const dashboardTabBtn = screen.getByRole('tab', { name: /Dashboard/i });
    fireEvent.click(dashboardTabBtn);

    // Dynamic total emissions is now 283.55 + 40.4 = 323.95 (wait for load)
    expect(await screen.findByText('323.95')).toBeInTheDocument();

    // 5. Navigate to Challenges Tab and complete a mission
    const challengesTabBtn = screen.getByRole('tab', { name: /Challenges/i });
    fireEvent.click(challengesTabBtn);

    // Find "Car-Free Commute" mission (+120 pts)
    expect(await screen.findByText(/Car-Free Commute/i)).toBeInTheDocument();
    const claimBtn = screen.getByRole('button', { name: /Claim reward for completing Car-Free Commute/i });
    fireEvent.click(claimBtn);

    // The button should change state to completed/claimed
    expect(screen.getByRole('button', { name: /Mission Car-Free Commute already claimed/i })).toBeInTheDocument();

    // 6. Return to Dashboard and check rewards points balance (150 + 120 = 270)
    fireEvent.click(dashboardTabBtn);
    const updatedPoints = await screen.findAllByText('270');
    expect(updatedPoints.length).toBeGreaterThan(0);
  });
});
