import type { JSX } from 'preact';
import './HeroSection.css';

export default function HeroSection(): JSX.Element {
  return (
    <section class="hero-section">
      <h1 class="hero-title">
        <span class="hero-line hero-line-1">ENCUENTRA</span>
        <span class="hero-line hero-line-2">TU CANCIÓN</span>
      </h1>
    </section>
  );
}
