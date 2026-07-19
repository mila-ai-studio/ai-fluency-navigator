export type AppRoute = "/" | "/diagnostic" | "/result";

export function getCurrentRoute(): AppRoute {
  if (window.location.pathname === "/diagnostic") return "/diagnostic";
  if (window.location.pathname === "/result") return "/result";
  return "/";
}

export function navigate(route: AppRoute): void {
  if (window.location.pathname !== route) {
    window.history.pushState({}, "", route);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}
