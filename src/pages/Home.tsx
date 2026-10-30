import { useStore } from "../store";

function formatWhen(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Home() {
  const { overview, currentUser } = useStore();

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Home</h1>
          <p>Welcome back, {currentUser?.display_name}. Market Overview is firm-wide for the latest research window.</p>
        </div>
      </div>
      <article className="overview">
        <h2>Market Overview</h2>
        <div className="meta">
          Generated {formatWhen(overview?.createdAt)} · latest research {formatWhen(overview?.latestResearchAt)}
        </div>
        {overview?.content.split("\n\n").map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </article>
    </section>
  );
}
