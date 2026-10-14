import { createFidesClient } from "@fides/sdk-ts";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const client = createFidesClient(window.location.origin, (input, init) => {
  const url = new URL(String(input));
  url.pathname = `/api${url.pathname}`;
  return fetch(url, init);
});
function App() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: ({ signal }) => client.health(signal),
    retry: false,
  });
  return (
    <main>
      <p className="eyebrow">FIDES / DEVELOPMENT</p>
      <h1>Workspace foundation</h1>
      <p>
        The API, worker, and public client are scaffolded. Lending workflows are
        not implemented.
      </p>
      <section aria-labelledby="status-title">
        <h2 id="status-title">API connection</h2>
        <p role="status">
          {health.isPending
            ? "Checking API…"
            : health.isError
              ? "API unavailable. Start the local API and retry."
              : "API connected"}
        </p>
        <button
          type="button"
          disabled={health.isFetching}
          onClick={() => health.refetch()}
        >
          Check connection
        </button>
      </section>
      <p className="note">
        Synthetic development only. Not ready for production lending.
      </p>
    </main>
  );
}
const root = document.getElementById("root");
if (!root) throw new Error("Missing app root");
createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
