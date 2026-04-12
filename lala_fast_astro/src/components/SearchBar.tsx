import type { JSX } from 'preact';
import '../styles/SearchBar.css';

interface Props {
  value: string;
  onInput: (e: JSX.TargetedEvent<HTMLInputElement>) => void;
  onSubmit: (e: JSX.TargetedEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export default function SearchBar({ value, onInput, onSubmit, loading }: Props): JSX.Element {
  return (
    <form class="search-bar" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Buscar"
        value={value}
        onInput={onInput}
      />
      <button type="submit" disabled={loading}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
