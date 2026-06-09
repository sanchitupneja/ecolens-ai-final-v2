import React from 'react';

/**
 * Standard Error Boundary component (React Class Component)
 * Catch rendering exceptions and display a fallback recovery UI instead of crash.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            border: '2px solid var(--accent-red)',
            borderRadius: '12px',
            margin: '2rem auto',
            maxWidth: '600px',
            boxShadow: 'var(--shadow-lg)'
          }}
          role="alert"
          aria-live="assertive"
        >
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-red)', marginBottom: '1rem' }}>
            Oops! EcoPulse encountered a rendering issue.
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            An unexpected error occurred in this section. Our virtual system is working to isolate it.
          </p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.5rem' }}
          >
            Restart Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
