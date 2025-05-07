import { Route, Routes } from 'react-router-dom';

import IndexPage from '@/pages/main/index';
import ProfilePage from '@/pages/profile';

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<ProfilePage />} path="/profile" />
    </Routes>
  );
}

export default App;
