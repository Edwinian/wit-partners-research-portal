# WIT Partners Research Portal

Static UI demo for the WIT Partners Research Platform SA&D (`WIT-RP-SAD-001`). It shows how the portal looks: login, Home / Market Overview, content pages, and Assistant. There is no FastAPI, PostgreSQL, Qdrant, or vLLM in this repo.

CRUD is JSON-backed (`public/data/*.json`). Mutations stay in the browser via `localStorage`. Assistant does not stream an agent; every submitted query returns:

> This is an UI demo, AI agent is not integrated.

## Demo login

- Email: `im@witpartners.com`
- Password: `witdemo`

## Run locally

```bash
npm install
npm run dev
```

## GitHub Pages

The site is a HashRouter static build. Push to `main` deploys with GitHub Actions.
