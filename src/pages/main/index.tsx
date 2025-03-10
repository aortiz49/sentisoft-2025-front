/* eslint-disable jsx-a11y/media-has-caption */
import { Snippet } from '@heroui/snippet';
import { Button } from '@heroui/button';
import { useState, useRef } from 'react';
import { Card, CardBody } from '@heroui/card';

import CustomAudioPlayer from './CustomAudioPlayer';
import { questions } from './config';

import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import useInterviewAnalysis from '@/hooks/useInterviewAnalysis';

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
};

const MAX_RECORDING_TIME = 60;

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [renderOption, setRenderOption] = useState(true);
  const [started, setStarted] = useState(false);
  const [questionsWithAudio, setQuestionsWithAudio] = useState<
    QuestionWithAudio[]
  >([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { isAnalyzing, analyzeInterview } = useInterviewAnalysis();

  const handleStart = () => {
    setIsLoading(true);
    setStarted(true);
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 1).map((q) => ({
      question: q,
      audioURL: null,
      audioBlob: null,
      isRecording: false,
      timeRemaining: MAX_RECORDING_TIME,
    }));

    setTimeout(() => {
      setQuestionsWithAudio(selected);
      setIsLoading(false);
      setRenderOption(false);
    }, 1000);
  };

  const startRecording = async (index: number) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm',
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
        i === index ? { ...q, isRecording: false, timeRemaining: 0 } : q
      )
    );
  };

  const stopMicrophone = () => {
    const stream = mediaRecorderRef.current?.stream;

    stream?.getTracks().forEach((track) => track.stop());
  };

  const handleSubmit = async () => {
    stopMicrophone();

    const analysisResults: AnalysisResult[] = await analyzeInterview(
      questionsWithAudio.map((q) => ({
        question: q.question,
        audioBlob: q.audioBlob ?? null,
      }))
    );

    setQuestionsWithAudio((prev) =>
      prev.map((q) => {
        const result = analysisResults.find((r) => r.question === q.question);

        if (!result || typeof result.feedback !== 'object') {
          return q; // ✅ Skip if feedback is missing or invalid
        }

        return {
          ...q,
          transcript: result.transcript,
          feedback: {
            clarity: result.feedback.clarity ?? 0, // ✅ Extract clarity score
            structure: result.feedback.structure ?? 0, // ✅ Extract structure score
            communication: result.feedback.communication ?? 0, // ✅ Extract communication score
            feedback: result.feedback.feedback ?? 'No feedback available', // ✅ Extract actual text feedback
          },
        };
      })
    );
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {!started && (
          <div className="inline-block max-w-lg text-center justify-center">
            <span className={title()}>Tech Skills Open Doors.&nbsp;</span>
            <span className={title({ color: 'violet' })}>
              Soft Skills&nbsp;
            </span>
            <br />
            <span className={title()}>Get You Through Them.&nbsp;</span>
            <div className={subtitle({ class: 'mt-4' })}>
              Ace your next behavioral interview with AI-powered practice
              sessions.
            </div>
          </div>
        )}
        {renderOption && (
          <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
              <span>
                Start your first interview{' '}
                <Button
                  className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg"
                  isLoading={isLoading}
                  radius="full"
                  variant="shadow"
                  onPress={handleStart}
                >
                  <p className="leading-none">Start</p>
                </Button>
              </span>
            </Snippet>
          </div>
        )}
        {questionsWithAudio.length > 0 && (
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 w-full max-w-[800px] max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8"
            shadow="sm"
          >
            <CardBody className="p-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground/90">
                  Behavioral Interview Questions
                </h1>

                {questionsWithAudio.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border-b border-foreground/10 pb-4 last:border-none"
                  >
                    <p className="text-foreground/80 font-medium">
                      Question {index + 1}:
                    </p>
                    <p className="text-foreground/90 whitespace-normal break-words w-full">
                      {item.question}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2 items-center">
                      <Button
                        className={
                          item.isRecording ? 'bg-red-500' : 'bg-green-500'
                        }
                        radius="full"
                        onPress={() =>
                          item.isRecording
                            ? stopRecording(index)
                            : startRecording(index)
                        }
                      >
                        {item.isRecording ? 'Stop Recording' : 'Record Answer'}
                      </Button>
                      {item.isRecording && (
                        <span className="text-sm font-mono text-red-500">
                          ⏳ Time remaining: {item.timeRemaining}s
                        </span>
                      )}
                    </div>

                    {item.audioURL && (
                      <CustomAudioPlayer audioURL={item.audioURL} />
                    )}

                    {item.transcript && (
                      <div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="space-y-3">
                          {/* 🔥 Scores Section */}
                          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            📊 Scores:
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                              <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Clarity
                              </span>
                              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {item.feedback?.clarity}/10
                              </span>
                            </div>
                            <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                              <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Structure
                              </span>
                              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                {item.feedback?.structure}/10
                              </span>
                            </div>
                            <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                              <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Communication
                              </span>
                              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                {item.feedback?.communication}/10
                              </span>
                            </div>
                          </div>

                          {/* 🔥 Feedback Section */}
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Feedback:
                            </span>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                              {item.feedback?.feedback}{' '}
                              {/* ✅ Extract the text feedback correctly */}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  className="bg-blue-600 text-white"
                  isDisabled={isAnalyzing}
                  onPress={handleSubmit}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Submit'}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </section>
    </DefaultLayout>
  );
}
