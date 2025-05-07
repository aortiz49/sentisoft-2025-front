import { useEffect, useState } from 'react';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';

import DefaultLayout from '@/layouts/default';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <DefaultLayout>
      {/* Main Content Area */}
      <div className="ml-64 mt-[64px] p-6">
        <h1 className="text-3xl font-bold text-foreground">Welcome!</h1>
        <p className="mt-4 text-lg text-foreground/80">
          This is your dashboard.
        </p>
      </div>
    </DefaultLayout>
  );
}
