import { useState } from "react";
import { CredibilityThresholdField } from "../components/CredibilityThresholdField";
import { useStore } from "../store";
import { ResearchForm, type ResearchDraft } from "../components/ResearchForm";
import type { ContentType, Research } from "../types";

function formatWhen(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ContentPage({ title, contentType }: { title: string; contentType: ContentType }) {
  const { researches, currentUser, createResearch, updateResearch, deleteResearch, toggleLike } =
    useStore();
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Research | null>(null);
  const rows = researches.filter((r) => r.contentType === contentType);
  const threshold = currentUser?.credibility_threshold ?? 1;

  const liked = (id: string) => currentUser?.likes.includes(id) ?? false;

  const save = (draft: ResearchDraft) => {
    if (mode === "edit" && editing) return updateResearch(editing.id, draft);
    return createResearch(contentType, draft);
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
        </div>
        <div className="page-head-tools">
          <CredibilityThresholdField className="threshold-field" />
          <button
            className="btn gold"
            onClick={() => {
              setEditing(null);
              setMode("create");
            }}
          >
            Create
          </button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Like</th>
              <th>Title</th>
              <th>Theme</th>
              <th>Asset class</th>
              <th>Geography</th>
              <th>Horizon</th>
              <th>Cred.</th>
              <th>Publicity</th>
              <th>Source</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={row.credibility <= threshold ? "flagged" : undefined}>
                <td>
                  <button
                    className={`heart${liked(row.id) ? " liked" : ""}`}
                    title={liked(row.id) ? "Unlike" : "Like"}
                    onClick={() => toggleLike(row.id)}
                  >
                    {liked(row.id) ? "♥" : "♡"}
                  </button>
                </td>
                <td>
                  <strong>{row.title}</strong>
                  {row.summary ? (
                    <div className="meta" style={{ margin: "4px 0 0" }}>
                      {row.summary}
                    </div>
                  ) : null}
                </td>
                <td>{row.theme ?? "—"}</td>
                <td>{row.asset_class ?? "—"}</td>
                <td>{row.geography ?? "—"}</td>
                <td>{row.time_horizon ?? "—"}</td>
                <td>{row.credibility}</td>
                <td>
                  <span className="pill">{row.publicity}</span>
                </td>
                <td>{row.attachment ?? "—"}</td>
                <td>{formatWhen(row.createdAt)}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="btn ghost small"
                      onClick={() => {
                        setEditing(row);
                        setMode("edit");
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="btn danger small"
                      onClick={() => {
                        if (window.confirm(`Delete “${row.title}”?`)) deleteResearch(row.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={11} className="empty">
                  No items yet. Create the first {title.toLowerCase()} row.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {mode ? (
        <ResearchForm
          title={mode === "create" ? `Create ${title}` : `Update ${title}`}
          initial={editing}
          onClose={() => {
            setMode(null);
            setEditing(null);
          }}
          onSubmit={save}
        />
      ) : null}
    </section>
  );
}
