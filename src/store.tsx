import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MARKET_OVERVIEW_CREDIBILITY_THRESHOLD,
  type ContentType,
  type DemoState,
  type MarketOverview,
  type Message,
  type Publicity,
  type Research,
  type Thread,
  type User,
} from "./types";

const LS_KEY = "wit-rp-demo-v1";
const SESSION_KEY = "wit-rp-session-user";
const MOCK_REPLY = "This is an UI demo, AI agent is not integrated.";

type ResearchDraft = {
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

type Store = {
  ready: boolean;
  error: string | null;
  currentUser: User | null;
  researches: Research[];
  overview: MarketOverview | null;
  threads: Thread[];
  login: (email: string, password: string) => string | null;
  logout: () => void;
  createResearch: (contentType: ContentType, draft: ResearchDraft) => string | null;
  updateResearch: (id: string, draft: ResearchDraft) => string | null;
  deleteResearch: (id: string) => void;
  toggleLike: (id: string) => void;
  createThread: () => string;
  deleteThread: (id: string) => void;
  sendMessage: (threadId: string, content: string) => void;
  setCredibilityThreshold: (value: number) => void;
};

const StoreContext = createContext<Store | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso() {
  return new Date().toISOString();
}

async function loadSeed(): Promise<DemoState> {
  const base = import.meta.env.BASE_URL;
  const [users, researches, overviews, threads] = await Promise.all([
    fetch(`${base}data/users.json`).then((r) => r.json()),
    fetch(`${base}data/researches.json`).then((r) => r.json()),
    fetch(`${base}data/market_overviews.json`).then((r) => r.json()),
    fetch(`${base}data/threads.json`).then((r) => r.json()),
  ]);
  return { users, researches, overviews, threads };
}

function readLocal(): DemoState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as DemoState) : null;
  } catch {
    return null;
  }
}

