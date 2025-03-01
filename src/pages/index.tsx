import { Snippet } from '@heroui/snippet';
import { Button } from '@heroui/button';
import { useState } from 'react';
import { Card, CardBody } from '@heroui/card';

import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [renderOption, setRenderOption] = useState(true);

  const [pokemonData, setPokemonData] = useState<{
    name: string;
    id: number;
  } | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
      const data = await response.json();

      setTimeout(() => {
        setPokemonData({ name: data.name, id: data.id });
        setIsLoading(false);
        setRenderOption(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
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
        {pokemonData && (
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
            shadow="sm"
          >
            <CardBody>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                <div className="flex flex-col col-span-6 md:col-span-8">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0">
                      <h3 className="font-semibold text-foreground/90">
                        Daily Mix
                      </h3>
                      <p className="text-small text-foreground/80">12 Tracks</p>
                      <h1 className="text-large font-medium mt-2">
                        Frontend Radio
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </section>
    </DefaultLayout>
  );
}
