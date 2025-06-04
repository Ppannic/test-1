import React, { useState } from 'react';
import Login from './components/Login';
import TodoApp from './components/TodoApp';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <TodoApp onLogout={() => setIsLoggedIn(false)} />
  ) : (
    <Login onLogin={() => setIsLoggedIn(true)} />
  );
};

export default App;
