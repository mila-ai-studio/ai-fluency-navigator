import { Brand } from "./Brand";

interface ProgressHeaderProps {
  current: number;
  total: number;
  onRestart: () => void;
}

export function ProgressHeader({ current, total, onRestart }: ProgressHeaderProps) {
  const percentage = (current / total) * 100;
  return (
    <header className="diagnostic-header">
      <div className="diagnostic-header__top">
        <Brand compact />
        <button className="text-button" type="button" onClick={onRestart}>
          Restart
        </button>
      </div>
      <div className="progress-row">
        <span className="progress-row__label">
          <strong>{current}</strong> of {total}
        </span>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Diagnostic progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current}
        >
          <span className="progress-track__fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </header>
  );
}
