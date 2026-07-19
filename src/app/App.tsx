import { useCallback, useEffect, useState } from "react";
import { DiagnosticPage } from "../pages/DiagnosticPage";
import { ResultPage } from "../pages/ResultPage";
import { WelcomePage } from "../pages/WelcomePage";
import type { DiagnosticSession } from "../types/diagnostic";
import { createSession, hasValidCompletedSession, loadSession, saveSession } from "../logic/storage";
import { getCurrentRoute, navigate, type AppRoute } from "./routes";

export default function App() {
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute);
  const [session, setSession] = useState<DiagnosticSession | null>(() => loadSession());

  useEffect(() => {
    const handleNavigation = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  useEffect(() => {
    if (route === "/result" && !hasValidCompletedSession(session)) {
      navigate(session ? "/diagnostic" : "/");
    }
  }, [route, session]);

  useEffect(() => {
    if (route !== "/diagnostic") return;
    if (session?.completed) {
      navigate("/result");
      return;
    }
    if (!session) {
      const nextSession = createSession();
      saveSession(nextSession);
      setSession(nextSession);
    }
  }, [route, session]);

  const updateSession = useCallback((nextSession: DiagnosticSession) => {
    setSession(nextSession);
  }, []);

  function startDiagnostic() {
    const nextSession = createSession();
    saveSession(nextSession);
    setSession(nextSession);
    navigate("/diagnostic");
  }

  function restartDiagnostic() {
    const nextSession = createSession();
    saveSession(nextSession);
    setSession(nextSession);
    navigate("/diagnostic");
  }

  if (route === "/diagnostic") {
    if (!session || session.completed) return null;
    return (
      <DiagnosticPage
        initialSession={session}
        onSessionChange={updateSession}
        onComplete={(completedSession) => {
          setSession(completedSession);
          navigate("/result");
        }}
      />
    );
  }

  if (route === "/result" && hasValidCompletedSession(session)) {
    return <ResultPage session={session!} onRestart={restartDiagnostic} />;
  }

  return <WelcomePage onStart={startDiagnostic} />;
}
