import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Brand } from "../components/Brand";
import { ProfileVisual } from "../components/ProfileVisual";
import { PromptCard } from "../components/PromptCard";
import { diagnosticContent } from "../data/diagnostic";
import { calculateComponentScores, buildComponentProfiles, getLevelForScore } from "../logic/scoring";
import { selectProfile } from "../logic/resultSelection";
import type { DiagnosticSession } from "../types/diagnostic";

export function ResultPage({ session, onRestart }: { session: DiagnosticSession; onRestart: () => void }) {
  const scores = calculateComponentScores(session.selectedOptionByQuestionId);
  const selection = selectProfile(scores);
  const profiles = buildComponentProfiles(scores);
  const growthComponent = diagnosticContent.components.find(
    (component) => component.id === selection.growthArea,
  );
  if (!growthComponent) throw new Error("The selected growth area is unavailable.");

  const growthContent = diagnosticContent.componentContent[selection.growthArea];
  const growthLevel = getLevelForScore(scores[selection.growthArea]);
  const strongestComponents = selection.strongest.map((id) => {
    const component = diagnosticContent.components.find((item) => item.id === id);
    if (!component) throw new Error(`Missing component: ${id}`);
    return { component, content: diagnosticContent.componentContent[id] };
  });

  return (
    <main className="result-page">
      <header className="result-nav">
        <Brand compact />
        <button className="text-button" type="button" onClick={onRestart}>
          <RotateCcw size={15} aria-hidden="true" /> Restart
        </button>
      </header>

      <section className="result-hero">
        <div className="result-hero__copy">
          <p className="eyebrow">Your AI Fluency Profile</p>
          <h1>{selection.summary}</h1>
          <p>Uneven profiles are normal. Each dimension represents a different AI habit.</p>
        </div>
        <div className="result-hero__seal" aria-hidden="true">
          <Sparkles size={24} />
          <span>Built from<br />your habits</span>
        </div>
      </section>

      <section className="result-section profile-section" aria-labelledby="profile-heading">
        <div className="section-heading">
          <span className="section-heading__index">01</span>
          <div>
            <p className="eyebrow">Five distinct habits</p>
            <h2 id="profile-heading">Your fluency profile</h2>
          </div>
        </div>
        <ProfileVisual profiles={profiles} />
      </section>

      <section className="result-section" aria-labelledby="strength-heading">
        <div className="section-heading">
          <span className="section-heading__index">02</span>
          <div>
            <p className="eyebrow">What is working</p>
            <h2 id="strength-heading">
              Your strongest {strongestComponents.length === 1 ? "capability" : "capabilities"}
            </h2>
          </div>
        </div>
        <div className={`strength-grid strength-grid--${strongestComponents.length}`}>
          {strongestComponents.map(({ component, content }) => (
            <article className="strength-card" key={component.id}>
              <span className="strength-card__label">{component.name}</span>
              <p>{content.strengthPhrase}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="result-section growth-section" aria-labelledby="growth-heading">
        <div className="section-heading">
          <span className="section-heading__index">03</span>
          <div>
            <p className="eyebrow">Where to focus</p>
            <h2 id="growth-heading">Highest-impact growth area</h2>
          </div>
        </div>
        <div className="growth-layout">
          <article className="growth-card">
            <p className="growth-card__name">{growthComponent.name}</p>
            <p className="growth-card__phrase">{growthContent.growthPhrase}</p>
          </article>
          <aside className="trap-card">
            <p className="trap-card__label">A typical trap at this stage</p>
            <p>“{growthContent.traps[growthLevel.id]}”</p>
            <span>This is a common pattern, not a fixed trait.</span>
          </aside>
        </div>
      </section>

      <section className="result-section exercise-section" aria-labelledby="exercise-heading">
        <div className="section-heading">
          <span className="section-heading__index">04</span>
          <div>
            <p className="eyebrow">Try this next</p>
            <h2 id="exercise-heading">{growthContent.exercise.title}</h2>
          </div>
        </div>
        <div className="exercise-card">
          <p className="exercise-card__duration">About {growthContent.exercise.duration}</p>
          <ol>
            {growthContent.exercise.instructions.map((instruction) => (
              <li key={instruction}>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="result-tail">
        <PromptCard
          intro={diagnosticContent.growthLevelIntros[growthLevel.id]}
          prompt={growthContent.basePrompt}
        />

        <section className="result-restart">
          <p>AI habits change with practice. Retake the diagnostic whenever your way of working evolves.</p>
          <button className="secondary-button secondary-button--light" type="button" onClick={onRestart}>
            Restart diagnostic <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
      </div>
    </main>
  );
}
