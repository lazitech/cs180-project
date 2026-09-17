import type { Metadata } from 'next';
import Link from 'next/link';

import { sitePath } from '@/lib/site-path';

/* oxlint-disable next/no-img-element -- The assignment preview must preserve the source ratio. */

export const metadata: Metadata = {
  title: 'CS180 — Anzhe Lyu',
  description:
    'Anzhe Lyu’s CS180 course portfolio: experiments in photography and computational imaging.',
};

export default function CourseIndexPage() {
  return (
    <main className="course-page">
      <div className="course-grain" aria-hidden="true" />

      <header className="course-header">
        <Link className="course-wordmark" href="/">
          CS180
        </Link>
        <p>Computer Vision &amp; Computational Photography</p>
        <p>Fall 2026</p>
      </header>

      <section className="course-hero" aria-labelledby="course-title">
        <div className="course-hero__copy">
          <p className="course-kicker">Course portfolio / Anzhe Lyu</p>
          <h1 id="course-title">
            Learning
            <br />
            to see.
          </h1>
          <p className="course-intro">
            A collection of camera studies and computational imaging projects,
            built through CS180 at UC Berkeley.
          </p>
        </div>

        <Link className="project-card" href="/0/">
          <div className="project-card__image">
            <img
              alt="Pingu in the first frame of a dolly zoom sequence"
              src={sitePath('/media/dolly-frame-01.jpg')}
            />
            <span className="project-card__number">00</span>
          </div>

          <div className="project-card__body">
            <div>
              <p>Project 0</p>
              <h2>Becoming Friends with Your Camera</h2>
            </div>
            <span className="project-card__arrow" aria-hidden="true">
              ↗
            </span>
          </div>

          <ul className="project-card__tags" aria-label="Project topics">
            <li>Perspective</li>
            <li>Focal length</li>
            <li>Dolly zoom</li>
          </ul>
        </Link>
      </section>

      <footer className="course-footer">
        <span>ANZHE LYU</span>
        <span>UC BERKELEY · CS180</span>
      </footer>
    </main>
  );
}
