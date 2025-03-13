import { Navbar } from '@/components/navbar';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="container mx-auto max-w-7xl flex-grow md:pt-8 flex flex-col justify-center">
        {children}
      </main>
    </div>
  );
}
