import React from 'react';
import { Podcast } from '../types';

const getSrcFromEmbed = (embedCode: string): string | null => {
  const srcMatch = embedCode.match(/src="([^"]*)"/);
  return srcMatch ? srcMatch[1] : null;
};

const PodcastPost: React.FC<{ podcast: Podcast }> = ({ podcast }) => {
  const embedSrc = getSrcFromEmbed(podcast.embedCode);

  return (
    <article
      aria-labelledby={`podcast-title-${podcast.rank}`}
      // Use relative positioning to anchor the rank badge. Added top padding to make space for it.
      className="relative pt-5 bg-black/30 backdrop-blur-2xl rounded-3xl overflow-visible shadow-2xl border border-white/20"
    >
      {/* Absolute positioned rank badge to match the reference image's layout. */}
      <span 
        className="absolute -top-4 -left-4 z-10 flex-shrink-0 inline-flex items-center justify-center rounded-full bg-[#ff007f] text-white w-14 h-14 text-xl font-bold shadow-lg ring-4 ring-black/30"
      >
        #{podcast.rank}
      </span>

      {/* Header section with robust padding to create a "safe area" for text, preventing overlap. */}
      <div className="pl-16 pr-5 sm:pr-6 pb-4">
          <h2 id={`podcast-title-${podcast.rank}`} className="text-2xl font-bold text-white drop-shadow-md leading-tight">
            {podcast.title}
          </h2>
          <p className="text-base text-gray-300 mt-1">{podcast.author}</p>
      </div>
      
      {/* Player container with user-approved responsive height for a better viewing experience. */}
      {embedSrc && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-5">
          <div 
            // The height is now responsive: 460px mobile, 470px tablet, 520px desktop.
            className="relative mx-auto w-full max-w-[660px] rounded-2xl overflow-hidden h-[460px] md:h-[470px] lg:h-[520px]"
          >
            <iframe
              title={podcast.title}
              src={embedSrc}
              loading="lazy"
              style={{
                position: 'absolute',
                top: '-5px',
                left: '-8px',
                width: 'calc(100% + 16px)',
                height: 'calc(100% + 16px)',
                border: '0',
              }}
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default PodcastPost;
