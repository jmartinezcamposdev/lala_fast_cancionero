import type { JSX } from 'preact';
import './Header.css';

export default function Header(): JSX.Element {
  return (
    <header class="top-header">
      <div class="header-inner">
        <a href="/" class="logo-text">Karaoke LaLa</a>
        <span class="header-divider">|</span>
        <a href="/" class="subtitle-text">Cancionero</a>
      </div>
    </header>
  );
}
