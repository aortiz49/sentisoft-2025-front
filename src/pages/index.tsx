import { Snippet } from '@heroui/snippet';
import { Button } from '@heroui/button';
import { useState } from 'react';
import { Card, CardBody } from '@heroui/card';

import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [renderOption, setRenderOption] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const questions = [
    'How do you handle tight deadlines when multiple projects require your attention simultaneously?',
    'Describe a situation where you had to explain a complex technical concept to a non-technical stakeholder.',
    'Tell me about a time when you received critical feedback on your code. How did you respond?',
    'How do you approach disagreements with team members about technical decisions?',
    'Describe your experience working in agile development environments.',
    'How do you prioritize tasks when everything seems urgent?',
    'Tell me about a time when you had to learn a new technology quickly to complete a project.',
    'How do you handle situations where requirements change midway through a project?',
    'Describe a situation where you demonstrated leadership within a development team.',
    'How do you maintain work-life balance during intensive development cycles?',
    'Tell me about a time when you made a significant mistake. How did you handle it?',
    'How do you approach mentoring junior developers?',
    'Describe your communication style when working with remote team members.',
    'How do you stay updated with the latest technologies and development practices?',
    'Tell me about a time when you had to push back on a feature request. How did you handle it?',
    "How do you handle situations where you don't know the answer to a problem?",
    'Describe a situation where you had to collaborate with designers to implement a user interface.',
    "How do you approach code reviews, both when reviewing others' code and receiving feedback on yours?",
    'Tell me about a time when you had to make a decision with incomplete information.',
    'How do you handle conflicts within a development team?',
    'Describe your approach to documentation and knowledge sharing.',
    'How do you manage stress during critical production issues or system outages?',
    'Tell me about a time when you had to advocate for better development practices or tools.',
    'How do you communicate project delays or technical challenges to project managers or clients?',
    'Describe a situation where you had to adapt to a completely different tech stack or development environment.',
    'How do you balance quality with speed when developing features?',
    'Tell me about a time when you had to work with difficult team members or stakeholders.',
    'How do you approach giving constructive feedback to peers?',
    'Describe your experience working cross-functionally with product managers, designers, and other stakeholders.',
    'How do you handle situations where you strongly disagree with a decision made by management?',
  ];

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Randomly select 3 questions
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      setTimeout(() => {
        setSelectedQuestions(selected);
        setIsLoading(false);
        setRenderOption(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Tech Skills Open Doors.&nbsp;</span>
          <span className={title({ color: 'violet' })}>Soft Skills&nbsp;</span>
          <br />
          <span className={title()}>Get You Through Them.&nbsp;</span>
          <div className={subtitle({ class: 'mt-4' })}>
            Ace your next behavioral interview with AI-powered practice
            sessions.
          </div>
        </div>
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
                  onPress={handleClick}
                >
                  <p className="leading-none">Start</p>
                </Button>
              </span>
            </Snippet>
          </div>
        )}
        {selectedQuestions.length > 0 && (
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
            shadow="sm"
          >
            <CardBody>
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-foreground/90">
                  Behavioral Interview Questions
                </h3>
                {selectedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border-b border-foreground/10 pb-4 last:border-none"
                  >
                    <p className="text-foreground/80 font-medium">
                      Question {index + 1}:
                    </p>
                    <p className="text-foreground/90">{question}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </section>
    </DefaultLayout>
  );
}
