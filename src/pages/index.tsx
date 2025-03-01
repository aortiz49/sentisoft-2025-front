import { Snippet } from '@heroui/snippet';
import { Code } from '@heroui/code';

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
              Get started by editing{' '}
              <Code color="primary">pages/index.tsx</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
