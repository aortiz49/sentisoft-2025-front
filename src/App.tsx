import { Route, Routes } from 'react-router-dom';

import Login from './pages/main/login';

import AuthPage from '@/pages/main/index';
import ProfilePage from '@/pages/profile';

function App() {
  return (
    <Routes>
      <Route element={<AuthPage />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<ProfilePage />} path="/profile" />
    </Routes>
  );
}

export default App;
