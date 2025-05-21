import React from 'react';
import './App.css';
import Test from './Test';
import { GitHubLogin } from './GitHubLogin';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GitHubLogin>
          <Test />
        </GitHubLogin>
      </header>
    </div>
  );
}

export default App;
