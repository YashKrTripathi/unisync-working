# UniSync Platform Structure

This document provides a comprehensive overview of the UniSync architectural map, including page routes, features, backend functions, and external API integrations.

## 1. Public Interface (`/app/(public)`)
The student-facing side of the platform focused on discovery and registration.

- **Landing Page (`/`)**: Hero section, stats, and "About Events" overview. Uses `siteContent.getPageContent`.
- **Explore Events (`/events`)**: Search and filter upcoming campus events. Uses `explore.getEvents`.
- **Event Details (`/events/[id]`)**: Deep dive into specific events with registration flow. Uses `events.getEvent`.
- **Team (`/team`)**: Information about the core development team. Uses `siteContent.getPageContent`.
- **FAQ (`/faq`)**: Common questions and answers.
- **Location (`/location`)**: Campus map and venue information.
- **Past Events (`/past-events`)**: Archive of previous campus activities.

---

## 2. Admin Portal (`/app/admin`)
The management suite for organizers and superadmins.

- **Dashboard (`/admin`)**: Overview stats, recent activity, and quick actions. Uses `admin.getDashboardStats`.
- **Events Manager (`/admin/events`)**: List view of current events with editing and deletion capabilities.
- **AI Creative Studio (`/admin/events/[id]/studio`)**: AI-driven beautification of event content. Integrates with **OpenRouter (Gemini 2.0 Flash)**.
- **Registrations (`/admin/registrations`)**: Manage attendee lists, check-ins, and export data.
- **Analytics (`/admin/analytics`)**: Visual insights into event performance and student Engagement. Uses `adminAnalytics` functions.
- **Site Content (`/admin/site-content`)**: CMS for updating Home, Team, and FAQ pages without code changes. Uses `siteContent` mutations.
- **Announcements**: Broadcast system for campus-wide alerts.
- **Reports**: Generate comprehensive event and registration PDF/CSV reports.

---

## 3. Backend Engine (`/convex`)
A reactive database and serverless backend.

- **`events.js`**: Core CRUD for event objects.
- **`explore.js`**: Optimized queries for public searching and categorization.
- **`admin.js`**: Higher-privilege dashboard and user management logic.
- **`registrations.js`**: Logic for ticketing, attendance tracking, and user limits.
- **`siteContent.js`**: Schema-based content management for landing pages.
- **`aiEvents.js`**: Prompt engineering and logic for the Event Studio.
- **`schema.js`**: Database definitions including Events, Users, Registrations, and Stats.

---

## 4. Core Integrations
- **Auth**: **Clerk** (Middleware managed, role-based protection).
- **AI**: **OpenRouter** (Gemini models via `convex/aiEvents.js`).
- **Database**: **Convex** (Real-time snapshots and ACID transactions).
- **Styling**: **Tailwind CSS** with a custom "Nameless" Design System (Orange/Blue).
- **Deployment**: **Vercel** + **Convex Production DB**.
