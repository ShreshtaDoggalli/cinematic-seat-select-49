import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, loading]);

  const handleAuthClose = () => {
    setShowAuthModal(false);
    // Optionally redirect to home if user cancels auth
    // navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-cinema-red border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">Please login to continue with your booking.</p>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthClose}
          defaultTab="login"
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;