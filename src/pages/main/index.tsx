import { Button } from '@heroui/button';
import { useState, useEffect } from 'react';
import { Input } from '@heroui/input';
import { Form } from '@heroui/form';
import { addToast } from '@heroui/toast';
import { useNavigate } from 'react-router-dom';

import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { getProfile, loginUser, registerUser } from '@/utils/api';

export type FeedbackType = {
  clarity: number;
  structure: number;
  communication: number;
  feedback: string;
};

export type AnalysisResult = {
  question: string;
  transcript: string;
  feedback: FeedbackType;
};

export type QuestionWithAudio = {
  question: string;
  audioURL: string | null;
  audioBlob?: Blob | null;
  transcript?: string;
  feedback?: FeedbackType;
  isRecording: boolean;
  timeRemaining?: number;
  retryCount: number;
  isSubmitted: boolean;
};

export default function AuthPage() {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(email, password);
      await performLogin(email, password);
    } catch (err) {
      addToast({
        title: 'Registration error',
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
          <span className={title()}>Tech Skills Open Doors.&nbsp;</span>
          <span className={title({ color: 'violet' })}>Soft Skills&nbsp;</span>
          <br />
          <span className={title()}>Get You Through Them.&nbsp;</span>
          <div className={subtitle({ class: 'mt-4' })}>
            Ace your next behavioral interview with AI-powered practice
            sessions.
          </div>
          <Form className="gap-4" onSubmit={handleRegister}>
            <Input
              isRequired
              className="max-w-[300px] self-center"
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
              className="max-w-[300px] self-center"
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
              className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg self-center"
              isDisabled={!email || !password}
              isLoading={isLoading}
              radius="full"
              size="lg"
              type="submit"
              variant="shadow"
              onPress={() => {
                setEmail(email);
              }}
            >
              <p className="leading-none">Start</p>
            </Button>
          </Form>
        </div>
      </section>
    </DefaultLayout>
  );
}
