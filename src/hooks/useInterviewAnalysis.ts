import { useState } from 'react';

import { AnalysisResult } from '@/pages/main';

export default function useInterviewAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const deepgramApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;

  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const fetchInterviewResults = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${backendApiUrl}/interview/my-results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(
          `Failed to fetch interview results: ${response.status}`
        );

      const data = await response.json();
      return data ?? [];
    } catch (err) {
      console.error('Error fetching interview results:', err);
      setError('Failed to fetch interview results from backend.');
      return [];
    }
  };

  const fetchInterviewQuestions = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${backendApiUrl}/interview/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`Failed to generate interview: ${response.status}`);

      const data = await response.json();

      if (data.interview_id) {
        sessionStorage.setItem('interviewId', data.interview_id);
      }

      return data.questions ?? [];
    } catch (err) {
      console.error('Error generating interview:', err);
      setError('Failed to generate interview from backend.');
      return [];
    }
  };

  const analyzeInterview = async (
    questionsWithAudio: {
      question: string;
      transcript: string | undefined;
      questionId: number;
    }[],
    interviewId: number
  ) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisPromises = questionsWithAudio.map(async (item) => {
        if (!item.transcript) return null;

        const feedback = await analyzeWithBackend(
          item.question,
          item.transcript
        );

        console.log('FEEDBACK:', feedback);
        console.log('CLARITY:', feedback.clarity);
        console.log('STRUCTURE:', feedback.structure);
        console.log('COMMUNICATION:', feedback.communication);

        console.log('question:', item.question);
        console.log('questionId:', item.questionId);
        console.log('interviewId:', interviewId);

        saveInterviewAnswer({
          interviewId,
          questionId: item.questionId,
          clarity_score: feedback.clarity,
          structure_score: feedback.structure,
          communication_score: feedback.communication,
          feedback: feedback.feedback,
        });

        return {
          question: item.question,
          transcript: item.transcript,
          feedback,
        };
      });

      const analysisResults = (await Promise.all(analysisPromises)).filter(
        (result): result is AnalysisResult => result !== null
      );

      setResults(analysisResults);

      return analysisResults;
    } catch (err) {
      setError(
        `Failed to analyze interview: ${err instanceof Error ? err.message : String(err)}`
      );
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeSingleQuestion = async ({
    question,
    audioBlob,
  }: {
    question: string;
    audioBlob: Blob;
  }) => {
    setError(null);

    try {
      setIsRecording(true);
      const formData = new FormData();

      formData.append('file', audioBlob, 'answer.webm');

      console.log('Recorded Blob:', audioBlob);
      console.log('Blob Type:', audioBlob?.type);
      console.log('Blob Size:', audioBlob?.size);

      const deepgramResponse = await fetch(
        'https://api.deepgram.com/v1/listen?punctuate=true&model=general&detect_language=true',
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${deepgramApiKey}`,
            'Content-Type': 'audio/webm',
          },
          body: formData,
        }
      );

      if (!deepgramResponse.ok) {
        throw new Error(`Deepgram API error: ${deepgramResponse.status}`);
      }

      const deepgramResult = await deepgramResponse.json();
      const transcript =
        deepgramResult.results.channels[0].alternatives[0]?.transcript ?? '';

      return { question, transcript };
    } catch (err) {
      setError(
        `Failed to analyze question: ${err instanceof Error ? err.message : String(err)}`
      );
      return null;
    } finally {
      setIsRecording(false);
    }
  };

  const analyzeWithBackend = async (question: string, transcript: string) => {
    try {
      const response = await fetch(`${backendApiUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, transcript }),
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();

      return result.feedback;
    } catch (error) {
      console.error('Error analyzing with backend:', error);

      return 'Error processing response.';
    }
  };

  const saveInterviewAnswer = async ({
    interviewId,
    questionId,
    transcript,
    clarity_score,
    structure_score,
    communication_score,
    feedback,
  }: {
    interviewId: number;
    questionId: number;
    transcript?: string;
    clarity_score?: number;
    structure_score?: number;
    communication_score?: number;
    feedback?: string;
  }) => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(
        `${backendApiUrl}/interview/${interviewId}/question/${questionId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answer: transcript,
            clarity_score,
            structure_score,
            communication_score,
            feedback,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save answer: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving answer:', error);
      return null;
    }
  };

  return {
    isAnalyzing,
    isRecording,
    results,
    error,
    analyzeInterview,
    fetchInterviewQuestions,
    saveInterviewAnswer,
    analyzeSingleQuestion,
    fetchInterviewResults,
  };
}
