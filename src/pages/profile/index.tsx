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

  return (
    <DefaultLayout>
      {/* Sidebar */}
      <aside className="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-background dark:bg-default-100 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center z-10 shadow-md">
        <Avatar
          isBordered
          radius="full"
          className="w-12 h-12 mb-4"
          name={email}
        />
        <p className="text-center text-sm font-medium text-foreground/80 break-words mb-6">
          {email}
        </p>
        <Button
          className="bg-gradient-to-tr from-[#7b2ff7] to-[#f107a3] text-white shadow-lg w-full"
          radius="full"
          onPress={() => navigate('/interview')}
        >
          🎤 Start Interview
        </Button>
      </aside>

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
