/* eslint-disable jsx-a11y/media-has-caption */
import { Button } from '@heroui/button';
import { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Input } from '@heroui/input';
import { Textarea } from '@heroui/input';
import { Form } from '@heroui/form';
import { Spinner } from '@heroui/spinner';
import { Snippet } from '@heroui/snippet';
import { Skeleton } from '@heroui/skeleton';
import { addToast } from '@heroui/toast';
import { Pagination } from '@heroui/pagination';
import { Slider } from '@heroui/slider';
import { Modal, ModalBody, ModalHeader, ModalFooter } from '@heroui/modal';

import CustomAudioPlayer from './CustomAudioPlayer';
import { questions } from './config';

import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import useInterviewAnalysis from '@/hooks/useInterviewAnalysis';
import { getProfile, loginUser, registerUser } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

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

const MAX_RECORDING_TIME = 60;

export default function AuthPage() {
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [questionsWithAudio, setQuestionsWithAudio] = useState<
    QuestionWithAudio[]
  >([]);
  const [email, setEmail] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnalysisIndex, setCurrentAnalysisIndex] = useState(0);
  const [finishedSurvey, setFinishedSurvey] = useState(false);
  const [viewedFeedback, setViewedFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const { isAnalyzing, analyzeInterview } = useInterviewAnalysis();

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

  const handleStart = () => {
    setIsLoading(true);
    setStarted(true);
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map((q) => ({
      question: q,
      audioURL: null,
      audioBlob: null,
      isRecording: false,
      timeRemaining: MAX_RECORDING_TIME,
      retryCount: 0,
      isSubmitted: false,
    }));

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsLoading(false);
      setQuestionsWithAudio(selected);
      setCurrentQuestionIndex(0);
    }, 1000);
  };

  const startSurvey = () => {
    setViewedFeedback(true);
  };

  const startRecording = async (index: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/mp3';

      console.log('Using mime type:', mimeType);

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });
        const audioURL = URL.createObjectURL(audioBlob);

        setQuestionsWithAudio((prev) =>
          prev.map((q, i) =>
            i === index
              ? {
                  ...q,
                  audioURL,
                  audioBlob,
                  isRecording: false,
                  timeRemaining: 0,
                }
              : q
          )
        );
        clearTimeout(countdownTimerRef.current!);
      };

      mediaRecorderRef.current.start();
      setQuestionsWithAudio((prev) =>
        prev.map((q, i) =>
          i === index
            ? { ...q, isRecording: true, timeRemaining: MAX_RECORDING_TIME }
            : q
        )
      );

      startCountdownTimer(index);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const startCountdownTimer = (index: number) => {
    countdownTimerRef.current = setInterval(() => {
      setQuestionsWithAudio((prev) =>
        prev.map((q, i) =>
          i === index && q.isRecording && q.timeRemaining! > 0
            ? { ...q, timeRemaining: q.timeRemaining! - 1 }
            : q
        )
      );
    }, 1000);

    setTimeout(() => {
      stopRecording(index);
    }, MAX_RECORDING_TIME * 1000);
  };

  const stopRecording = (index: number) => {
    mediaRecorderRef.current?.stop();
    clearInterval(countdownTimerRef.current!);
    setQuestionsWithAudio((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              isRecording: false,
              timeRemaining: 0,
              retryCount: q.retryCount + 1,
              isSubmitted: true,
            }
          : q
      )
    );
  };

  const stopMicrophone = () => {
    const stream = mediaRecorderRef.current?.stream;

    stream?.getTracks().forEach((track) => track.stop());
  };

  const handleNext = async () => {
    const isLastQuestion =
      currentQuestionIndex === questionsWithAudio.length - 1;

    if (isLastQuestion) {
      await handleSubmit();
      setSubmitted(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSubmit = async () => {
    stopMicrophone();
    setSubmitted(true);
    setQuestionsWithAudio((prev) =>
      prev.map((q) => ({ ...q, timeRemaining: 0 }))
    );

    let isToastActive = true; // Local flag to control the toast loop

    const showToastLoop = () => {
      if (!isToastActive) return;
      addToast({
        title: 'Analyzing your submission...',
        description: 'Please wait while we process your results.',
        color: 'success',
        timeout: 8000,
        shouldShowTimeoutProgress: true,
      });
    };

    showToastLoop();

    const analysisResults: AnalysisResult[] = await analyzeInterview(
      questionsWithAudio.map((q) => ({
        question: q.question,
        audioBlob: q.audioBlob ?? null,
      }))
    );

    isToastActive = false; // Stop the toast loop when analysis is done

    setQuestionsWithAudio((prev) =>
      prev.map((q) => {
        const result = analysisResults.find((r) => r.question === q.question);

        if (!result || typeof result.feedback !== 'object') {
          return q;
        }
        console.log(result.transcript);

        return {
          ...q,
          transcript: result.transcript,
          feedback: {
            clarity: result.feedback.clarity ?? 0,
            structure: result.feedback.structure ?? 0,
            communication: result.feedback.communication ?? 0,
            feedback: result.feedback.feedback ?? 'No feedback available',
          },
        };
      })
    );
  };

  const handleSurveySubmit = async () => {
    setFinishedSurvey(true);

    const webhookURL =
      'https://script.google.com/macros/s/AKfycbxUgmjMPfU6wCcn2gTD63fO2D4hBWmz4CJiF-YnG_GFB_PCTVwFL0bPKC7OATISPWBM/exec';

    const feedbackData = {
      email: sessionStorage.getItem('email'),
      rating: rating,
      feedback: feedback,
    };

    await fetch(webhookURL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(feedbackData),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Feedback sent!');
  };

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('email');
    const savedName = sessionStorage.getItem('name');

    if (savedEmail) setEmail(savedEmail);
    if (savedName) {
      setUserName(savedName);
      setShowNameModal(false);
    } else if (savedEmail) {
      setShowNameModal(true);
    }
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
        <div className="absolute top-4 left-4 text-sm text-gray-600 dark:text-gray-300">
          {userName && email && (
            <>
              <div>
                <strong>{userName}</strong>
              </div>
              <div>{email}</div>
            </>
          )}
        </div>
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
