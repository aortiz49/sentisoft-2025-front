import { Route, Routes } from 'react-router-dom';

import IndexPage from '@/pages/main/index';
import LandingPage from './pages/main/LandingPAge';

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<LandingPage />} path="/landing" />
      
    </Routes>
  );
}

export default App;
