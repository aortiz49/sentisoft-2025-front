import { Snippet } from '@heroui/snippet';
import { Button } from '@heroui/button';

import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';

export default function IndexPage() {
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
        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Start your first interview{' '}
              <Button
                className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg px-8 h-6 text-xs "
                radius="full"
                variant="shadow"
              >
                <p className="leading-none">Start</p>
              </Button>
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
