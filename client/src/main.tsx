import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { PostHogProvider } from "@posthog/react";
import mixpanel from "mixpanel-browser";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
} as const;

mixpanel.init("1d4970e4b46baeb599bcb29fb17c7947", {
  autocapture: true,
  record_sessions_percent: 100,
});

amplitude.add(sessionReplayPlugin());
amplitude.init("87e94436b299c152f5b80d9fc4f98fc2", {
  autocapture: {
    attribution: true,
    fileDownloads: true,
    formInteractions: true,
    pageViews: true,
    sessions: true,
    elementInteractions: true,
    networkTracking: true,
    webVitals: true,
    frustrationInteractions: {
      thrashedCursor: true,
      errorClicks: true,
      deadClicks: true,
      rageClicks: true,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
);
