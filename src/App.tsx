import React from 'react';
import { AppProvider } from './context/AppContext';
import { AppUI } from './components/AppUI';

// FIX: Removed explicit React.FC typing. This pattern is being phased out
// and was not the source of the component typing errors, which were located
// in the Provider components themselves.
const App = () => {
  return (
    <AppProvider>
      <AppUI />
    </AppProvider>
  );
};

export default App;