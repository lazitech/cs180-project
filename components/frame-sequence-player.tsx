'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { sitePath } from '@/lib/site-path';

/* oxlint-disable next/no-img-element -- Frames must be displayed at their source ratio. */

const frameCount = 12;
const frameDelayMs = 250;
const frameSources = Array.from(
  { length: frameCount },
  (_, index) =>
    sitePath(
      `/media/dolly-frame-${String(index + 1).padStart(2, '0')}.jpg`,
    ),
);

type LoadState = 'loading' | 'ready' | 'error';

interface FrameSequencePlayerProps {
  isActive: boolean;
}

export function FrameSequencePlayer({ isActive }: FrameSequencePlayerProps) {
  const timerRef = useRef<number | null>(null);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedFramesRef = useRef(new Set<number>());
  const hasAutoPlayedRef = useRef(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [isPlaying, setIsPlaying] = useState(false);

  const stopPlayback = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setIsPlaying(false);
  }, []);

  const playSequence = useCallback(() => {
    if (loadState !== 'ready') return;

    stopPlayback();
    let frame = 1;
    setCurrentFrame(frame);
    setIsPlaying(true);

    timerRef.current = window.setInterval(() => {
      if (frame >= frameCount) {
        stopPlayback();
        return;
      }

      frame += 1;
      setCurrentFrame(frame);
      if (frame === frameCount) stopPlayback();
    }, frameDelayMs);
  }, [loadState, stopPlayback]);

  useEffect(() => {
    let cancelled = false;
    const images = frameSources.map((source, index) => {
      const image = new Image();

      const loaded = new Promise<void>((resolve, reject) => {
        image.onload = () => {
          const finish = () => {
            if (!cancelled) {
              loadedFramesRef.current.add(index + 1);
              setLoadedCount((count) => count + 1);
            }
            resolve();
          };

          if (typeof image.decode === 'function') {
            image.decode().then(finish).catch(finish);
          } else {
            finish();
          }
        };
        image.onerror = () =>
          reject(new Error(`Unable to load frame ${index + 1}`));
      });
      image.src = source;

      return { image, loaded };
    });

    preloadedImagesRef.current = images.map(({ image }) => image);
    void Promise.allSettled(images.map(({ loaded }) => loaded)).then((results) => {
      if (cancelled) return;
      const allLoaded = results.every(
        (result) => result.status === 'fulfilled',
      );
      setLoadState(allLoaded ? 'ready' : 'error');
    });

    return () => {
      cancelled = true;
      preloadedImagesRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      // oxlint-disable-next-line react/react-compiler -- Playback is an external timer synchronized to slide visibility.
      stopPlayback();
      return;
    }

    if (loadState !== 'ready' || hasAutoPlayedRef.current) return;
    hasAutoPlayedRef.current = true;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playSequence();
    }
  }, [isActive, loadState, playSequence, stopPlayback]);

  useEffect(() => stopPlayback, [stopPlayback]);

  const handleFrameChange = (value: number | readonly number[]) => {
    stopPlayback();
    const nextFrame = typeof value === 'number' ? value : value[0];
    if (nextFrame && loadedFramesRef.current.has(nextFrame)) {
      setCurrentFrame(nextFrame);
    }
  };

  const paddedFrame = String(currentFrame).padStart(2, '0');
  const controlsDisabled = loadState === 'loading';

  return (
    <div className="deck-frame-player">
      <div className="deck-frame-player__stage">
        <img
          alt={`Pingu dolly zoom frame ${currentFrame} of ${frameCount}`}
          src={frameSources[currentFrame - 1]}
        />
        <div className="deck-frame-player__state" aria-live="polite">
          <span className={isPlaying ? 'is-playing' : undefined} />
          {isPlaying
            ? 'PLAYING'
            : loadState === 'ready'
              ? 'READY'
              : loadState.toUpperCase()}
        </div>
        <div className="deck-frame-player__count">
          {paddedFrame} / {frameCount}
        </div>
        {loadState !== 'ready' && (
          <div className="deck-frame-player__loading">
            {loadState === 'error'
              ? `FRAME LOAD ERROR · ${loadedCount} / ${frameCount}`
              : `PRELOADING · ${loadedCount} / ${frameCount}`}
          </div>
        )}
      </div>

      <div className="deck-frame-player__controls">
        <Button
          className="deck-frame-player__replay"
          disabled={loadState !== 'ready'}
          onClick={playSequence}
          size="sm"
          variant="outline"
        >
          <RotateCcw aria-hidden="true" />
          Replay
        </Button>
        <Slider
          aria-label="Dolly zoom frame"
          className="deck-frame-player__slider"
          disabled={controlsDisabled}
          max={frameCount}
          min={1}
          onValueChange={handleFrameChange}
          step={1}
          value={[currentFrame]}
        />
        <span className="deck-frame-player__label">Frame {paddedFrame}</span>
      </div>

      <div className="deck-frame-player__ticks" aria-hidden="true">
        {frameSources.map((_, index) => (
          <span
            className={currentFrame === index + 1 ? 'is-current' : undefined}
            key={index}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        ))}
      </div>
    </div>
  );
}
