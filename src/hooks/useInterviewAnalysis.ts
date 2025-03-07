import { useState } from 'react';

interface AnalysisResult {
  question: string;
  transcript: string;
  sentiment: string;
  feedback: string;
}

export default function useInterviewAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const deepgramApiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;

  // ✅ Load backend URL from environment variables
  const backendApiUrl =
    import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000';

  const analyzeInterview = async (
    questionsWithAudio: { question: string; audioBlob: Blob | null }[]
  ) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisPromises = questionsWithAudio.map(async (item, index) => {
        if (!item.audioBlob) return null;

        const formData = new FormData();

        formData.append('file', item.audioBlob, `question_${index}.webm`);
        console.log(import.meta.env.VITE_DEEPGRAM_API_KEY);
        // ✅ Send request to Deepgram for transcription
        const deepgramResponse = await fetch(
          'https://api.deepgram.com/v1/listen?punctuate=true&model=general&detect_language=true',
          {
            method: 'POST',
            headers: { Authorization: `Token ${deepgramApiKey}` },
            body: formData,
          }
        );

        if (!deepgramResponse.ok) {
          throw new Error(`Deepgram API error: ${deepgramResponse.status}`);
        }

        const deepgramResult = await deepgramResponse.json();
        const transcript =
          deepgramResult.results.channels[0].alternatives[0]?.transcript ?? '';
        const sentiment =
          deepgramResult.results.channels[0]?.alternatives[0]?.sentiment
            ?.overall || 'unknown';

        console.log(transcript);
        // ✅ Send transcript to FastAPI backend (instead of calling Claude directly)
        const feedback = await analyzeWithBackend(item.question, transcript);

        return {
          question: item.question,
          transcript,
          sentiment,
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

  // ✅ Updated function to send request to your FastAPI backend (which calls Claude)
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

      return result.feedback; // Make sure the backend returns `{ feedback: "..." }`
    } catch (error) {
      console.error('Error analyzing with backend:', error);

      return 'Error processing response.';
    }
  };

  return {
    isAnalyzing,
    results,
    error,
    analyzeInterview,
  };
}
