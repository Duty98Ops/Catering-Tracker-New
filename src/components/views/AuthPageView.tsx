import React, { useState } from 'react';
import { LoginPageView } from './LoginPageView';
import { SignUpPageView } from './SignUpPageView';

export interface AuthPageViewProps {
  initialView?: 'login' | 'signup';
  onSelectGuest: () => void;
  onAuthSuccess: () => void;
  onCancel?: () => void;
}

export const AuthPageView: React.FC<AuthPageViewProps> = ({
  initialView = 'login',
  onSelectGuest,
  onAuthSuccess,
  onCancel,
}) => {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>(initialView);

  if (currentView === 'signup') {
    return (
      <SignUpPageView
        onSelectGuest={onSelectGuest}
        onAuthSuccess={onAuthSuccess}
        onNavigateToLogin={() => setCurrentView('login')}
        onCancel={onCancel}
      />
    );
  }

  return (
    <LoginPageView
      onSelectGuest={onSelectGuest}
      onAuthSuccess={onAuthSuccess}
      onNavigateToSignUp={() => setCurrentView('signup')}
      onCancel={onCancel}
    />
  );
};

export { LoginPageView, SignUpPageView };
