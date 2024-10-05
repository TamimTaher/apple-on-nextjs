import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import * as THREE from "three";  // Import THREE namespace for three.js types

gsap.registerPlugin(ScrollTrigger);

// Define types for the function parameters
interface AnimationProps {
  [key: string]: any; // Key-value pairs for GSAP animation properties
}

interface ScrollProps {
  [key: string]: any; // Key-value pairs for GSAP scroll properties
}

export const animateWithGsap = (
  target: string | Element,  // Target is either a DOM element or a string selector
  animationProps: AnimationProps, 
  scrollProps?: ScrollProps
) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: 'restart reverse restart reverse',
      start: 'top 85%',
      ...scrollProps,
    },
  });
};

interface TimelineProps {
  [key: string]: any; // Key-value pairs for GSAP timeline animation properties
}

export const animateWithGsapTimeline = (
  timeline: gsap.core.Timeline, 
  rotationRef: React.RefObject<THREE.Object3D>, 
  rotationState: number, 
  firstTarget: string | Element,  // Target is either a DOM element or a string selector
  secondTarget: string | Element, 
  animationProps: TimelineProps
) => {
  if (rotationRef.current) {
    timeline.to(rotationRef.current.rotation, {
      y: rotationState,
      duration: 1,
      ease: 'power2.inOut',
    });
  }

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
    },
    '<'
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: 'power2.inOut',
    },
    '<'
  );
};