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
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome{email ? `, ${email}` : ''}!
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          This is your dashboard.
        </p>
      </div>
    </DefaultLayout>
  );
}
