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
        <i class="mdi mdi-magnify" />
      </button>
    </form>
  );
}
