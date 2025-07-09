
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PodcastPost from './components/PodcastPost';
import { BlogcastLogo } from './components/Logo';
import { Podcast } from './types';

const App: React.FC = () => {
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/podcasts');
        if (!response.ok) {
          throw new Error(`Failed to fetch podcasts: ${response.statusText}`);
        }
        const data = await response.json();
        // The Gemini schema returns { podcasts: [...] }
        setAllPodcasts(data.podcasts || []); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  const loadMorePodcasts = useCallback(() => {
    if (visibleCount >= allPodcasts.length) return;
    setVisibleCount((prevCount) => Math.min(prevCount + 10, allPodcasts.length));
  }, [visibleCount, allPodcasts.length]);

  useEffect(() => {
    if (isLoading || allPodcasts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePodcasts();
        }
      },
      { root: null, rootMargin: '40px', threshold: 0.1 }
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [isLoading, loadMorePodcasts, allPodcasts.length]);

  const podcastsToShow = allPodcasts.slice(0, visibleCount);

  return (
    <div className="min-h-screen w-full text-white">
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col items-center text-center">
          <BlogcastLogo />
          <p className="mx-auto mt-3 max-w-md text-base text-gray-200 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            The future of podcasting starts here.
          </p>
        </header>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-2xl font-semibold">Loading podcasts...</p>
          </div>
        )}
        
        {error && (
            <div className="text-center p-8 bg-red-900/50 rounded-lg">
                <p className="text-2xl font-bold text-red-300">An Error Occurred</p>
                <p className="mt-2 text-red-200">{error}</p>
            </div>
        )}

        {!isLoading && !error && (
          <>
            <section aria-label="Top podcasts list" className="flex flex-col gap-12">
              {podcastsToShow.map((podcast) => (
                <PodcastPost key={podcast.rank} podcast={podcast} />
              ))}
            </section>
            
            {visibleCount < allPodcasts.length && (
                <div ref={loader} className="h-20" />
            )}
          </>
        )}

        <footer className="mt-16 text-center text-sm text-gray-200/80">
            <p>The future of podcasting. © 2025 blogcast™</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