function writeLocal(state: DemoState) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function blankToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function clampScore(value: number) {
  return Math.min(10, Math.max(1, Math.round(value)));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSeed()
      .then((loaded) => {
        if (cancelled) return;
        const local = readLocal();
        const next = local ?? loaded;
        setState({
          ...next,
          overviews: next.overviews.map((overview) => ({
            ...overview,
            credibility: MARKET_OVERVIEW_CREDIBILITY_THRESHOLD,
          })),
        });
        const sessionId = sessionStorage.getItem(SESSION_KEY);
        const users = (local ?? loaded).users;
        setCurrentUser(users.find((u) => u.id === sessionId) ?? null);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load demo JSON.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = (next: DemoState) => {
    setState(next);
    writeLocal(next);
  };

  const value = useMemo<Store>(() => {
    const researches = (state?.researches ?? []).filter((r) => !r.deletedAt);
    const user = currentUser
      ? (state?.users.find((u) => u.id === currentUser.id) ?? currentUser)
      : null;

    return {
      ready: Boolean(state),
      error,
      currentUser: user,
      researches,
      overview: state?.overviews[0] ?? null,
      threads: [...(state?.threads ?? [])].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
      login: (email, password) => {
        if (!state) return "Demo data is still loading.";
        const found = state.users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
        );
        if (!found) return "Email or password is not recognised.";
        setCurrentUser(found);
        sessionStorage.setItem(SESSION_KEY, found.id);
        return null;
      },
      logout: () => {
        setCurrentUser(null);
        sessionStorage.removeItem(SESSION_KEY);
      },
      createResearch: (contentType, draft) => {
        if (!state) return "Demo data is still loading.";
        const title = draft.title.trim();
        const attachment = draft.attachment.trim();
        if (!title) return "Title is required.";
        const duplicate = state.researches.some(
          (r) =>
            !r.deletedAt &&
            (r.title.toLowerCase() === title.toLowerCase() ||
              (attachment && r.attachment?.toLowerCase() === attachment.toLowerCase())),
        );
        if (duplicate) return "A duplicate already exists for that title or attachment name.";
        const stamp = nowIso();
        const row: Research = {
          id: uid("r"),
          title,
          theme: blankToNull(draft.theme),
          asset_class: blankToNull(draft.asset_class),
          geography: blankToNull(draft.geography),
          time_horizon: blankToNull(draft.time_horizon),
          confidence: null,
          credibility: clampScore(draft.credibility),
          contentType,
          publicity: draft.publicity,
          attachment: blankToNull(draft.attachment),
          summary: blankToNull(draft.summary),
          createdAt: stamp,
          updatedAt: stamp,
          deletedAt: null,
        };
        persist({ ...state, researches: [row, ...state.researches] });
        return null;
      },
      updateResearch: (id, draft) => {
        if (!state) return "Demo data is still loading.";
        const title = draft.title.trim();
        const attachment = draft.attachment.trim();
        if (!title) return "Title is required.";
        const duplicate = state.researches.some(
          (r) =>
            r.id !== id &&
            !r.deletedAt &&
            (r.title.toLowerCase() === title.toLowerCase() ||
              (attachment && r.attachment?.toLowerCase() === attachment.toLowerCase())),
        );
        if (duplicate) return "A duplicate already exists for that title or attachment name.";
        persist({
          ...state,
          researches: state.researches.map((r) =>
            r.id === id
              ? {
                  ...r,
                  title,
                  theme: blankToNull(draft.theme),
                  asset_class: blankToNull(draft.asset_class),
                  geography: blankToNull(draft.geography),
                  time_horizon: blankToNull(draft.time_horizon),
                  credibility: clampScore(draft.credibility),
                  publicity: draft.publicity,
                  attachment: blankToNull(draft.attachment),
                  summary: blankToNull(draft.summary),
                  updatedAt: nowIso(),
                }
              : r,
          ),
        });
        return null;
      },
      deleteResearch: (id) => {
        if (!state) return;
        persist({
          ...state,
          researches: state.researches.map((r) =>
            r.id === id ? { ...r, deletedAt: nowIso(), updatedAt: nowIso() } : r,
          ),
          users: state.users.map((u) => ({
            ...u,
            likes: u.likes.filter((liked) => liked !== id),
          })),
        });
      },
      toggleLike: (id) => {
        if (!state || !user) return;
        const row = state.researches.find((r) => r.id === id && !r.deletedAt);
        if (!row) return;
        const liked = user.likes.includes(id);
        persist({
          ...state,
          users: state.users.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  likes: liked ? u.likes.filter((x) => x !== id) : [...u.likes, id],
                }
              : u,
          ),
          researches: state.researches.map((r) => {
            if (r.id !== id) return r;
            const next = liked ? r.credibility - 1 : r.credibility + 1;
            return {
              ...r,
              credibility: clampScore(next),
              updatedAt: nowIso(),
            };
          }),
        });
      },
      createThread: () => {
        if (!state) return "";
        const id = uid("th");
        const thread: Thread = {
          id,
          title: "New conversation",
          createdAt: nowIso(),
          messages: [],
        };
        persist({ ...state, threads: [thread, ...state.threads] });
        return id;
      },
      deleteThread: (id) => {
        if (!state) return;
        persist({ ...state, threads: state.threads.filter((t) => t.id !== id) });
      },
      sendMessage: (threadId, content) => {
        if (!state) return;
        const text = content.trim();
        if (!text) return;
        const stamp = nowIso();
        const userMsg: Message = {
          id: uid("m"),
          role: "user",
          content: text,
          createdAt: stamp,
        };
        const botMsg: Message = {
          id: uid("m"),
          role: "assistant",
          content: MOCK_REPLY,
          createdAt: stamp,
        };
        persist({
          ...state,
          threads: state.threads.map((t) => {
            if (t.id !== threadId) return t;
            const title =
              t.messages.length === 0 && t.title === "New conversation"
                ? text.slice(0, 48)
                : t.title;
            return { ...t, title, messages: [...t.messages, userMsg, botMsg] };
          }),
        });
      },
      setCredibilityThreshold: (value: number) => {
        if (!state || !user) return;
        persist({
          ...state,
          users: state.users.map((u) =>
            u.id === user.id
              ? { ...u, credibility_threshold: clampScore(value) }
              : u,
          ),
        });
      },
    };
  }, [currentUser, error, state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
