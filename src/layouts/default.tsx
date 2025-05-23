import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Navbar } from '@/components/navbar';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    if (savedEmail && token) {
      setEmail(savedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const isInterviewRoute = location.pathname === '/interview';

  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row">
      {!isInterviewRoute && isAuthenticated && (
        <aside className="w-full md:w-[220px] bg-background md:border-r p-4 flex flex-col justify-between">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Avatar
              alt="User avatar"
              className="w-12 h-12"
              src="https://i.pravatar.cc/300"
            />
            <p className="text-sm text-default-500 text-center md:text-left break-words">
              {email}
            </p>
            <Button
              className="w-full bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-md"
              radius="full"
              size="sm"
              onPress={() => navigate('/interview')}
            >
              Start Interview
            </Button>
          </div>
          <div className="mt-6 md:mt-auto">
            <Button
              className="w-full"
              color="danger"
              variant="flat"
              onPress={logout}
            >
              Logout
            </Button>
          </div>
        </aside>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        {!isInterviewRoute && <Navbar />}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto md:overflow-hidden">
          <div className="md:h-[calc(100vh-4rem)] overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
