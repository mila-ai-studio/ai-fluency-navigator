export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "brand brand--compact" : "brand"} aria-label="AI Fluency Navigator">
      <span className="brand__mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="brand__name">AI Fluency Navigator</span>
    </div>
  );
}
