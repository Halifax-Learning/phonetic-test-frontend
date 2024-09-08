import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestCards from './TestTypeSelection';
import TestInstructions from './TestInstructions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestCards />} />
        <Route path="/instructions/:testType" element={<TestInstructions />} />
        <Route path="/synthesis" element={<TestCards />} />
        <Route path="/analysis" element={<TestCards />} />
        <Route path="/listening" element={<TestCards />} />
        <Route path="/recognition" element={<TestCards />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;