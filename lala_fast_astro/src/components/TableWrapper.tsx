import type { JSX } from 'preact';
import '../styles/TableWrapper.css';

interface Props {
  children: JSX.Element | JSX.Element[] | string;
}

export default function TableWrapper({ children }: Props): JSX.Element {
  return (
    <div class="table-wrapper">
      {children}
    </div>
  );
}
