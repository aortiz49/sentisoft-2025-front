/* eslint-disable jsx-a11y/media-has-caption */
import { Button } from '@heroui/button';
import { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Textarea } from '@heroui/input';
import { Form } from '@heroui/form';
import { Spinner } from '@heroui/spinner';
import { Snippet } from '@heroui/snippet';
import { Skeleton } from '@heroui/skeleton';
import { addToast } from '@heroui/toast';
import { Pagination } from '@heroui/pagination';
import { Slider } from '@heroui/slider';

import CustomAudioPlayer from '@/pages/interview/CustomAudioPlayer';
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
  retryCount: number;
  isSubmitted: boolean;
};

const MAX_RECORDING_TIME = 60;

export default function Interview() {
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
  const { isAnalyzing, analyzeInterview, fetchInterviewQuestions } =
    useInterviewAnalysis();

  const handleStart = async () => {
    setIsLoading(true);
    setStarted(true);
    const questions = await fetchInterviewQuestions();

    const selected = questions.map((q: any) => ({
      question: q.text,
      fullQuestion: q,
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

  const handleEmailSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setTimeout(() => {
      handleStart();
    }, 1000);
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

    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem('email', email);
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      handleStart();
    }
  }, [email]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner
              classNames={{ label: 'text-foreground mt-4' }}
              color="secondary"
              label="Generating interview questions..."
              size="lg"
              variant="wave"
            />
          </div>
        ) : (
          questionsWithAudio.length > 0 && (
            <>
              {!viewedFeedback && (
                <Card
                  isBlurred
                  className="border-none bg-background/60 dark:bg-default-100/50 w-full max-w-[800px] max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 lg:max-h-[700px]"
                  shadow="sm"
                >
                  {isAnalyzing ? (
                    <div className="flex justify-center items-center min-h-[500px]">
                      <div className="w-full space-y-5 p-4">
                        <Skeleton className="rounded-lg">
                          <div className="h-12 rounded-lg bg-default-300" />
                        </Skeleton>
                        <div className="space-y-3">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-1/5 rounded-lg">
                            <div className="h-3 w-1/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-5/5 rounded-lg bg-default-200" />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <CardBody className="p-8 max-h-[750px] overflow-x-hidden">
                      <div className="flex flex-col gap-4 lg:overflow-y-auto">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground/90">
                          {submitted
                            ? 'Behavioral Interview Analysis'
                            : 'Behavioral Interview Questions'}
                        </h1>
                        <Pagination
                          isDisabled
                          className="max-w-full"
                          page={
                            submitted
                              ? currentAnalysisIndex + 1
                              : currentQuestionIndex + 1
                          }
                          total={questionsWithAudio.length}
                        />
                        {!submitted && (
                          <div className="flex flex-col gap-8">
                            <p className="text-foreground/80 font-medium text-yellow-500">
                              You have 3 attempts to record your answer for each
                              question.
                            </p>
                            {questionsWithAudio[currentQuestionIndex] && (
                              <div
                                key={currentQuestionIndex}
                                className="flex flex-col gap-2 border-b border-foreground/10 pb-4 last:border-none gap-2"
                              >
                                <Snippet
                                  classNames={{
                                    base: 'w-full',
                                  }}
                                  variant="bordered"
                                >
                                  {
                                    <span className="text-foreground/80 font-medium text-purple-400 break-words whitespace-normal">
                                      {
                                        questionsWithAudio[currentQuestionIndex]
                                          .question
                                      }
                                    </span>
                                  }
                                </Snippet>
                                {questionsWithAudio[currentQuestionIndex]
                                  .retryCount <= 2 && (
                                  <span className="text-sm font-mono text-green-500">
                                    {2 -
                                      questionsWithAudio[currentQuestionIndex]
                                        .retryCount +
                                      1}{' '}
                                    attempts left
                                  </span>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2 items-center">
                                  <Button
                                    className={`w-full sm:w-auto 
    ${questionsWithAudio[currentQuestionIndex].isRecording ? 'bg-red-500' : 'bg-green-500'}`}
                                    isDisabled={
                                      questionsWithAudio[currentQuestionIndex]
                                        .retryCount > 2
                                    }
                                    radius="full"
                                    onPress={() =>
                                      questionsWithAudio[currentQuestionIndex]
                                        .isRecording
                                        ? stopRecording(currentQuestionIndex)
                                        : startRecording(currentQuestionIndex)
                                    }
                                  >
                                    {questionsWithAudio[currentQuestionIndex]
                                      .isRecording
                                      ? 'Stop Recording'
                                      : 'Record Answer'}
                                  </Button>
                                  {questionsWithAudio[currentQuestionIndex]
                                    .isRecording && (
                                    <span className="text-sm font-mono text-red-500">
                                      ⏳ Time remaining:{' '}
                                      {
                                        questionsWithAudio[currentQuestionIndex]
                                          .timeRemaining
                                      }
                                      s
                                    </span>
                                  )}
                                  <div>
                                    {questionsWithAudio[currentQuestionIndex]
                                      .retryCount > 2 && (
                                      <span className="text-sm font-mono text-red-500">
                                        You have reached the maximum number of
                                        retries.
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {questionsWithAudio[currentQuestionIndex]
                                  .audioURL && (
                                  <CustomAudioPlayer
                                    audioURL={
                                      questionsWithAudio[currentQuestionIndex]
                                        .audioURL
                                    }
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {submitted && (
                          <div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                            <div className="space-y-3">
                              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                📊 Scores:
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                  <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Clarity
                                  </span>
                                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    {
                                      questionsWithAudio[currentAnalysisIndex]
                                        .feedback?.clarity
                                    }
                                    /10
                                  </span>
                                </div>
                                <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                  <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Structure
                                  </span>
                                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                    {
                                      questionsWithAudio[currentAnalysisIndex]
                                        .feedback?.structure
                                    }
                                    /10
                                  </span>
                                </div>
                                <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                  <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Communication
                                  </span>
                                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                    {
                                      questionsWithAudio[currentAnalysisIndex]
                                        .feedback?.communication
                                    }
                                    /10
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  Feedback:
                                </span>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                  {
                                    questionsWithAudio[currentAnalysisIndex]
                                      .feedback?.feedback
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end mt-6">
                        {!submitted ? (
                          <Button
                            className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg self-center"
                            isDisabled={
                              isAnalyzing ||
                              !questionsWithAudio[currentQuestionIndex]
                                .isSubmitted
                            }
                            onPress={
                              currentQuestionIndex ===
                              questionsWithAudio.length - 1
                                ? handleSubmit
                                : handleNext
                            }
                          >
                            {isAnalyzing
                              ? 'Analyzing...'
                              : currentQuestionIndex ===
                                  questionsWithAudio.length - 1
                                ? 'Submit'
                                : 'Next'}
                          </Button>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between w-full">
                            {currentAnalysisIndex > 0 && (
                              <Button
                                className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg w-full sm:w-auto"
                                onPress={() => {
                                  window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                  });
                                  setCurrentAnalysisIndex(
                                    currentAnalysisIndex - 1
                                  );
                                }}
                              >
                                Previous analysis
                              </Button>
                            )}
                            <Button
                              className={`shadow-lg w-full sm:w-auto sm:ml-auto ${
                                currentAnalysisIndex === 2
                                  ? 'bg-gradient-to-tr from-green-400 to-green-600'
                                  : 'bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8]'
                              } 
                            text-white`}
                              onPress={() => {
                                window.scrollTo({
                                  top: 0,
                                  behavior: 'smooth',
                                });
                                if (
                                  currentAnalysisIndex <
                                  questionsWithAudio.length - 1
                                ) {
                                  setCurrentAnalysisIndex(
                                    currentAnalysisIndex + 1
                                  );
                                } else {
                                  startSurvey();
                                }
                              }}
                            >
                              {currentAnalysisIndex == 2
                                ? 'Continue to feedback survey'
                                : 'Next analysis'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  )}
                </Card>
              )}
            </>
          )
        )}
        {viewedFeedback && !finishedSurvey && (
          <div className="flex flex-col items-center justify-center gap-8 py-8 md:py-10 mb-20">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground/90">
              Please leave your feedback below
            </h1>
            <p className="text-foreground/80 font-medium text-yellow-500">
              We&apos;d love to hear from you!
            </p>
            <Form
              className="flex flex-col gap-4 w-full max-w-[800px] max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 lg:max-h-[700px]"
              onSubmit={handleSurveySubmit}
            >
              <Slider
                classNames={{
                  base: 'max-w-md pb-8',
                  filler: 'bg-gradient-to-r from-primary-500 to-secondary-400',
                  labelWrapper: 'mb-2',
                  label: 'font-medium text-default-700 text-medium',
                  value: 'font-medium text-default-500 text-small',
                  thumb: [
                    'transition-size',
                    'bg-gradient-to-r from-secondary-400 to-primary-500',
                    'data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20',
                    'data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6',
                  ],
                  step: 'data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50',
                }}
                defaultValue={5}
                disableThumbScale={true}
                label="Rating"
                maxValue={5}
                minValue={0}
                showOutline={true}
                showSteps={true}
                showTooltip={true}
                step={0.5}
                tooltipProps={{
                  placement: 'bottom',
                }}
                onChange={(value) => {
                  setRating(value as number);
                }}
              />
              <Textarea
                isRequired
                description="This feedback will help us improve the interview experience for future users."
                label="Feedback"
                labelPlacement="outside"
                name="feedback"
                placeholder="What did you think of the interview?"
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button
                className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg self-center"
                isDisabled={feedback.length == 0}
                radius="full"
                size="lg"
                type="submit"
                variant="shadow"
              >
                <p className="leading-none">Submit survey</p>
              </Button>
            </Form>
          </div>
        )}
        {finishedSurvey && (
          <div className="flex flex-col items-center justify-center gap-8 py-8 md:py-10 mb-20">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground/90">
              Thank you for your feedback!
            </h1>
            <p className="text-foreground/80 font-medium text-yellow-500">
              We&apos;ll use your feedback to improve the interview experience
              for future users.
            </p>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
