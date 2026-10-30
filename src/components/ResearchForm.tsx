import { useState, type FormEvent } from "react";
import type { Publicity, Research } from "../types";
import { RangeSlider } from "./RangeSlider";

export type ResearchDraft = {
  title: string;
  theme: string;
  asset_class: string;
  geography: string;
  time_horizon: string;
  credibility: number;
  publicity: Publicity;
  attachment: string;
  summary: string;
};

const emptyDraft: ResearchDraft = {
  title: "",
  theme: "",
  asset_class: "",
  geography: "",
  time_horizon: "",
  credibility: 1,
  publicity: "internal",
  attachment: "",
  summary: "",
};

export function draftFrom(row?: Research | null): ResearchDraft {
  if (!row) return emptyDraft;
  return {
    title: row.title,
    theme: row.theme ?? "",
    asset_class: row.asset_class ?? "",
    geography: row.geography ?? "",
    time_horizon: row.time_horizon ?? "",
    credibility: row.credibility,
    publicity: row.publicity,
    attachment: row.attachment ?? "",
    summary: row.summary ?? "",
  };
}

export function ResearchForm({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: Research | null;
  onClose: () => void;
  onSubmit: (draft: ResearchDraft) => string | null;
}) {
  const [draft, setDraft] = useState<ResearchDraft>(draftFrom(initial));
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof ResearchDraft, value: string | number) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const message = onSubmit(draft);
    if (message) setError(message);
    else onClose();
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{title}</h2>
        {error ? <p className="error">{error}</p> : null}
        <label className="field">
          <span>Title</span>
          <input value={draft.title} onChange={(e) => set("title", e.target.value)} required />
        </label>
        <div className="grid-2">
          <label className="field">
            <span>Theme</span>
            <input value={draft.theme} onChange={(e) => set("theme", e.target.value)} />
          </label>
          <label className="field">
            <span>Asset class</span>
            <input value={draft.asset_class} onChange={(e) => set("asset_class", e.target.value)} />
          </label>
          <label className="field">
            <span>Geography</span>
            <input value={draft.geography} onChange={(e) => set("geography", e.target.value)} />
          </label>
          <label className="field">
            <span>Time horizon</span>
            <input value={draft.time_horizon} onChange={(e) => set("time_horizon", e.target.value)} />
          </label>
        </div>
        <label className="field">
          <span>Credibility ({draft.credibility})</span>
          <RangeSlider
            value={draft.credibility}
            onChange={(value) => set("credibility", value)}
          />
        </label>
        <label className="field">
          <span>Publicity</span>
          <select
            value={draft.publicity}
            onChange={(e) => set("publicity", e.target.value as Publicity)}
          >
            <option value="public">public</option>
            <option value="internal">internal</option>
            <option value="licensed">licensed</option>
          </select>
        </label>
        <label className="field">
          <span>Source (attachment)</span>
          <input
            value={draft.attachment}
            onChange={(e) => set("attachment", e.target.value)}
            placeholder="filename.pdf"
          />
        </label>
        <label className="field">
          <span>Summary</span>
          <textarea value={draft.summary} onChange={(e) => set("summary", e.target.value)} />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
