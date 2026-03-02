# AIStudyBud
AIStudyBud is a full-stack AI-powered study assistant built with React, FastAPI, and PostgreSQL
It is made to explore backend structure, database presistence, and LLM integration. 

## Status
Not completed
Current Focus: Integrating local LLM

## Build
Frontend: Next.js
Backend: FastAPI
Database: PostgreSQL (Dockerized)
Frontend -> FastAPI Routes -> Service Layer -> Database

## Current Features
- Chat History
- Layered backend architecture
- Auto-scroll UI
- Loading state handling

## Future Additions
- Ollama LLM integration
- Study Modes
- Deployment 

## How to run locally
1. Start Postgres:
    docker compose up -d
2. Start backend 
    python -m venv venv
    venv\Scripts\activate  # For Windows
    uvicorn app.main:app --reload
3. Start frontend 
    npm run dev 