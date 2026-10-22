# Blog App

A full-stack blogging application by [Farzan Hosseini](https://github.com/farzanini), an AI and software engineer.

## Features

- Sign in with Google or GitHub.
- Create posts with tags and featured images selected through Unsplash search.
- Browse posts and author profiles.
- Like, comment on, and bookmark posts; view a reading list.
- Follow authors and view follower and following lists.
- Upload a profile avatar to Supabase Storage.

## Tech stack

- Next.js 13 with React 18 and TypeScript
- Tailwind CSS
- tRPC and TanStack React Query
- Prisma with PostgreSQL
- NextAuth.js
- Supabase Storage and the Unsplash API

## Getting started

Requirements: Node.js and npm. Configure the environment variables declared in `src/env/schema.mjs` before running the app. The project expects database, authentication provider, Unsplash, and Supabase settings.

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. `npm install` runs Prisma Client generation through the `postinstall` script. For a production build and start, run:

```bash
npm run build
npm run start
```

## Project structure

```text
prisma/             Prisma schema
src/components/     UI components
src/pages/          Next.js pages and API routes
src/server/trpc/    tRPC setup and routers
src/env/            Environment variable schemas
```
