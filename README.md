# Focus Me

A learning app with an adaptive focus timer. It uses eye tracking to find your best focus and break intervals, and an LLM to build engaging learning paths. Prototype: learning Persian.

## Architecture (Phase 1)

```mermaid
flowchart LR
  subgraph FE["Frontend: React on Vercel"]
    Login["Login / Logout"]
    Home["Homepage: Timer"]
    Cal["Calendar: daily total + sessions"]
  end
  subgraph BE["Backend: FastAPI on Cloud Run"]
    Auth["Auth"]
    Save["POST: save session"]
    Get["GET: user's sessions"]
  end
  DB[("Postgres on Neon")]
  Login --> Auth
  Home -- "stop = auto-save" --> Save
  Cal --> Get
  Auth --> DB
  Save --> DB
  Get --> DB
```

## Roadmap

```mermaid
flowchart LR
  P1["1. Timer + deployment"] --> P2["2. Eye tracking"]
  P2 --> P3["3. Adaptive timer"]
  P3 --> P4["4. LLM content"]
  P4 --> P5["5. RAG over research"]
```

## Tech Stack

React · FastAPI · PostgreSQL · Docker · Vercel · Google Cloud Run · Neon
