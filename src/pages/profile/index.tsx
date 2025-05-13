import { useEffect, useState } from 'react';
import DefaultLayout from '@/layouts/default';
import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import useInterviewAnalysis from '@/hooks/useInterviewAnalysis';

type InterviewSummary = {
  interview_id: number;
  created_at: string;
  clarity: number | null;
  structure: number | null;
  communication: number | null;
};

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchInterviewResults } = useInterviewAnalysis();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('email');
    if (savedEmail) setEmail(savedEmail);

    const loadResults = async () => {
      const results = await fetchInterviewResults();

      console.log(results);
      setInterviews(results);
      setLoading(false); // ✅ only runs after results are loaded
    };

    loadResults();
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

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner
              classNames={{ label: 'text-foreground mt-4' }}
              color="secondary"
              label="Loading interview results..."
              size="lg"
              variant="wave"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {interviews.map((interview) => {
              const { clarity, structure, communication } = interview;
              const isIncomplete =
                clarity === null &&
                structure === null &&
                communication === null;

              return (
                <Card
                  key={interview.interview_id}
                  className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <CardBody>
                    <div className="space-y-3">
                      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        📊 Interview on{' '}
                        {new Date(interview.created_at).toLocaleString()}
                      </div>

                      {isIncomplete ? (
                        <div className="text-center text-yellow-600 dark:text-yellow-400 font-medium">
                          Incomplete interview
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                              <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Clarity
                              </span>
                              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {clarity}/10
                              </span>
                            </div>
                            <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                              <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Structure
                              </span>
                              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                {structure}/10
                              </span>
                            </div>
                            <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                              <span className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Communication
                              </span>
                              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                {communication}/10
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
