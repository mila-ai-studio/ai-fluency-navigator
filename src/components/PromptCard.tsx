import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PromptCardProps {
  intro: string;
  packageText: string;
}

type CopyState = "idle" | "copied" | "failed";

export function PromptCard({ intro, packageText }: PromptCardProps) {
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
      await navigator.clipboard.writeText(packageText);
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
          value={packageText}
          aria-label="Personalized next-step package"
          rows={7}
        />
        <button className="copy-button" type="button" onClick={copyPrompt}>
          {copyState === "copied" ? <Check size={17} /> : <Copy size={17} />}
          {copyState === "copied" ? "Copied" : "Copy my next step"}
        </button>
      </div>
      <p className="copy-helper">Paste it into any AI chat. Everything needed is included.</p>
      <p className="sr-only" aria-live="polite">
        {copyState === "copied"
          ? "Next-step package copied to clipboard."
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
