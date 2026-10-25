# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Focus Me is at the very start: the repo holds only `README.md`. No source code, build tooling, test setup or lint config exists yet. Once the frontend/backend scaffolding lands, add the real build, lint and test commands here (including how to run a single test).

## What the app is

A learning app built around an adaptive focus timer. Eye tracking will find the user's best focus and break intervals, and an LLM will build learning paths. The prototype's subject is learning Persian.

## Planned architecture (Phase 1)

- **Frontend:** React, deployed on Vercel. Pages: Login/Logout, Homepage (the timer), Calendar (daily total + list of sessions).
- **Backend:** FastAPI, containerized with Docker, deployed on Google Cloud Run. Endpoints: auth, `POST` save session, `GET` the user's sessions.
- **Database:** Postgres on Neon.
- Key behavior: **stopping the timer auto-saves the session** (the frontend calls the save-session endpoint on stop). The Calendar reads from the get-sessions endpoint.

## Roadmap (build in this order)

1. Timer + deployment (Phase 1 above)
2. Eye tracking
3. Adaptive timer (focus/break intervals driven by eye-tracking data)
4. LLM-generated learning content
5. RAG over research

Keep Phase 1 work scoped to timer, auth, session persistence and deployment; later-phase features build on the session data model.

# Focus Me

Adaptive focus timer app. See README for architecture and roadmap.

## Stack

- Frontend: React + TypeScript (Vite), deployed on Vercel
- Backend: FastAPI (Python), Dockerized on Google Cloud Run
- Database: Postgres on Neon

## How to work with me

- Work on one task at a time, only what I ask for.
- Explain every file you create or change, and why.
- Don't write the database models or the session endpoints. I'm writing those myself.
- Ask before adding new libraries or changing the project structure.
- User identity always comes from the login token, never the request body.
