import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnswerOption } from "../components/AnswerOption";
import { ProgressHeader } from "../components/ProgressHeader";
import { orderedQuestions } from "../data/diagnostic";
import { isDiagnosticComplete } from "../logic/scoring";
import { createSession, saveSession } from "../logic/storage";
import type { DiagnosticSession } from "../types/diagnostic";

interface DiagnosticPageProps {
  initialSession: DiagnosticSession;
  onComplete: (session: DiagnosticSession) => void;
  onSessionChange: (session: DiagnosticSession) => void;
}

export function DiagnosticPage({
  initialSession,
  onComplete,
  onSessionChange,
}: DiagnosticPageProps) {
  const [session, setSession] = useState(initialSession);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const question = orderedQuestions[session.currentQuestionIndex];
  const selectedId = session.selectedOptionByQuestionId[question.id];

  const orderedOptions = useMemo(() => {
    const byId = new Map(question.options.map((option) => [option.id, option]));
    return session.optionOrderByQuestionId[question.id]
      .map((id) => byId.get(id))
      .filter((option): option is NonNullable<typeof option> => Boolean(option));
  }, [question, session.optionOrderByQuestionId]);

  useEffect(() => {
    saveSession(session);
    onSessionChange(session);
  }, [session, onSessionChange]);

  useEffect(() => {
    questionHeadingRef.current?.focus();
  }, [session.currentQuestionIndex]);

  function selectOption(optionId: string) {
    setSession((current) => ({
      ...current,
      selectedOptionByQuestionId: {
        ...current.selectedOptionByQuestionId,
        [question.id]: optionId,
      },
    }));
  }

  function goBack() {
    if (session.currentQuestionIndex === 0) return;
    setSession((current) => ({
      ...current,
      currentQuestionIndex: current.currentQuestionIndex - 1,
    }));
  }

  function goNext() {
    if (!selectedId) return;
    if (session.currentQuestionIndex < orderedQuestions.length - 1) {
      setSession((current) => ({
        ...current,
        currentQuestionIndex: current.currentQuestionIndex + 1,
      }));
      return;
    }

    if (!isDiagnosticComplete(session.selectedOptionByQuestionId)) return;
    const completedSession = { ...session, completed: true };
    saveSession(completedSession);
    onSessionChange(completedSession);
    onComplete(completedSession);
  }

  function restart() {
    const freshSession = createSession();
    setSession(freshSession);
  }

  return (
    <main className="diagnostic-page">
      <ProgressHeader
        current={session.currentQuestionIndex + 1}
        total={orderedQuestions.length}
        onRestart={restart}
      />

      <section className="question-shell" key={question.id}>
        <p className="question-kicker">Choose the response closest to what you usually do.</p>
        <h1 ref={questionHeadingRef} tabIndex={-1}>
          {question.text}
        </h1>
        <fieldset className="answer-list">
          <legend className="sr-only">Answer choices</legend>
          {orderedOptions.map((option) => (
            <AnswerOption
              key={option.id}
              option={option}
              questionId={question.id}
              checked={selectedId === option.id}
              onSelect={selectOption}
            />
          ))}
        </fieldset>
      </section>

      <footer className="diagnostic-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={goBack}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              goBack();
            }
          }}
          disabled={session.currentQuestionIndex === 0}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={goNext}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              goNext();
            }
          }}
          disabled={!selectedId}
        >
          {session.currentQuestionIndex === orderedQuestions.length - 1 ? "See my profile" : "Next"}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </footer>
    </main>
  );
}
