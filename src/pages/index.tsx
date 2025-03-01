import { Snippet } from '@heroui/snippet';
import { Button } from '@heroui/button';
import { useState } from 'react';

import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);
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
        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Start your first interview{' '}
              <Button
                className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg"
                isLoading={isLoading}
                radius="full"
                variant="shadow"
                onClick={handleClick}
              >
                <p className="leading-none">Start</p>
              </Button>
            </span>
          </Snippet>
          {pokemonData && (
            <div className="mt-4 text-center">
              <p>Name: {pokemonData.name}</p>
              <p>ID: {pokemonData.id}</p>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
