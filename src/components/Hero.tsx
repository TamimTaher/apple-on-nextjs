'use client';

import gsap from 'gsap';
import { useEffect, useState, useRef } from 'react';
import { heroVideo, smallHeroVideo } from '../utils';

const Hero: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>(heroVideo); // Initial state is the desktop video
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set the video source after the component mounts
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo);
    }

    // Add window resize listener to adjust video source on window resize
    const handleResize = () => {
      if (window.innerWidth < 760) {
        setVideoSrc(smallHeroVideo);
      } else {
        setVideoSrc(heroVideo);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // GSAP animation setup for mobile and desktop
    const mm = gsap.matchMedia();

    mm.add('(max-width: 760px)', () => {
      // Mobile-specific animations
      gsap.to(heroRef.current, { opacity: 1, delay: 2.3 });
      gsap.to(ctaRef.current, { opacity: 1, y: -30, delay: 2.3 });
    });

    mm.add('(min-width: 761px)', () => {
      // Desktop-specific animations
      gsap.to(heroRef.current, { opacity: 1, delay: 2 });
      gsap.to(ctaRef.current, { opacity: 1, y: -50, delay: 2 });
    });

    return () => {
      mm.revert(); // Clean up matchMedia listeners on unmount
    };
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        {/* Hero title with reference for GSAP */}
        <p id="hero" ref={heroRef} className="hero-title opacity-0">
          iPhone 15 Pro
        </p>

        <div className="md:w-10/12 w-9/12">
          {/* Only render the video if videoSrc is set */}
          <video className="pointer-events-none" autoPlay muted playsInline preload="auto" src={videoSrc} />
        </div>
      </div>

      <div id="cta" ref={ctaRef} className="flex flex-col items-center opacity-0 translate-y-20">
        <a href="#highlights" className="btn">
          Buy
        </a>
        <p className="font-normal text-xl">From $199/month or $999</p>
      </div>
    </section>
  );
};

export default Hero;
