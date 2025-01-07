# Time Tracker

There are 168 hours in a week.

How would you like to spend them?

![App](/dev/app.png)

The whole idea with this app is to first breakdown how you would like to spend your time in an ideal week.
Everybody needs to spend time on things like sleep, work, commute, personal care, hobbies. In this modern
age it is easy to fall into time sinks like doom scrolling, lazing around, or just generally meandering
and not feeling fulfilled by not spending time wisely.

Everyone needs time to relax but time is a scarce resource so why not make the most of it.

## Requirements

- [Node](https://nodejs.org/en) (version `v21.5.0`)
- [Docker](https://www.docker.com/) (version `Docker version 24.0.6, build ed223bc820`)

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

3. Start app & db with docker:

```bash
npm run dev
```

**Note**: This requires port `5432` to be available to start a postgres DB docker container.

4. Access the application at http://localhost:5173

## Deployment

The [deployment/](deployment/) directory provides terraform code that will provision an AWS RDS instance
in the default VPC.

To deploy the app to AWS follow [deployment/README.md](deployment/README.md).

## Scripts

The following `npm` scripts are probably the most useful:

```bash
npm run dev             # runs the app & db docker containers
npm run format          # formats the project
npm run pgcli           # to access the local DB
npm run pgconf          # to configure db credentials in ~/.pg_service.conf

# Requires prod env set up
npm run pull-prod       # to pull data from the prod env locally
npm run reset-local-db  # wipes and seeds DB locally without pulling data
```

To run `npm run pull-prod` we require prod configured as `rds` in `~/.pg_service.conf` and `pg_dump`. Try `npm run pgconf`.

To install `pg_dump` via `brew`:

```bash
brew install postgresql
```
