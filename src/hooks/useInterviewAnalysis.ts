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

  const analyzeInterview = async (
    questionsWithAudio: {
      question: string;
      audioBlob: Blob | null;
    }[],
    deepgramApiKey: string,
    llmApiKey: string
  ) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisPromises = questionsWithAudio.map(async (item, index) => {
        if (!item.audioBlob) return null;

        const formData = new FormData();

        formData.append('file', item.audioBlob, `question_${index}.webm`);

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
          deepgramResult.results.channels[0].alternatives[0]?.sentiment
            ?.overall ?? 'unknown';

        const feedback = await analyzeWithLLM(
          item.question,
          transcript,
          llmApiKey
        );

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

  const analyzeWithLLM = async (
    question: string,
    transcript: string,
    apiKey: string
  ) => {
    const prompt = `
      You are a behavioral interview coach.

      Evaluate the following response to the interview question: "${question}"

      Candidate's response:
      ${transcript}

      Please provide:
      - Feedback on clarity, structure, and communication style.
      - Whether the candidate stayed on topic.
      - Suggested improvements.
    `;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const result = await response.json();

    return result.choices[0].message.content;
  };

  return {
    isAnalyzing,
    results,
    error,
    analyzeInterview,
  };
}
