
import React from 'react';

// A visually appealing icon with a radial gradient inspired by the provided logo image.
export const BlogcastIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Blogcast icon"
  >
    <defs>
      <radialGradient id="logoGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="15%" stopColor="#F8FF36" />
        <stop offset="35%" stopColor="#FF4747" />
        <stop offset="60%" stopColor="#F500F5" />
        <stop offset="80%" stopColor="#0000FF" />
        <stop offset="100%" stopColor="#00FF00" />
      </radialGradient>
    </defs>
    <path
      d="M26.2,2.8C16.3,0.5,6.5,5.8,4.2,15.7s5.3,19.8,15.2,22.1c9.9,2.3,19.7-3,22-12.9S36.1,5.1,26.2,2.8z M21.8,24.1 c-4.4,0-8.8-2.5-11.3-6.2V28H8.2V8h2.3v6.2c2.5-3.6,6.8-6.2,11.3-6.2c6.6,0,8.8,3.8,8.8,8S28.4,24.1,21.8,24.1z"
      fill="url(#logoGradient)"
    />
    <g fill="url(#logoGradient)">
      <path d="M21.8,14.7c-2.4,0-3.8,1.6-3.8,3.3s1.3,3.3,3.8,3.3s3.8-1.6,3.8-3.3S24.2,14.7,21.8,14.7z" />
      <path d="M25.3,18c0,0.4-0.1,0.8-0.2,1.2c-0.8,2.1-3,3.5-5.3,3.5s-4.5-1.5-5.3-3.5c-0.1-0.4-0.2-0.8-0.2-1.2 s0.1-0.8,0.2-1.2c0.8-2.1,3,3.5,5.3,3.5s4.5,1.5,5.3,3.5C25.2,17.2,25.3,17.6,25.3,18z M21.8,14.7c-2.4,0-3.8,1.6-3.8,3.3 s1.3,3.3,3.8,3.3s3.8-1.6,3.8-3.3S24.2,14.7,21.8,14.7z" />
      <path d="M28.8,18c0,0.6-0.1,1.1-0.3,1.6c-1.1,3-3.9,5-7,5s-5.8-2-7-5c-0.2-0.5-0.3-1.1-0.3-1.6s0.1-1.1,0.3-1.6 c1.1-3,3.9-5,7-5s5.8,2,7,5C28.7,16.9,28.8,17.4,28.8,18z M25.3,18c0-1.9-1.6-3.5-3.5-3.5s-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5 S25.3,19.9,25.3,18z" />
    </g>
  </svg>
);


// Full logo with text for the header
export const BlogcastLogo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`text-white ${className}`}>
        <h1 style={{ fontFamily: "'Righteous', cursive" }} className="text-6xl tracking-wide relative inline-block drop-shadow-lg">
            blogcast
        </h1>
    </div>
);