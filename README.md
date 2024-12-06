# Time Tracker

App to track time spent on tasks.

## Requirements

- `Node` (version `v21.5.0`)
- `Docker` (version `Docker version 24.0.6, build ed223bc820`)

## Local Development

1. Set up DB credentials:

```bash
cp .env.example .env
```

Then alter env vars as you see fit.

2. Install node dependencies:

```bash
npm install
```

3. Start a development server:

```bash
npm run dev
```

**Note**: This requires port `5432` to be available to start a postgres DB docker container.

## Deployment

The `deployment/` directory provides terraform code that will provision an AWS RDS instance 
in the default VPC.

To deploy the app follow `deployment/README.md`.