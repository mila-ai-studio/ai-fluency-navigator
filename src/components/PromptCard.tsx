import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PromptCardProps {
  intro: string;
  prompt: string;
}

type CopyState = "idle" | "copied" | "failed";

export function PromptCard({ intro, prompt }: PromptCardProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (copyState === "idle" || copyState === "failed") return;
    const timeout = window.setTimeout(() => setCopyState("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  async function copyPrompt() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(prompt);
      setCopyState("copied");
    } catch {
      promptRef.current?.focus();
      promptRef.current?.select();
      setCopyState("failed");
    }
  }

  return (
    <section className="prompt-section" aria-labelledby="prompt-title">
      <div className="section-heading section-heading--light">
        <span className="section-heading__index">05</span>
        <div>
          <p className="eyebrow">Put it into practice</p>
          <h2 id="prompt-title">Your next-level prompt</h2>
        </div>
      </div>
      <p className="prompt-section__intro">{intro}</p>
      <div className="prompt-card">
        <textarea
          ref={promptRef}
          className="prompt-card__text"
          readOnly
          value={prompt}
          aria-label="Next-level prompt text"
          rows={7}
        />
        <button className="copy-button" type="button" onClick={copyPrompt}>
          {copyState === "copied" ? <Check size={17} /> : <Copy size={17} />}
          {copyState === "copied" ? "Copied" : "Copy prompt"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copyState === "copied"
          ? "Prompt copied to clipboard."
          : copyState === "failed"
            ? "Copy failed. Select the prompt manually."
            : ""}
      </p>
      {copyState === "failed" && (
        <p className="copy-error" role="status">
          Copy failed. Select the prompt manually.
        </p>
      )}
    </section>
  );
}
