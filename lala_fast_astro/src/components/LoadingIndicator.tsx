import type { JSX } from 'preact';
import '../styles/LoadingIndicator.css';

interface Props {
  visible: boolean;
}

export default function LoadingIndicator({ visible }: Props): JSX.Element {
  return (
    <span class={`loading-indicator ${visible ? 'visible' : ''}`}>
      <span class="spinner" /> Cargando...
    </span>
  );
}
