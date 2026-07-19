import { ArrowRight, Clock3, LockKeyhole } from "lucide-react";
import { Brand } from "../components/Brand";

export function WelcomePage({ onStart }: { onStart: () => void }) {
  return (
    <main className="welcome-page">
      <header className="welcome-nav">
        <Brand />
        <p className="welcome-nav__note">A practical AI habits diagnostic</p>
      </header>

      <section className="welcome-hero">
        <div className="welcome-hero__content">
          <p className="eyebrow">Your next step starts here</p>
          <h1>Discover how you work with AI — and what to improve next.</h1>
          <p className="welcome-hero__lead">
            Answer 10 short questions to see your strengths, your highest-impact growth area,
            and one practical next step.
          </p>
          <div className="welcome-meta" aria-label="Diagnostic details">
            <span>10 questions</span>
            <span>About 3 minutes</span>
            <span>No AI terminology test</span>
          </div>
          <button className="primary-button primary-button--hero" type="button" onClick={onStart}>
            Start the diagnostic <ArrowRight size={19} aria-hidden="true" />
          </button>
          <p className="privacy-note">
            <LockKeyhole size={15} aria-hidden="true" /> Your answers stay in your browser.
          </p>
        </div>

        <aside className="welcome-motif" aria-label="Five connected AI habits">
          <div className="motif-orbit" aria-hidden="true">
            <span className="motif-orbit__center">AI</span>
            {["Goal", "Iterate", "Verify", "Reuse", "Tools"].map((label, index) => (
              <span className={`motif-node motif-node--${index + 1}`} key={label}>
                <i>0{index + 1}</i>
                {label}
              </span>
            ))}
          </div>
          <div className="motif-caption">
            <Clock3 size={17} aria-hidden="true" />
            <span>
              <strong>One short diagnostic.</strong> Five practical dimensions of everyday AI use.
            </span>
          </div>
        </aside>
      </section>

      <footer className="welcome-footer">
        <span>Not a test. Not a grade.</span>
        <span>Just a clearer map of what to try next.</span>
      </footer>
    </main>
  );
}
