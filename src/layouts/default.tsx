import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <div className="flex h-screen overflow-hidden">
      {isAuthenticated && (
        <aside className="w-[220px] bg-background border-r p-4 flex flex-col items-center">
          <Avatar
            src="https://i.pravatar.cc/300"
            alt="User avatar"
            className="w-12 h-12 mb-4"
          />
          <p className="text-sm text-center text-default-500 break-words">
            {email}
          </p>
          <Link to="/interview" className="mt-6">
            <Button
              className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-md"
              size="sm"
              radius="full"
            >
              Start Interview
            </Button>
          </Link>
          <div className="mt-auto w-full">
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

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
