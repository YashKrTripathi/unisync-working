# UniSync

UniSync is a role-based event management platform for campus communities.
It supports discovery, registration, ticketing, attendance tracking, and organizer workflows in one place.

## Quick Start (Copy/Paste)

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

Run locally:

```bash
npm run dev
```

Setup links:
- Clerk setup: https://clerk.com/docs/quickstarts/nextjs
- Convex setup: https://docs.convex.dev/quickstart/nextjs

## Role-Based Functionality

### Student (User)

- Sign up and sign in (including Google login via Clerk).
- Browse and explore upcoming events.
- View detailed event pages (description, date/time, venue, organizer, capacity, pricing).
- Register for events and receive ticket/registration details.
- Access My Tickets for all joined events.
- See past events and event history views.
- Personalized onboarding flow for interests and location.

### Organizer

- All Student capabilities.
- Create new events from the Create Event page.
- Configure event details: title, description, category, date/time, location, capacity, and pricing type.
- Generate event content with AI event creation support.
- Manage own events from My Events.
- View attendee lists for owned events.
- Scan QR codes for attendee check-in.
- Perform manual attendance entry when needed.

### Admin / Elevated Access

- Access admin dashboard and analytics views.
- Manage events, registrations, reports, assets, announcements, team, and settings.

## Shared Platform Features

- Clerk authentication integration.
- Convex backend for data storage and role-aware access.
- Event search and exploration experience.
- Responsive UI with modern component-based pages.

## Main Routes Available

- Public: Home, Explore, Past Events, Event Details.
- Auth: Sign In, Sign Up.
- Student: My Tickets.
- Organizer: Create Event, My Events, Attendance.
- Admin: Dashboard, Analytics, Events, Registrations, Reports, Team, Settings, and more.

## Getting Started

### 1) Prerequisites

- Node.js 20+ recommended.
- npm 10+ recommended.
- A Clerk project (for authentication).
- A Convex project (for backend/database).

### 2) Install Dependencies

```bash
npm install
```

### 3) Environment Variables

Create a `.env.local` file in the project root and set:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

Notes:
- `GEMINI_API_KEY` is required for AI event generation.
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` is required for Unsplash image search in event creation.
- If Clerk/Convex keys are missing, the app can fall back to limited frontend-only behavior.

### 4) Run in Development

```bash
npm run dev
```

Open `http://localhost:3000`.

### 5) Build and Run Production

```bash
npm run build
npm run start
```

### 6) Lint

```bash
npm run lint
```

## Troubleshooting

### Next build lock error (`.next/lock`)

If you see `Unable to acquire lock ... .next/lock`, another build/dev process is already running.

On Windows PowerShell:

```powershell
Get-Process node,npm -ErrorAction SilentlyContinue | Stop-Process -Force
if (Test-Path .next\lock) { Remove-Item .next\lock -Force }
```

Then re-run:

```bash
npm run dev
```


