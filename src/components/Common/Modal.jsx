import React, { useEffect } from 'react';
import { useFocusTrap } from '../../hooks/useKeyboardNavigation';

/**
 * Accessible Modal Window Component (WCAG 2.1 Compliant)
 * Handles focus trapping, Escape key closing, and semantic ARIA labeling.
 */
export function Modal({ isOpen, onClose, title, children }) {
  const containerRef = useFocusTrap(isOpen);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '550px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div 
          className="modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <h3 
            id="modal-title"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--text-primary)'
            }}
          >
            {title}
          </h3>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'inline-flex',
              padding: '0.25rem'
            }}
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
export default Modal;
