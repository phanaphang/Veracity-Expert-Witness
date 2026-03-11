import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info);
    const msg = error?.message || '';
    if (msg.includes('dynamically imported module') || msg.includes('Loading chunk') || msg.includes('Failed to fetch')) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <h2 style={{ marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              background: '#1a365d',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
