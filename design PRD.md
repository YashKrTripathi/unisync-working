# UniSync Event Management System - Design PRD

**Document Version:** 1.0
**Date:** March 20, 2026
**Project:** UniSync / DYPIU EventHub
**Purpose:** Visual design specification for Figma design and frontend development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Design System](#2-design-system)
3. [Typography](#3-typography)
4. [Color Palette](#4-color-palette)
5. [Component Library](#5-component-library)
6. [Page Specifications](#6-page-specifications)
7. [Navigation](#7-navigation)
8. [Animation & Interactions](#8-animation--interactions)
9. [Responsive Design](#9-responsive-design)
10. [Design Assets](#10-design-assets)

---

## 1. Project Overview

### 1.1 Product Description
UniSync is a campus event management platform for D. Y. Patil International University. The platform enables students and staff to discover events, register with QR-code tickets, and allows organizers to create and manage events through an admin dashboard.

### 1.2 Target Users
- **Students & Attendees:** Browse events, register, manage tickets
- **Event Organizers:** Create events, track registrations, manage attendance
- **Administrators:** Oversee all events, manage approvals, view analytics

### 1.3 Design Philosophy
- **Dark-first design** with glassmorphism effects
- **Bold typography** using display fonts for impact
- **Minimalist UI** with generous whitespace
- **Smooth micro-interactions** and scroll animations
- **University branding** integrated throughout

---

## 2. Design System

### 2.1 Design Framework
- **Base:** shadcn/ui (New York style variant)
- **Approach:** Component-based, utility-first with Tailwind CSS
- **Theme:** Forced dark mode with accent colors

### 2.2 Spacing Scale
```
4px   (1)   - Micro spacing
8px   (2)   - Icon padding, tight gaps
12px  (3)   - Small component padding
16px  (4)   - Default spacing unit
24px  (6)   - Section gaps
32px  (8)   - Large component padding
48px  (12)  - Section separators
64px  (16)  - Major section margins
96px  (24)  - Hero sections
128px (32)  - Page-level spacing
```

### 2.3 Border Radius
```
4px   - Small elements (badges, chips)
6px   - Inputs, small buttons
8px   - Cards, medium elements
12px  - Large cards, panels
16px  - Modals, large containers
9999px - Pills, circular buttons
```

### 2.4 Shadows
```css
/* Subtle */
0 1px 2px rgba(0, 0, 0, 0.05)

/* Default */
0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)

/* Large */
0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)

/* Glow (accent) */
0 0 20px rgba(245, 158, 11, 0.3)

/* Glass shadow */
0 8px 32px rgba(0, 0, 0, 0.3)
```

---

## 3. Typography

### 3.1 Font Families

| Font | Weight | Usage | Google Fonts |
|------|--------|-------|--------------|
| **Inter** | 400, 500, 600, 700 | Body text, UI elements, buttons | [Link](https://fonts.google.com/specimen/Inter) |
| **Anton** | 400 | Display headings, hero text, section titles | [Link](https://fonts.google.com/specimen/Anton) |
| **Playfair Display** | 400 Italic | Quotes, subtitles, decorative text | [Link](https://fonts.google.com/specimen/Playfair+Display) |

### 3.2 Type Scale

| Name | Size | Line Height | Weight | Font | Usage |
|------|------|-------------|--------|------|-------|
| **Display XL** | clamp(68px, 8vw, 118px) | 0.9 | 400 | Anton | Hero headings |
| **Display L** | clamp(48px, 6vw, 80px) | 0.95 | 400 | Anton | Section headings |
| **Display M** | clamp(32px, 4vw, 48px) | 1.0 | 400 | Anton | Feature headings |
| **Heading 1** | 36px | 1.2 | 700 | Inter | Page titles |
| **Heading 2** | 30px | 1.3 | 600 | Inter | Subsections |
| **Heading 3** | 24px | 1.4 | 600 | Inter | Card titles |
| **Heading 4** | 20px | 1.4 | 500 | Inter | Small headings |
| **Body Large** | 18px | 1.75 | 400 | Inter | Lead paragraphs |
| **Body** | 16px | 1.75 | 400 | Inter | Default body |
| **Body Small** | 14px | 1.5 | 400 | Inter | Secondary text |
| **Caption** | 12px | 1.4 | 500 | Inter | Labels, metadata |
| **Overline** | 11px | 1.2 | 500 | Inter | Uppercase labels, tracking: 0.28em |
| **Serif Accent** | 24-32px | 1.3 | 400 | Playfair Italic | Decorative quotes |

### 3.3 Typography Styles in Context

**Hero Section:**
```
Overline: "DISCOVER • CONNECT • EXPERIENCE"
  - 11px, Inter, uppercase, letter-spacing: 0.28em
  - Color: white/42%

Main Heading: "CREATE MOMENTS THAT MATTER"
  - clamp(68px, 8vw, 118px), Anton, uppercase
  - Color: white
  - letter-spacing: -0.02em

Subtitle: "Where Campus Life Comes Alive"
  - 24-32px, Playfair Display Italic
  - Color: white/80%
```

**Section Title:**
```
Label: "OUR EVENTS"
  - 11px, Inter, uppercase, tracking: 0.28em
  - Color: white/42%

Title: "DISCOVER CAMPUS LIFE"
  - clamp(48px, 8vw, 80px), Anton, uppercase
  - Color: white
```

---

## 4. Color Palette

### 4.1 Brand Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **DYPIU Navy** | `#1E3A8A` | 30, 58, 138 | Primary brand, buttons |
| **DYPIU Navy Light** | `#2563EB` | 37, 99, 235 | Hover states, links |
| **DYPIU Red** | `#DC2626` | 220, 38, 38 | Destructive actions, alerts |
| **DYPIU Red Light** | `#EF4444` | 239, 68, 68 | Error states |
| **DYPIU Gold** | `#F59E0B` | 245, 158, 11 | Accent, highlights, CTAs |
| **DYPIU Gold Light** | `#FBBF24` | 251, 191, 36 | Hover accents |

### 4.2 Accent Colors (Event Theming)

| Name | Hex | Usage |
|------|-----|-------|
| **Nameless Orange** | `#FF4D00` | Event theme accent |
| **Nameless Red** | `#E63946` | Event theme secondary |
| **Pure Black** | `#000000` | Event backgrounds |

### 4.3 UI Colors (Dark Theme)

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#000000` | Page background |
| **Background Secondary** | `#0A0A0A` | Elevated surfaces |
| **Card** | `#111827` | Card backgrounds |
| **Card Elevated** | `#1F2937` | Hover card states |
| **Muted** | `#1E293B` | Subtle backgrounds |
| **Border** | `rgba(255, 255, 255, 0.08)` | Default borders |
| **Border Accent** | `rgba(255, 255, 255, 0.15)` | Emphasized borders |
| **Primary** | `#3B82F6` | Primary actions |
| **Accent** | `#F59E0B` | Accent elements |
| **Destructive** | `#DC2626` | Delete, errors |
| **Success** | `#22C55E` | Confirmations |

### 4.4 Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| **Foreground** | `#FFFFFF` | Primary text |
| **Foreground Secondary** | `rgba(255, 255, 255, 0.72)` | Body text |
| **Foreground Muted** | `rgba(255, 255, 255, 0.42)` | Labels, captions |
| **Foreground Subtle** | `rgba(255, 255, 255, 0.28)` | Disabled, placeholders |

### 4.5 Glassmorphism

| Property | Value |
|----------|-------|
| **Glass Tint** | `rgba(255, 255, 255, 0.18)` |
| **Glass Border** | `rgba(255, 255, 255, 0.42)` |
| **Glass Shadow** | `rgba(0, 0, 0, 0.3)` |
| **Backdrop Blur** | `16px` (default), `24px` (heavy) |

**Glass Card Recipe:**
```css
background: rgba(17, 24, 39, 0.6);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 12px;
```

### 4.6 Gradient Presets

**Background Radial Glow:**
```css
radial-gradient(ellipse 80% 50% at 50% 100%, rgba(245, 158, 11, 0.15), transparent)
```

**Orange Gradient (CTAs):**
```css
linear-gradient(135deg, #FF4D00, #F59E0B)
```

**Card Gradient Overlay:**
```css
linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)
```

---

## 5. Component Library

### 5.1 Buttons

#### Primary Button
- **Background:** `#1E3A8A` (Navy)
- **Text:** White
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Font:** Inter 500, 14px
- **Hover:** `#2563EB` with subtle shadow
- **Active:** Scale 0.98

#### Secondary Button (Outline)
- **Background:** Transparent
- **Border:** 1px solid `rgba(255, 255, 255, 0.28)`
- **Text:** White
- **Hover:** Background `rgba(255, 255, 255, 0.08)`

#### Ghost Button
- **Background:** Transparent
- **Text:** White/72%
- **Hover:** Background `rgba(255, 255, 255, 0.05)`

#### Animated Arrow Button (CTA)
- **Background:** Transparent or gradient fill
- **Border:** 1.5px solid white/28%
- **Padding:** 16px 32px
- **Contains:** Text + Arrow Icon
- **Animation:** Circle fill from left on hover, arrow slides right

#### Destructive Button
- **Background:** `#DC2626`
- **Text:** White
- **Hover:** `#EF4444`

### 5.2 Form Elements

#### Input Field
- **Background:** `rgba(255, 255, 255, 0.05)`
- **Border:** 1px solid `rgba(255, 255, 255, 0.12)`
- **Border Radius:** 6px
- **Padding:** 12px 16px
- **Text:** White
- **Placeholder:** White/40%
- **Focus:** Border `#3B82F6`, ring offset

#### Textarea
- Same as Input
- **Min Height:** 120px
- **Resize:** Vertical only

#### Select Dropdown
- Same as Input styling
- **Dropdown Menu:** Glass background, 12px border radius
- **Options:** 40px height, hover background

#### Checkbox
- **Size:** 16x16px
- **Border:** 1px solid white/28%
- **Checked:** Background `#3B82F6`, white checkmark

#### Date Picker
- **Trigger:** Input field with calendar icon
- **Calendar:** Glass panel, grid of dates
- **Selected:** Blue background
- **Today:** Gold accent ring

### 5.3 Cards

#### Event Card (Grid View)
```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │                       │  │
│  │    Cover Image        │  │  192px height
│  │    + Gradient Overlay │  │
│  │  ┌──────┐             │  │
│  │  │Badge │             │  │  Category badge
│  │  └──────┘             │  │
│  └───────────────────────┘  │
│                             │
│  Event Title                │  18px, semi-bold
│  📅 Date  📍 Location       │  14px, muted
│  👥 Capacity Info           │  12px, muted
│                             │
│  ┌─────────┐ ┌────────┐    │
│  │  View   │ │ Delete │    │  Action buttons
│  └─────────┘ └────────┘    │
└─────────────────────────────┘

Width: 100% (responsive grid)
Background: #111827
Border: 1px solid rgba(255,255,255,0.08)
Border Radius: 12px
Hover: Border white/15%, translateY(-2px)
```

#### Event Card (List View)
```
┌─────────────────────────────────────────────────────┐
│ ┌────────┐                                          │
│ │ 80x80  │  Event Title                   ┌──────┐ │
│ │ Image  │  📅 Date  📍 Location          │ View │ │
│ └────────┘                                └──────┘ │
└─────────────────────────────────────────────────────┘
```

#### Ticket Card (QR Ticket)
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │         Event Cover Image         │  │  200px height
│  │         + Gradient Overlay        │  │
│  │                                   │  │
│  │  ┌────────┐                       │  │
│  │  │ LIVE   │                       │  │  Status badge
│  │  └────────┘                       │  │
│  │                                   │  │
│  │  EVENT TITLE                      │  │  24px, bold
│  │  📅 Date • 📍 Location            │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  Dotted separator
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         ┌───────────┐             │  │
│  │         │           │             │  │
│  │         │  QR CODE  │             │  │  180x180px
│  │         │           │             │  │
│  │         └───────────┘             │  │
│  │                                   │  │
│  │  Attendee: John Doe               │  │
│  │  Ticket #: TKT-XXXX               │  │
│  │                                   │  │
│  │  ✓ CONFIRMED                      │  │  Status badge
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       Cancel Ticket             │    │  Ghost button
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘

Width: 400px max
Background: #111827
Border: 1px solid rgba(255,255,255,0.08)
Border Radius: 16px
```

#### Stat Card (Dashboard)
```
┌──────────────────────────┐
│  ┌────┐                  │
│  │ 📊 │           +12%   │  Icon + trend
│  └────┘                  │
│                          │
│  2,847                   │  32px, bold
│  Total Registrations     │  14px, muted
│                          │
│  ▓▓▓▓▓▓▓▓░░░░ 75%       │  Progress bar
└──────────────────────────┘

Background: #111827
Border: 1px solid rgba(255,255,255,0.08)
Padding: 24px
Border Radius: 12px
```

### 5.4 Badges

| Type | Background | Text | Border |
|------|------------|------|--------|
| **Default** | `rgba(255,255,255,0.1)` | White | None |
| **Live** | `#22C55E` | White | None |
| **Upcoming** | `#3B82F6` | White | None |
| **Past** | `rgba(255,255,255,0.08)` | White/60% | None |
| **Free** | `#22C55E` | White | None |
| **Paid** | `#F59E0B` | Black | None |
| **Pending** | `#F59E0B` | Black | None |
| **Approved** | `#22C55E` | White | None |
| **Rejected** | `#DC2626` | White | None |

**Badge Specs:**
- Padding: 4px 12px
- Border Radius: 9999px (pill)
- Font: 12px, medium weight
- Uppercase for status badges

### 5.5 Modals / Dialogs

#### Registration Modal
```
┌─────────────────────────────────────────────────┐
│                                           ✕     │  Close button
│                                                 │
│  📋 Register for Event                          │  Heading
│  Fill in your details to secure your spot       │  Description
│                                                 │
│  ┌───────────────────────────────────────┐      │
│  │ Full Name                             │      │  Input
│  └───────────────────────────────────────┘      │
│                                                 │
│  ┌───────────────────────────────────────┐      │
│  │ Email                                 │      │  Input
│  └───────────────────────────────────────┘      │
│                                                 │
│  ┌───────────────────────────────────────┐      │
│  │ Phone Number                          │      │  Input
│  └───────────────────────────────────────┘      │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           Complete Registration         │    │  Primary button
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘

Width: 480px max
Background: #111827
Border: 1px solid rgba(255,255,255,0.1)
Border Radius: 16px
Padding: 32px
Overlay: rgba(0, 0, 0, 0.8)
```

#### Success State (in Modal)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              ┌──────────────┐                   │
│              │      ✓       │                   │  Animated checkmark
│              │   (circle)   │                   │  Green, pulsing
│              └──────────────┘                   │
│                                                 │
│          Registration Successful!               │  24px, bold
│     You're all set for the event               │  16px, muted
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           View My Ticket               │    │  Primary button
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 5.6 Tables (Admin)

```
┌──────────────────────────────────────────────────────────────────┐
│  Event Name        │ Date       │ Status  │ Registrations │ ⋮   │
├──────────────────────────────────────────────────────────────────┤
│  Tech Summit 2026  │ Mar 25     │ ● Live  │ 145/200       │ ⋮   │
├──────────────────────────────────────────────────────────────────┤
│  Cultural Fest     │ Apr 02     │ ○ Draft │ 0/500         │ ⋮   │
├──────────────────────────────────────────────────────────────────┤
│  Workshop: AI      │ Apr 10     │ ◐ Pend  │ 89/100        │ ⋮   │
└──────────────────────────────────────────────────────────────────┘

Header Background: rgba(255,255,255,0.05)
Row Hover: rgba(255,255,255,0.03)
Cell Padding: 16px
Border: 1px solid rgba(255,255,255,0.08)
```

### 5.7 Navigation Tabs

```
┌────────────────────────────────────────────────┐
│  ┌─────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Live   │  │ Upcoming │  │ Archive  │      │
│  │ (active)│  │          │  │          │      │
│  └─────────┘  └──────────┘  └──────────┘      │
└────────────────────────────────────────────────┘

Active Tab:
  - Background: white
  - Text: black
  - Border Radius: 9999px

Inactive Tab:
  - Background: transparent
  - Text: white/60%
  - Hover: white/80%

Container:
  - Background: rgba(255,255,255,0.05)
  - Border Radius: 9999px
  - Padding: 4px
```

### 5.8 Toast Notifications

```
┌────────────────────────────────────────────────┐
│  ✓  Registration successful!             ✕    │
└────────────────────────────────────────────────┘

Position: Bottom right
Background: #1F2937
Border: 1px solid rgba(255,255,255,0.1)
Border Radius: 8px
Padding: 16px
Icon Color: Success green / Error red / Warning gold
Animation: Slide in from right, fade out
```

---

## 6. Page Specifications

### 6.1 Homepage

#### Hero Section
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                     [Floating Navbar - see Section 7]                    │
│                                                                          │
│                                                                          │
│                    DISCOVER • CONNECT • EXPERIENCE                       │  Overline
│                                                                          │
│                                                                          │
│                         CREATE MOMENTS                                   │
│                         THAT MATTER                                      │  Display XL
│                                                                          │
│                                                                          │
│                   "Where Campus Life Comes Alive"                        │  Serif italic
│                                                                          │
│                                                                          │
│                    ┌──────────────────────────┐                          │
│                    │   Explore Events    →    │                          │  Animated CTA
│                    └──────────────────────────┘                          │
│                                                                          │
│                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │   50+ Events   │  │  10K+ Users    │  │  25+ Clubs     │             │  Stats strip
│  └────────────────┘  └────────────────┘  └────────────────┘             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Height: 100vh
Background: Black with radial gradient glow (gold) at bottom
Text Alignment: Center
Animation: Staggered fade-in-up on load
```

#### Features Section
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                              WHY UNISYNC?                                │
│                                                                          │
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐ │
│  │                    │  │                    │  │                    │ │
│  │   🎫 QR Tickets    │  │   📊 Analytics     │  │   🔔 Reminders     │ │
│  │                    │  │                    │  │                    │ │
│  │  Instant digital   │  │  Track event      │  │  Never miss an     │ │
│  │  tickets with QR   │  │  performance      │  │  event again       │ │
│  │                    │  │                    │  │                    │ │
│  └────────────────────┘  └────────────────────┘  └────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Grid: 3 columns (responsive to 1 on mobile)
Card Style: Glass with border
Animation: ScrollReveal staggered
```

### 6.2 Events Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Navbar]                                                                │
│                                                                          │
│                            CAMPUS EVENTS                                 │  Display L
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  🔍 Search events...                          ▼ Category  ▼ Date   │ │  Filters
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  [ Live ]  [ Upcoming ]  [ Archive ]                                │ │  Tabs
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │              │  │              │  │              │  │              │ │
│  │  Event Card  │  │  Event Card  │  │  Event Card  │  │  Event Card  │ │
│  │              │  │              │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │              │  │              │  │              │  │              │ │
│  │  Event Card  │  │  Event Card  │  │  Event Card  │  │  Event Card  │ │
│  │              │  │              │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                                          │
│  [Footer]                                                                │
└──────────────────────────────────────────────────────────────────────────┘

Grid: 4 columns → 3 → 2 → 1 (responsive)
Gap: 24px
Padding: 64px horizontal, 48px vertical
```

#### Empty State
```
┌─────────────────────────────────────────┐
│                                         │
│              📭                         │
│                                         │
│        No events found                  │
│   Try adjusting your filters           │
│                                         │
└─────────────────────────────────────────┘
```

#### Loading State
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │
│  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │
│  Skeleton    │  │  Skeleton    │  │  Skeleton    │
│  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │
└──────────────┘  └──────────────┘  └──────────────┘

Skeleton: Animated pulse gradient
Background: rgba(255,255,255,0.05)
```

### 6.3 Event Detail Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Navbar]                                                                │
│                                                                          │
│  ┌───────────────────────────────────┬──────────────────────────────────┐│
│  │                                   │                                  ││
│  │                                   │  ┌──────────────────────────┐    ││
│  │                                   │  │     TECH SUMMIT 2026     │    ││
│  │        Event Cover Image          │  │                          │    ││
│  │        (Full Height)              │  │  📅 March 25, 2026       │    ││
│  │                                   │  │  🕐 10:00 AM - 5:00 PM   │    ││
│  │                                   │  │  📍 Main Auditorium      │    ││
│  │                                   │  │  👥 145/200 spots        │    ││
│  │                                   │  │                          │    ││
│  │                                   │  │  ┌────────────────────┐  │    ││
│  │                                   │  │  │ Register Now    →  │  │    ││
│  │                                   │  │  └────────────────────┘  │    ││
│  │                                   │  │                          │    ││
│  │                                   │  └──────────────────────────┘    ││
│  │                                   │                                  ││
│  └───────────────────────────────────┴──────────────────────────────────┘│
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  About This Event                                                        │
│                                                                          │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do         │
│  eiusmod tempor incididunt ut labore et dolore magna aliqua...           │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  Organizer                                                               │
│                                                                          │
│  ┌──────┐  Tech Club DYPIU                                              │
│  │Avatar│  @techclub                                                    │
│  └──────┘                                                                │
│                                                                          │
│  [Footer]                                                                │
└──────────────────────────────────────────────────────────────────────────┘

Layout: 50/50 split on desktop, stacked on mobile
Image: Object-fit cover, rounded corners
Sticky CTA: Register button sticks on mobile scroll
```

### 6.4 My Tickets Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Navbar]                                                                │
│                                                                          │
│                              MY TICKETS                                  │
│                                                                          │
│  You have 3 tickets                                                      │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │                 │  │                 │  │                 │          │
│  │   Ticket Card   │  │   Ticket Card   │  │   Ticket Card   │          │
│  │   (with QR)     │  │   (with QR)     │  │   (with QR)     │          │
│  │                 │  │                 │  │                 │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
│                                                                          │
│  [Footer]                                                                │
└──────────────────────────────────────────────────────────────────────────┘

Grid: 3 columns → 2 → 1
Max Width per card: 400px
```

### 6.5 Admin Dashboard

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                                   │
│ │         │  OVERVIEW                                          Admin Name ▼   │
│ │ Sidebar │                                                                   │
│ │         │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────┐│
│ │ ──────  │  │  Total       │  │  Active      │  │  Pending     │  │ Total  ││
│ │ Overview│  │  Events      │  │  Events      │  │  Approvals   │  │ Users  ││
│ │ ──────  │  │              │  │              │  │              │  │        ││
│ │ □ Dash  │  │     47       │  │     12       │  │      5       │  │  2.4k  ││
│ │ ──────  │  └──────────────┘  └──────────────┘  └──────────────┘  └────────┘│
│ │ Manage  │                                                                   │
│ │ ──────  │  Recent Events                           ┌──────────────────────┐│
│ │ □ Events│                                          │  + Create Event      ││
│ │ □ Regs  │  ┌───────────────────────────────────┐   └──────────────────────┘│
│ │ □ Analyt│  │ Event Name    │ Date    │ Status │                            │
│ │ □ Report│  ├───────────────────────────────────┤                            │
│ │ ──────  │  │ Tech Summit   │ Mar 25  │ ● Live │                            │
│ │ Settings│  │ Cultural Fest │ Apr 02  │ ○ Draft│                            │
│ │ ──────  │  │ AI Workshop   │ Apr 10  │ ◐ Pend │                            │
│ │ □ Team  │  └───────────────────────────────────┘                            │
│ │ □ Site  │                                                                   │
│ │ □ Config│                                                                   │
│ │         │                                                                   │
│ │ ──────  │                                                                   │
│ │ [User]  │                                                                   │
│ └─────────┘                                                                   │
└───────────────────────────────────────────────────────────────────────────────┘

Sidebar Width: 224px expanded, 56px collapsed
Main Content Padding: 32px
Background: Black
Sidebar: #111111
```

### 6.6 Contact Us Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Navbar]                                                                │
│                                                                          │
│                             GET IN TOUCH                                 │
│                                                                          │
│  ┌────────────────────────────────┬─────────────────────────────────────┐│
│  │                                │                                     ││
│  │   Contact Information          │   ┌─────────────────────────────┐   ││
│  │                                │   │ Name                        │   ││
│  │   📧 events@dypiu.ac.in        │   └─────────────────────────────┘   ││
│  │   📞 +91 20 1234 5678          │   ┌─────────────────────────────┐   ││
│  │   📍 DYPIU Campus, Pune        │   │ Email                       │   ││
│  │                                │   └─────────────────────────────┘   ││
│  │   ──────────────────────       │   ┌─────────────────────────────┐   ││
│  │                                │   │ Subject                     │   ││
│  │   Social Links                 │   └─────────────────────────────┘   ││
│  │   [IG] [FB] [YT] [TW]          │   ┌─────────────────────────────┐   ││
│  │                                │   │                             │   ││
│  │                                │   │ Message                     │   ││
│  │                                │   │                             │   ││
│  │                                │   └─────────────────────────────┘   ││
│  │                                │   ┌─────────────────────────────┐   ││
│  │                                │   │      Send Message       →   │   ││
│  │                                │   └─────────────────────────────┘   ││
│  │                                │                                     ││
│  └────────────────────────────────┴─────────────────────────────────────┘│
│                                                                          │
│  [Footer]                                                                │
└──────────────────────────────────────────────────────────────────────────┘

Layout: 40/60 split on desktop
Form Card: Glass background
Submit Button: Gradient orange on hover
```

### 6.7 FAQ Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Navbar]                                                                │
│                                                                          │
│                         FREQUENTLY ASKED                                 │
│                            QUESTIONS                                     │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  How do I register for an event?                              [+]  │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  What is the refund policy?                                   [+]  │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  How can I become an event organizer?                         [-]  │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │                                                                     │ │
│  │  To become an event organizer, you need to submit a proposal       │ │
│  │  through the Pitch Event page. Our team will review...             │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [Footer]                                                                │
└──────────────────────────────────────────────────────────────────────────┘

Accordion Style:
- Collapsed: Border with hover effect
- Expanded: Content area with padding
- Animation: Smooth height transition
- Icon: Plus/Minus rotation
```

### 6.8 Team Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Navbar]                                                                │
│                                                                          │
│                             MEET THE TEAM                                │
│                    "The Minds Behind UniSync"                            │
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │            │  │            │  │            │  │            │         │
│  │   Avatar   │  │   Avatar   │  │   Avatar   │  │   Avatar   │         │
│  │            │  │            │  │            │  │            │         │
│  │  Name      │  │  Name      │  │  Name      │  │  Name      │         │
│  │  Role      │  │  Role      │  │  Role      │  │  Role      │         │
│  │  [Social]  │  │  [Social]  │  │  [Social]  │  │  [Social]  │         │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘         │
│                                                                          │
│  [Footer]                                                                │
└──────────────────────────────────────────────────────────────────────────┘

Card Style:
- Avatar: 120x120px, rounded full
- Name: 18px, semi-bold
- Role: 14px, muted
- Social icons: LinkedIn, GitHub, Twitter
- Hover: Lift effect with shadow
```

### 6.9 Pitch Event Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Navbar]                                                                │
│                                                                          │
│                          PITCH YOUR EVENT                                │
│              "Have an event idea? Let's make it happen"                  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │   Event Name                                                        │ │
│  │   ┌─────────────────────────────────────────────────────────┐       │ │
│  │   │                                                         │       │ │
│  │   └─────────────────────────────────────────────────────────┘       │ │
│  │                                                                     │ │
│  │   Event Description                                                 │ │
│  │   ┌─────────────────────────────────────────────────────────┐       │ │
│  │   │                                                         │       │ │
│  │   │                                                         │       │ │
│  │   └─────────────────────────────────────────────────────────┘       │ │
│  │                                                                     │ │
│  │   ┌────────────────────┐  ┌────────────────────┐                    │ │
│  │   │ Expected Attendees │  │ Preferred Date     │                    │ │
│  │   └────────────────────┘  └────────────────────┘                    │ │
│  │                                                                     │ │
│  │   Category                                                          │ │
│  │   ┌─────────────────────────────────────────────────────────┐       │ │
│  │   │ Select category...                                   ▼  │       │ │
│  │   └─────────────────────────────────────────────────────────┘       │ │
│  │                                                                     │ │
│  │   Your Contact Information                                          │ │
│  │   ┌────────────────────┐  ┌────────────────────┐                    │ │
│  │   │ Email              │  │ Phone              │                    │ │
│  │   └────────────────────┘  └────────────────────┘                    │ │
│  │                                                                     │ │
│  │   ┌─────────────────────────────────────────────────────────┐       │ │
│  │   │              Submit Proposal                        →   │       │ │
│  │   └─────────────────────────────────────────────────────────┘       │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [Footer]                                                                │
└──────────────────────────────────────────────────────────────────────────┘

Form Card: Max width 640px, centered
Background: Glass
```

### 6.10 404 Not Found Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                    ┌────────────────────────────┐                        │
│                    │                            │                        │
│                    │    3D Spline Scene         │                        │
│                    │    (Interactive/Animated)  │                        │
│                    │                            │                        │
│                    └────────────────────────────┘                        │
│                                                                          │
│                               404                                        │  Glowing text
│                                                                          │
│                     Page not found                                       │
│                                                                          │
│                    ┌──────────────────────┐                              │
│                    │   Go Back Home       │                              │  Color cycling
│                    └──────────────────────┘                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Full screen, no navbar/footer
3D Scene: Spline embed
Animation: Text glow pulse, button color shift
```

### 6.11 Authentication Pages

```
Sign In / Sign Up
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                    ┌────────────────────────────┐                        │
│                    │                            │                        │
│                    │    Clerk Auth Component    │                        │
│                    │    (Pre-styled)            │                        │
│                    │                            │                        │
│                    │    - Social logins         │                        │
│                    │    - Email/Password        │                        │
│                    │    - Magic link            │                        │
│                    │                            │                        │
│                    └────────────────────────────┘                        │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Clerk handles: Sign In, Sign Up, Password Reset, Email Verification
Style: Dark theme customization
Position: Centered, top padding 64px
```

---

## 7. Navigation

### 7.1 Public Header (Floating Navbar)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│          ┌─────────────────────────────────────────────────────────┐          │
│          │ ⬡ Uni Sync  │ Home │ Events │ Pitch │ Contact │ Team │ FAQ │ [👤] │
│          └─────────────────────────────────────────────────────────┘          │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘

Position: Fixed, centered horizontally
Top: 24px
Background: rgba(0, 0, 0, 0.74)
Backdrop Filter: blur(24px)
Border: 1px solid rgba(255, 255, 255, 0.28)
Border Radius: 9999px (pill)
Padding: 8px 16px
Height: ~56px

Active Link:
- Background: white
- Text: black
- Border Radius: 9999px

Logo:
- SVG icon (orange accent)
- "Uni Sync" text, semi-bold

Animation: dock-pop-in on page load
Scroll Behavior: Adds shadow and opacity change on scroll
```

#### Mobile Navigation
```
┌─────────────────────────────────────┐
│  ⬡ Uni Sync                    ☰   │  Header with hamburger
└─────────────────────────────────────┘
           │
           ▼ (open)
┌─────────────────────────────────────┐
│  ⬡ Uni Sync                    ✕   │
├─────────────────────────────────────┤
│  Home                               │
│  Events                             │
│  Pitch Event                        │
│  Contact Us                         │
│  Team                               │
│  FAQ                                │
├─────────────────────────────────────┤
│  Sign In                            │
└─────────────────────────────────────┘

Dropdown Background: Same glass effect
Animation: Slide down with fade
```

### 7.2 Admin Sidebar

```
Expanded (224px)                    Collapsed (56px)
┌────────────────────────┐          ┌────────┐
│  ⬡ Uni Sync            │          │   ⬡    │
│                        │          │        │
│  OVERVIEW              │          │        │
│  ─────────────────     │          │  ───   │
│  □ Dashboard           │          │   □    │
│                        │          │        │
│  MANAGEMENT            │          │        │
│  ─────────────────     │          │  ───   │
│  □ Events              │          │   □    │
│  □ Registrations       │          │   □    │
│  □ Analytics           │          │   □    │
│  □ Reports             │          │   □    │
│                        │          │        │
│  SETTINGS              │          │        │
│  ─────────────────     │          │  ───   │
│  □ Team                │          │   □    │
│  □ Site Content        │          │   □    │
│  □ Settings            │          │   □    │
│                        │          │        │
│  ─────────────────     │          │  ───   │
│  ┌────┐                │          │ ┌────┐ │
│  │ AV │ Admin Name     │          │ │ AV │ │
│  └────┘ admin@uni.edu  │          │ └────┘ │
└────────────────────────┘          └────────┘

Background: #111111
Border Right: 1px solid rgba(255, 255, 255, 0.08)
Active Item: bg-white/10, text-white
Hover: bg-white/5
Section Labels: 11px, uppercase, tracking wide, white/42%
Toggle: Hamburger icon at top
Transition: Width 200ms ease
```

### 7.3 Footer

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                     [Background: Radial gradient glow]                       │
│                                                                              │
│  © 2026 UniSync. All rights reserved.           ┌──────────────────────────┐ │
│                                                 │  Join Newsletter      →  │ │
│  D. Y. Patil International University           └──────────────────────────┘ │
│  Akurdi, Pune, Maharashtra 411044               ┌──────────────────────────┐ │
│                                                 │  WhatsApp Community   →  │ │
│  Privacy Policy • Terms • Cookies               └──────────────────────────┘ │
│                                                 ┌──────────────────────────┐ │
│  [IG] [FB] [YT]                                 │  Telegram Channel     →  │ │
│                                                 └──────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Height: min 30vh
Background: Black with orange radial gradient at top
CTA Buttons: Outline style, hover fill

Floating WhatsApp Button (separate):
- Position: Fixed, bottom-right
- Size: 56x56px
- Background: #25D366
- Icon: WhatsApp logo
- Shadow: 0 4px 12px rgba(0,0,0,0.3)
```

---

## 8. Animation & Interactions

### 8.1 Page Transitions

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page Load | Fade in from opacity 0 | 300ms | ease-out |
| Route Change | Fade out/in | 200ms | ease |

### 8.2 Scroll Animations (ScrollReveal)

| Element | Animation | Delay Pattern |
|---------|-----------|---------------|
| Hero Elements | Fade in + slide up 40px | Staggered 100ms |
| Section Titles | Fade in + slide up 30px | On enter |
| Cards | Fade in + slide up 20px | Staggered 100ms |
| Features | Fade in + blur clear | Staggered 150ms |

**ScrollReveal Settings:**
- Trigger: 20% in viewport
- Once: true (animate only first time)
- Reset: false

### 8.3 Micro-interactions

| Element | Interaction | Animation |
|---------|-------------|-----------|
| **Buttons** | Hover | Scale 1.02, shadow increase |
| **Buttons** | Active | Scale 0.98 |
| **Cards** | Hover | translateY(-4px), border lighten |
| **Links** | Hover | Color shift, underline expand |
| **Inputs** | Focus | Border color change, ring |
| **Tabs** | Switch | Background slide with spring |
| **Accordion** | Toggle | Height animate, icon rotate |
| **Modal** | Open | Fade in + scale from 0.95 |
| **Modal** | Close | Fade out + scale to 0.95 |
| **Toast** | Enter | Slide from right |
| **Toast** | Exit | Fade out right |
| **Sidebar** | Toggle | Width transition 200ms |
| **Dropdown** | Open | Fade + scale from 0.95 |

### 8.4 Animated Arrow Button

```
Initial State:
┌─────────────────────────────────┐
│  Explore Events            →   │
└─────────────────────────────────┘

Hover State:
┌─────────────────────────────────┐
│ ████████████████████████        │  Circle fill from left
│  Explore Events              → │  Arrow slides right
│ ████████████████████████        │
└─────────────────────────────────┘

Fill Animation: Circle expand from left
Duration: 400ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Arrow: translateX(4px) on hover
```

### 8.5 Loading States

**Page Loader:**
```
┌───────────────────────────────┐
│                               │
│        ◉ ◉ ◉                  │  Three circles
│        Pulse animation        │  Staggered 0.2s
│                               │
│    [Orange glow behind]       │
│                               │
└───────────────────────────────┘
```

**Skeleton Loading:**
- Gradient shimmer animation
- Left to right sweep
- Duration: 1.5s, infinite
- Background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)

### 8.6 Custom Keyframes Reference

```css
/* Float - for decorative elements */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Fade In Up - entrance animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse Glow - accent elements */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.6); }
}

/* Gradient Shift - background gradients */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Navbar entrance */
@keyframes dock-pop-in {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 404 glow text */
@keyframes not-found-glow {
  0%, 100% { text-shadow: 0 0 20px rgba(255, 77, 0, 0.8); }
  50% { text-shadow: 0 0 40px rgba(255, 77, 0, 1), 0 0 60px rgba(255, 77, 0, 0.6); }
}
```

---

## 9. Responsive Design

### 9.1 Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| **sm** | 640px | Mobile landscape |
| **md** | 768px | Tablets |
| **lg** | 1024px | Small laptops |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large screens |

### 9.2 Layout Adaptations

| Element | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|---------|-----------------|---------------------|-------------------|
| **Navbar** | Hamburger menu | Hamburger menu | Full horizontal |
| **Hero Text** | 48-68px | 68-80px | 80-118px |
| **Event Grid** | 1 column | 2 columns | 3-4 columns |
| **Event Detail** | Stacked | Stacked | 50/50 split |
| **Admin Sidebar** | Hidden (drawer) | Collapsed | Expanded |
| **Footer** | Stacked | Stacked | 2 columns |
| **Cards** | Full width | 2 per row | 3-4 per row |
| **Modals** | Full width - 16px | Max 480px centered | Max 480px centered |
| **Typography** | Fluid scaling down | Mid scale | Full scale |

### 9.3 Touch Targets

- **Minimum size:** 44x44px for interactive elements
- **Spacing:** 8px minimum between touch targets
- **Mobile buttons:** Full width when primary action

### 9.4 Mobile-Specific UI

- **Sticky CTA:** Register button sticks to bottom on event detail
- **Bottom sheet:** Used for filters on mobile
- **Swipe gestures:** Carousel navigation
- **Pull to refresh:** Events list (if applicable)

---

## 10. Design Assets

### 10.1 Required Icons (Lucide React)

| Category | Icons |
|----------|-------|
| **Navigation** | Home, Calendar, Megaphone, Mail, Users, HelpCircle, Menu, X, ChevronDown |
| **Events** | CalendarDays, Clock, MapPin, Users, Ticket, QrCode |
| **Actions** | Plus, Edit, Trash, Eye, Download, Share, Copy |
| **Status** | Check, X, AlertCircle, Info, Loader |
| **Social** | Instagram, Facebook, Youtube, Linkedin, Github, Twitter |
| **Communication** | Mail, Phone, MessageCircle, Send |
| **Admin** | LayoutDashboard, Settings, BarChart, FileText, Shield |

### 10.2 Imagery Guidelines

| Type | Specification |
|------|---------------|
| **Event Covers** | 16:9 aspect ratio, min 1200x675px |
| **Thumbnails** | 1:1 aspect ratio, 400x400px |
| **Avatars** | 1:1 aspect ratio, 200x200px |
| **Hero Images** | Full width, 2400px wide |
| **Style** | Vibrant, high contrast, campus/event related |
| **Fallbacks** | Solid color with gradient overlay |

### 10.3 Logo Specifications

**Primary Logo:**
- Icon: Hexagonal shape with event-related symbol
- Colors: Orange (#FF4D00) or White
- Minimum size: 32x32px
- Clear space: Equal to icon width on all sides

**Wordmark:**
- "Uni Sync" or "UniSync"
- Font: Inter Semi-bold
- Paired with icon on left

### 10.4 3D Assets

**404 Page:**
- Platform: Spline
- Scene: Interactive 3D abstract/error themed
- Fallback: Static gradient background

### 10.5 QR Code Styling

- **Size:** 180x180px
- **Colors:** Black on white for maximum scan reliability
- **Border:** Dotted border container (8px padding)
- **Error Correction:** High (allows logo overlay if needed)

---

## Appendix A: Component Checklist for Figma

### Core Components to Design

- [ ] Button (6 variants: primary, secondary, outline, ghost, destructive, link)
- [ ] Animated Arrow Button
- [ ] Input Field (default, focus, error, disabled)
- [ ] Textarea
- [ ] Select Dropdown
- [ ] Checkbox
- [ ] Radio Button
- [ ] Date Picker
- [ ] Time Picker
- [ ] Badge (8 variants)
- [ ] Avatar (3 sizes)
- [ ] Card (event grid, event list, stat, ticket)
- [ ] Modal/Dialog
- [ ] Toast Notification
- [ ] Tabs
- [ ] Accordion
- [ ] Table
- [ ] Navigation (public header, admin sidebar, footer)
- [ ] Loader/Spinner
- [ ] Skeleton
- [ ] Empty State
- [ ] Error State

### Page Templates to Design

- [ ] Homepage
- [ ] Events Listing
- [ ] Event Detail
- [ ] My Tickets
- [ ] My Events
- [ ] Contact Us
- [ ] FAQ
- [ ] Team
- [ ] Pitch Event
- [ ] Sign In / Sign Up
- [ ] Admin Dashboard
- [ ] Admin Events List
- [ ] Admin Event Detail
- [ ] Admin Reports
- [ ] Admin Settings
- [ ] 404 Page

---

## Appendix B: Design Tokens Summary

```json
{
  "colors": {
    "primary": "#1E3A8A",
    "accent": "#F59E0B",
    "background": "#000000",
    "card": "#111827",
    "text": "#FFFFFF",
    "textMuted": "rgba(255, 255, 255, 0.72)",
    "border": "rgba(255, 255, 255, 0.08)",
    "success": "#22C55E",
    "destructive": "#DC2626"
  },
  "fonts": {
    "sans": "Inter",
    "display": "Anton",
    "serif": "Playfair Display"
  },
  "radii": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "full": "9999px"
  },
  "spacing": {
    "unit": "4px",
    "page": "64px",
    "section": "48px",
    "component": "24px"
  }
}
```

---

**End of Document**

*This PRD is intended for design and frontend reference only. For backend, database, and API specifications, refer to the technical PRD.*
