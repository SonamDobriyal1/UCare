# UCare

UCare is a Vite + React + TypeScript app that provides AI-powered emotional support, community connection, and curated resources for mental wellness.

## Getting started

- Install dependencies: `npm install`
- Run the dev server: `npm run dev`
- Run tests: `npm test`
- Build for production: `npm run build`

## Project stack

- Vite for bundling and dev server
- React 18 with TypeScript
- Tailwind CSS and shadcn/ui components

## Deployment

Build the app with `npm run build`; deploy the generated `dist/` directory to any static host (e.g., Vercel, Netlify, S3 + CDN).

## Backend API

The project includes an Express API in `server/` backed by Firebase Auth + Firestore, with a Gemini 2.5 Flash chatbot integration.

- Install dependencies: `npm install`
- Start API: `npm run dev:server`
- Health check: `GET http://localhost:4000/api/health`

See `server/README.md` for setup, env vars, endpoints, and payloads.
