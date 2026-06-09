import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CarbonProvider } from '../../context/CarbonContext';
import CoachChat from '../../components/AICoach/CoachChat';

describe('CoachChat AI Coach Component', () => {
  it('renders chatbot UI with initial greet message and smart prompt options', () => {
    render(
      <CarbonProvider>
        <CoachChat />
      </CarbonProvider>
    );

    expect(screen.getAllByText(/AI Sustainability Coach/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Welcome! I am your AI Sustainability Coach/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Transport reduction tips/i })).toBeInTheDocument();
  });

  it('receives message from user and triggers simulated AI typing and reply', async () => {
    vi.useFakeTimers();

    render(
      <CarbonProvider>
        <CoachChat />
      </CarbonProvider>
    );

    const input = screen.getByPlaceholderText(/Ask: 'How do I reduce energy emissions\?'/i);
    const sendBtn = screen.getByRole('button', { name: /Send/i });

    // Type and send message
    fireEvent.change(input, { target: { value: 'energy tips' } });
    fireEvent.click(sendBtn);

    // Verify user message appears in list
    expect(screen.getByText(/energy tips/i)).toBeInTheDocument();
    
    // Check loading indicator shows up
    expect(screen.getByText(/Coach is analyzing your carbon footprint/i)).toBeInTheDocument();

    // Fast-forward AI thinking duration
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Check that simulated advice shows up
    expect(screen.getAllByText(/Home energy carbon emissions come from/)[0]).toBeInTheDocument();

    vi.useRealTimers();
  });
});
