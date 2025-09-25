import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="alert alert-danger">
            <h2>Oops! Something went wrong</h2>
            <p>The application encountered an error. This might be due to a network issue or invalid data.</p>
            <details style={{ marginTop: '20px' }}>
              <summary>Error details</summary>
              <pre style={{ textAlign: 'left', background: '#f8f9fa', padding: '10px', marginTop: '10px' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
            <button 
              className="btn btn-success" 
              onClick={this.handleReset}
              style={{ marginTop: '20px' }}
            >
              Reset and Return to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;