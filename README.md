# Time Tracker

App to track time spent on tasks.

## Requirements

- `Node` (version TBD)
- `Docker` (version TBD)

## Quick Start (local)

1. Set up DB credentials:

```bash
cp .env.example .env
```

Then alter env vars as you see fit.

2. Install node dependencies:

```bash
npm install
```

3. Start the DB:

```bash
npm run db-restart
```

4. Start a development server:

```bash
npm run dev
```

**Note**: This requires port `5432` to be available to start a postgres DB docker container.

## Deploying

Deploy using vercel.

Pushing to `main` branch then updates prod.

Prod is protected with the `VITE_APP_PASSWORD` env var defined in vercel.