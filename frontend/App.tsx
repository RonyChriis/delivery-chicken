import React from 'react';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider } from './src/context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthNavigator />
    </AuthProvider>
  );
};

export default App;
