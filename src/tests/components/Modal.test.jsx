import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../../components/Common/Modal';

describe('Modal Overlay Component', () => {
  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={handleClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders title and contents when isOpen is true, and calls onClose on exit', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
