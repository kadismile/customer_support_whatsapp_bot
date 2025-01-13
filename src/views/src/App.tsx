import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ActivateBot } from './ActivateBot';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/authenticate" element={<ActivateBot />} />
      </Routes>
    </Router>
  );
};
