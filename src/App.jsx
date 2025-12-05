import { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import HiddenSnake from './components/HiddenSnake';
import SecretActivator from './components/SecretActivator';

function App() {
  const [isGameOpen, setIsGameOpen] = useState(false);

  const handleActivate = useCallback(() => {
    setIsGameOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsGameOpen(false);
  }, []);

  return (
    <div className="min-h-screen">
      <LandingPage />
      <SecretActivator onActivate={handleActivate} />
      <HiddenSnake isOpen={isGameOpen} onClose={handleClose} />
    </div>
  );
}

export default App;
