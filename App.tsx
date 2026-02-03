import React, { useState } from 'react';

// Component Imports
import { LoginPage } from './components/LoginPage';
import { MainDashboard } from './components/MainDashboard';
import { AppProvider } from './components/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Removed unused user state

  // Handle login
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = (_username: string, _password: string) => {
    // Removed setUser as user state is not used
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    // Removed setUser as user state is not used
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main dashboard if authenticated
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainDashboard onLogout={handleLogout} />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
