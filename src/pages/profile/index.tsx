import { useEffect, useState } from 'react';

import DefaultLayout from '@/layouts/default';

export default function ProfilePage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('email');

    if (savedEmail) setEmail(savedEmail);
  }, []);

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        <p className="mt-4 text-lg">
          Your email is: <strong>{email}</strong>
        </p>
      </div>
    </DefaultLayout>
  );
}
