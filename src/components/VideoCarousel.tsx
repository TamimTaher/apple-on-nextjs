'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState, useMemo } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

gsap.registerPlugin(ScrollTrigger);

type ProcessType = 'video-end' | 'pause' | 'play';

interface VideoState {
  isEnd: boolean;
  startPlay: boolean;
  videoId: number;
  isLastVideo: boolean;
  isPlaying: boolean;
}

const VideoCarousel: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement[]>([]);
  const videoSpanRef = useRef<HTMLSpanElement[]>([]);
  const videoDivRef = useRef<HTMLSpanElement[]>([]);

  const [video, setVideo] = useState<VideoState>({
    isEnd: false,
    startPlay: true,
    videoId: 0,
    isLastVideo: false,
    isPlaying: true,
  });

  const [loadedData, setLoadedData] = useState<Event[]>([]);
  const { videoId, isPlaying, isLastVideo } = video;

  useGSAP(() => {
    // Move the slider to show the correct video
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prev) => ({
          ...prev,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [videoId]);

  useEffect(() => {
    // Ensure the current video starts playing when `isPlaying` is true
    if (isPlaying && videoRef.current[videoId]) {
      videoRef.current[videoId]?.play();
    } else {
      videoRef.current[videoId]?.pause();
    }
  }, [videoId, isPlaying]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // Animation to move the progress indicator
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress !== currentProgress) {
            currentProgress = progress;

            // Update progress bar width
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });

            // Set progress bar color and width
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        // Reset progress bar and change color when the video ends
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      // Update the progress bar based on video currentTime
      const animUpdate = () => {
        if (videoRef.current[videoId]) {
          anim.progress(
            videoRef.current[videoId]?.currentTime! /
              hightlightsSlides[videoId].videoDuration
          );
        }
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, isPlaying]);

  // Play the video automatically when it is loaded and ready
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]?.pause();
      } else {
        videoRef.current[videoId]?.play();
      }
    }
  }, [isPlaying, videoId, loadedData]);

  const handleProcess = (type: ProcessType, i: number) => {
    try {
      switch (type) {
        case "video-end":
          if (i < hightlightsSlides.length - 1) {
            setVideo((prev) => ({
              ...prev,
              videoId: i + 1,
              isPlaying: true,
            }));
          } else {
            setTimeout(() => {
              setVideo((prev) => ({
                ...prev,
                videoId: 0,
                isPlaying: true,
              }));
            }, 1000);
          }
          break;

        case "pause":
          setVideo((prev) => ({ ...prev, isPlaying: false }));
          videoRef.current[videoId]?.pause();
          break;

        case "play":
          setVideo((prev) => ({ ...prev, isPlaying: true }));
          videoRef.current[videoId]?.play();
          break;
      }
    } catch (error) {
      console.error('Error in handleProcess:', error);
    }
  };

  const handleLoadedMetaData = (i: number, e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setLoadedData((prev) => [...prev, e.nativeEvent]);
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(el) => {
                    if (el) {
                      videoRef.current[i] = el;
                    }
                  }}
                  onEnded={() =>
                    handleProcess("video-end", i)
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => {
                if (el) {
                  videoDivRef.current[i] = el;
                }
              }}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => {
                  if (el) {
                    videoSpanRef.current[i] = el;
                  }
                }}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={() => handleProcess(isPlaying ? "pause" : "play", 0)}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;