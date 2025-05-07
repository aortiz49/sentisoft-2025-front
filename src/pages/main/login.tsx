/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useEffect } from 'react';
import { addToast } from '@heroui/toast';
import { useNavigate } from 'react-router-dom';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import DefaultLayout from '@/layouts/default';
import { getProfile, loginUser } from '@/utils/api';

export default function Login() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const performLogin = async (email: string, password: string) => {
    const { access_token } = await loginUser(email, password);

    sessionStorage.setItem('token', access_token);

    const profile = await getProfile(access_token);

    sessionStorage.setItem('email', profile.email);
    navigate('/profile');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await performLogin(email, password);
    } catch (err) {
      addToast({
        title: 'Login error',
        description: (err as Error).message,
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('email');

    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className="text-2xl font-bold">
            Welcome back to your AI-powered practice sessions.
          </span>
          <Form
            className="flex flex-col gap-6 w-full max-w-lg mx-auto px-4"
            onSubmit={handleLogin}
          >
            <Input
              isRequired
              className="w-full"
              errorMessage="Please enter a valid email"
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isRequired
              className="w-full"
              errorMessage="Please enter a valid password"
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="w-full bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg"
              isDisabled={!email || !password}
              isLoading={isLoading}
              radius="full"
              size="lg"
              type="submit"
              variant="shadow"
              onPress={() => setEmail(email)}
            >
              <p className="leading-none">Login</p>
            </Button>
          </Form>
        </div>
      </section>
    </DefaultLayout>
  );
}
