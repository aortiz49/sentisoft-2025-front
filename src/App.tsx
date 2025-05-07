import { Route, Routes } from 'react-router-dom';

import Login from './pages/main/login';
import ProtectedRoute from './components/protectedRoute';

import AuthPage from '@/pages/main/index';
import ProfilePage from '@/pages/profile';

function App() {
  return (
    <Routes>
      <Route element={<AuthPage />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
        path="/profile"
      />
    </Routes>
  );
}

export default App;
