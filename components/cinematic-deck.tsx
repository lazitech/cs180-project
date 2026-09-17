'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FrameSequencePlayer } from '@/components/frame-sequence-player';
import { projectCopy } from '@/components/project-ui';
import { sitePath } from '@/lib/site-path';

/* oxlint-disable next/no-img-element -- Assignment stills are intentionally shown unoptimized. */

const slideLabels = ['Cover', 'Portrait', 'Architecture', 'Dolly Zoom'];

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest('a, button, input, textarea, select'))
  );
}

export function CinematicDeck() {
  const deckRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const goToSlide = useCallback((requestedIndex: number) => {
    const deck = deckRef.current;
    if (!deck) return;

    const nextIndex = Math.max(
      0,
      Math.min(slideLabels.length - 1, requestedIndex),
    );
    if (
      nextIndex === activeIndexRef.current &&
      Math.abs(deck.scrollTop - nextIndex * deck.clientHeight) < 2
    ) {
      return;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    deck.scrollTo({
      top: nextIndex * deck.clientHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });

    wheelLockedRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      wheelLockedRef.current = false;
    }, 850);
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const slides = Array.from(
      deck.querySelectorAll<HTMLElement>('[data-slide]'),
    );
    let scrollFrame = 0;

    const updateFromScroll = () => {
      scrollFrame = 0;
      const index = Math.max(
        0,
        Math.min(
          slides.length - 1,
          Math.round(deck.scrollTop / deck.clientHeight),
        ),
      );
      if (index !== activeIndexRef.current) updateActiveIndex(index);
    };

    const onScroll = () => {
      if (!scrollFrame)
        scrollFrame = window.requestAnimationFrame(updateFromScroll);
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
              if (!visible) return;
              const index = slides.indexOf(visible.target as HTMLElement);
              if (index >= 0 && index !== activeIndexRef.current)
                updateActiveIndex(index);
            },
            { root: deck, threshold: [0.55, 0.7, 0.9] },
          )
        : null;

    slides.forEach((slide) => observer?.observe(slide));
    deck.addEventListener('scroll', onScroll, { passive: true });

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      if (Math.abs(event.deltaY) < 8) return;
      if (wheelLockedRef.current) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = activeIndexRef.current + direction;
      if (nextIndex < 0 || nextIndex >= slides.length) return;
      goToSlide(nextIndex);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isInteractiveTarget(event.target)
      )
        return;

      let nextIndex: number | null = null;
      if (
        event.key === 'ArrowDown' ||
        event.key === 'PageDown' ||
        (event.key === ' ' && !event.shiftKey)
      ) {
        nextIndex = activeIndexRef.current + 1;
      } else if (
        event.key === 'ArrowUp' ||
        event.key === 'PageUp' ||
        (event.key === ' ' && event.shiftKey)
      ) {
        nextIndex = activeIndexRef.current - 1;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = slides.length - 1;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      goToSlide(nextIndex);
    };

    const onResize = () => {
      deck.scrollTo({
        top: activeIndexRef.current * deck.clientHeight,
        behavior: 'auto',
      });
    };

    deck.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      slides.forEach((slide) => observer?.unobserve(slide));
      observer?.disconnect();
      deck.removeEventListener('scroll', onScroll);
      deck.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [goToSlide, updateActiveIndex]);

  const slideClass = (index: number, className: string) =>
    `deck-slide ${className}${activeIndex === index ? ' is-active' : ''}`;

  return (
    <main className="cinematic-page">
      <div className="deck-chrome" aria-hidden="true">
        <span>CS180 / PROJECT 0</span>
        <span>ANZHE LYU / 2026</span>
      </div>

      <nav className="deck-progress" aria-label="Project sections">
        <span className="deck-progress__number">0{activeIndex + 1}</span>
        <div className="deck-progress__rail">
          {slideLabels.map((label, index) => (
            <Button
              aria-current={activeIndex === index ? 'step' : undefined}
              aria-label={`Go to slide ${index + 1}: ${label}`}
              className="deck-progress__dot"
              key={label}
              onClick={() => goToSlide(index)}
              size="icon-xs"
              variant="ghost"
            >
              <span />
            </Button>
          ))}
        </div>
        <span className="deck-progress__total">04</span>
      </nav>

      <section
        aria-label="Four-slide camera project"
        aria-roledescription="presentation"
        className="deck"
        ref={deckRef}
      >
        <section
          aria-label="Slide 1 of 4: Cover"
          aria-roledescription="slide"
          className={slideClass(0, 'deck-cover')}
          data-slide
          id="cover"
        >
          <div className="deck-slide__inner deck-cover__layout">
            <div className="deck-cover__copy">
              <p className="deck-kicker motion-item">
                Project 0
              </p>
              <h1 className="motion-item">
                Becoming
                <br />
                Friends
                <br />
                with Your
                <br />
                <span className="deck-cover__accent">Camera</span>
              </h1>
              <button
                className="deck-scroll-cue motion-item"
                onClick={() => goToSlide(1)}
                type="button"
              >
                Scroll to begin <span aria-hidden="true">↓</span>
              </button>
            </div>

            <figure className="deck-cover__media">
              <div className="deck-cover__stage">
                <img
                  src={sitePath('/media/dolly-frame-01.jpg')}
                  alt="Complete first Pingu dolly zoom frame"
                />
              </div>
            </figure>
          </div>
        </section>

        <section
          aria-label="Slide 2 of 4: Portrait perspective"
          aria-roledescription="slide"
          className={slideClass(1, 'deck-portrait')}
          data-slide
          id="portrait"
        >
          <div className="deck-slide__inner deck-portrait__layout">
            <header className="deck-heading">
              <p className="deck-kicker motion-item">Sequence 01 / Portrait</p>
              <h2 className="motion-item">
                Distance
                <br />
                corrects the face.
              </h2>
              <p className="deck-explainer motion-item">
                {projectCopy.portrait}
              </p>
            </header>

            <div className="deck-portrait__frames">
              {[
                [
                  sitePath('/media/portrait-close.jpg'),
                  'SHOT 01',
                  'CLOSE',
                  '😢',
                ],
                [
                  sitePath('/media/portrait-medium.jpg'),
                  'SHOT 02',
                  'STEP BACK',
                  '🤔',
                ],
                [
                  sitePath('/media/portrait-far.jpg'),
                  'SHOT 03',
                  'FAR',
                  '😎',
                ],
              ].map(([src, shot, note, emoji]) => (
                <figure className="deck-frame" key={src}>
                  <div className="deck-frame__shot">{shot}</div>
                  <div className="deck-frame__image">
                    <img src={src} alt={`${note} portrait`} />
                    <figcaption>{note}</figcaption>
                  </div>
                  <div aria-hidden="true" className="deck-frame__emoji">
                    {emoji}
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-label="Slide 3 of 4: Architectural perspective"
          aria-roledescription="slide"
          className={slideClass(2, 'deck-architecture')}
          data-slide
          id="architecture"
        >
          <div className="deck-slide__inner deck-architecture__layout">
            <header className="deck-heading">
              <p className="deck-kicker motion-item">
                Sequence 02 / Architecture
              </p>
              <h2 className="motion-item">
                Space can
                <br />
                collapse.
              </h2>
              <p className="deck-explainer motion-item">
                {projectCopy.architecture}
              </p>
            </header>

            <div className="deck-architecture__frames">
              <figure className="deck-architecture__frame deck-architecture__frame--left">
                <img
                  src={sitePath('/media/architecture-telephoto.jpg')}
                  alt="Telephoto building view from farther away"
                />
                <figcaption>
                  <strong>A</strong>
                  <span>FARTHER / TELEPHOTO</span>
                  <em>Compression</em>
                </figcaption>
              </figure>
              <figure className="deck-architecture__frame deck-architecture__frame--right">
                <img
                  src={sitePath('/media/architecture-wide.jpg')}
                  alt="Wide building view from closer"
                />
                <figcaption>
                  <strong>B</strong>
                  <span>CLOSER / WIDE</span>
                  <em>Depth</em>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section
          aria-label="Slide 4 of 4: Dolly zoom"
          aria-roledescription="slide"
          className={slideClass(3, 'deck-dolly')}
          data-slide
          id="dolly-zoom"
        >
          <div className="deck-slide__inner deck-dolly__layout">
            <header className="deck-heading deck-dolly__heading">
              <p className="deck-kicker motion-item">
                Sequence 03 / The Vertigo Shot
              </p>
              <h2 className="motion-item">
                Move back.
                <br />
                <i>Zoom in.</i>
              </h2>
              <p className="deck-explainer motion-item">{projectCopy.dolly}</p>
            </header>

            <div className="deck-dolly__media">
              <FrameSequencePlayer isActive={activeIndex === 3} />
            </div>

            <footer className="deck-final__footer">
              <span>CS 180 · Project 0</span>
              <span>Becoming Friends with Your Camera · Anzhe Lyu · 2026</span>
            </footer>
          </div>
        </section>
      </section>
    </main>
  );
}
