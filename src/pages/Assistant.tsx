import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useStore } from "../store";

export function Assistant() {
  const { threads, createThread, deleteThread, sendMessage } = useStore();
  const [activeId, setActiveId] = useState<string | null>(threads[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(1);

  useEffect(() => {
    if (!activeId && threads[0]) setActiveId(threads[0].id);
    if (activeId && !threads.some((t) => t.id === activeId)) {
      setActiveId(threads[0]?.id ?? null);
    }
  }, [activeId, threads]);

  const active = useMemo(
    () => threads.find((t) => t.id === activeId) ?? null,
    [activeId, threads],
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!active) return;
    sendMessage(active.id, query);
    setQuery("");
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Assistant</h1>
          <p>Chat window with a credibility threshold slider. This demo mocks the agent reply; it does not stream.</p>
        </div>
      </div>
      <div className="assistant">
        <aside className="thread-list">
          <div className="thread-list-head">
            <strong>Conversations</strong>
            <button
              className="btn small"
              onClick={() => {
                const id = createThread();
                setActiveId(id);
              }}
            >
              New
            </button>
          </div>
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={`thread-item${thread.id === activeId ? " active" : ""}`}
              onClick={() => setActiveId(thread.id)}
            >
              {thread.title}
              <small>{new Date(thread.createdAt).toLocaleDateString("en-GB")}</small>
            </button>
          ))}
          {threads.length === 0 ? <div className="empty">No conversations yet.</div> : null}
        </aside>
        <div className="chat">
          <div className="chat-head">
            <strong>{active?.title ?? "No conversation selected"}</strong>
            {active ? (
              <button
                className="btn danger small"
                onClick={() => {
                  if (window.confirm("Delete this conversation?")) deleteThread(active.id);
                }}
              >
                Delete
              </button>
            ) : null}
          </div>
          <div className="messages">
            {active?.messages.map((message) => (
              <div key={message.id} className={`bubble ${message.role}`}>
                {message.content}
              </div>
            ))}
            {active && active.messages.length === 0 ? (
              <div className="empty">Ask a thesis-level question. The live agent is not wired in this UI demo.</div>
            ) : null}
          </div>
          <div className="composer">
            <label className="field" style={{ marginBottom: 0 }}>
              <span>Credibility Threshold</span>
              <div className="range-row">
                <span>1</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
                <span>10</span>
              </div>
            </label>
            <form onSubmit={submit}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask the research assistant…"
                disabled={!active}
              />
              <button className="btn" type="submit" disabled={!active}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
