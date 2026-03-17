# Product Requirements Document (PRD)

## Project: Spott Event Management Platform - Rebuild

**Version:** 2.0  
**Last Updated:** [Current Date]  
**Document Owner:** Product Team  
**Status:** Draft for Review

---

## 1. Executive Summary

### 1.1 Purpose
This document outlines the requirements for rebuilding the Spott event management platform (https://joinspott.vercel.app/) with enhanced SuperAdmin capabilities, streamlined workflows, and improved analytics.

### 1.2 Objectives
- Simplify and optimize the SuperAdmin panel with focused functionality
- Implement comprehensive analytics and reporting capabilities
- Enhance event management and approval workflows
- Integrate asset management and announcement systems
- Improve overall system performance and user experience

### 1.3 Scope
This rebuild focuses on the SuperAdmin panel with the following key areas:
- Dashboard redesign
- Comprehensive reporting system
- Enhanced event management
- Advanced analytics
- Registration management
- Team management
- Asset management
- Announcement system
- Settings and configuration

---

## 2. Stakeholders

| Role | Responsibility | Name/Team |
|------|---------------|-----------|
| Product Owner | Final approval, vision alignment | [TBD] |
| Project Manager | Timeline, resource allocation | [TBD] |
| Development Team | Implementation | [TBD] |
| Design Team | UI/UX design | [TBD] |
| QA Team | Testing and quality assurance | [TBD] |
| SuperAdmin Users | End users, feedback | [TBD] |

---

## 3. User Personas

### 3.1 SuperAdmin
- **Role:** Platform administrator with full system access
- **Goals:** 
  - Monitor platform health and activity
  - Approve/manage events efficiently
  - Generate comprehensive reports
  - Analyze event performance
  - Manage team and assets
- **Pain Points:**
  - Information overload on current dashboard
  - Lack of actionable analytics
  - Manual approval processes

---

## 4. System Architecture Overview

### 4.1 Technology Stack Recommendation
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes / Node.js + Express
- **Database:** PostgreSQL / MongoDB
- **File Storage:** AWS S3 / Cloudinary
- **Authentication:** NextAuth.js / Auth0
- **Email Service:** SendGrid / AWS SES (for announcements)
- **Analytics:** Custom implementation + Chart.js/Recharts
- **Hosting:** Vercel / AWS

### 4.2 Key Integrations
- Email service for announcements (mail merge capability)
- File upload and management for assets
- Real-time monitoring for server load
- Payment gateway integration for revenue tracking

---

## 5. Functional Requirements

## 5.1 Module 1: Dashboard

### 5.1.1 Overview
A focused, actionable dashboard displaying critical real-time metrics.

### 5.1.2 Features

#### 5.1.2.1 Live/Active Events
**Priority:** P0 (Critical)

**Description:** Display all currently ongoing or upcoming events.

**Acceptance Criteria:**
- Show events that are currently live (ongoing)
- Show events scheduled within next 7 days
- Display key event information:
  - Event name
  - Date & time
  - Status (Live/Upcoming)
  - Registered participants count
  - Quick action buttons (View Details, Edit)
- Real-time updates (WebSocket/polling)
- Click to navigate to event details

**UI Components:**
- Card-based layout
- Status indicators (color-coded)
- Countdown timer for upcoming events
- "Live" badge with pulse animation

---

#### 5.1.2.2 Pending Approval Events
**Priority:** P0 (Critical)

**Description:** Display events awaiting SuperAdmin approval.

**Acceptance Criteria:**
- Show count of pending approval events
- List view with event details:
  - Event name
  - Submitted by (team member)
  - Submission date
  - Quick preview
- Action buttons: Approve/Reject
- Notification badge for new submissions
- Filter by submission date
- Sort by priority/date

**UI Components:**
- Notification counter
- Action buttons (Approve/Reject with confirmation)
- Quick preview modal
- Bulk action capability

---

#### 5.1.2.3 Aggregated Revenue
**Priority:** P0 (Critical)

**Description:** Display total revenue metrics across all events.

**Acceptance Criteria:**
- Total revenue (all time)
- Revenue this month
- Revenue this week
- Revenue today
- Comparison with previous period (% change)
- Visual graph showing revenue trend (last 30 days)
- Breakdown by event (top 5 revenue generators)
- Payment status breakdown (Completed, Pending, Failed)

**UI Components:**
- Large metric cards
- Line/area chart for trends
- Comparison indicators (up/down arrows)
- Currency formatting
- Hover tooltips for detailed breakdowns

---

#### 5.1.2.4 Server Load
**Priority:** P1 (High)

**Description:** Monitor system health and performance metrics.

**Acceptance Criteria:**
- CPU usage percentage
- Memory usage
- Active users/concurrent sessions
- API response time (average)
- Database connection pool status
- Error rate (last hour)
- Visual indicators for health status (Green/Yellow/Red)
- Alert threshold notifications

**UI Components:**
- Gauge charts for CPU/Memory
- Status indicators with color coding
- Real-time updating metrics
- Alert banners for critical issues
- Historical graph (last 24 hours)

---

### 5.1.3 Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: Spott SuperAdmin | [User Menu]            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ Live Events  │  │   Pending    │  │ Revenue  │ │
│  │      5       │  │  Approvals   │  │  ₹45.2L  │ │
│  │              │  │      12      │  │  +12.5%  │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │         Revenue Trend (Last 30 Days)        │  │
│  │  [Line Chart]                               │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────┐  ┌──────────────────┐   │
│  │   Live/Active Events │  │  Pending Approval│   │
│  │  [Event Card 1]      │  │  [Event Card 1]  │   │
│  │  [Event Card 2]      │  │  [Event Card 2]  │   │
│  └──────────────────────┘  └──────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │           Server Health Monitor             │  │
│  │  CPU: 45%  Memory: 62%  Active Users: 234  │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 5.2 Module 2: Reports

### 5.2.1 Overview
Comprehensive reporting system with customizable export formats.

### 5.2.2 Features

#### 5.2.2.1 Comprehensive Report Generator
**Priority:** P0 (Critical)

**Description:** Generate detailed reports combining all event data, analytics, and financial information.

**Acceptance Criteria:**
- Single unified report encompassing:
  - Event summary (all events or selected)
  - Registration statistics
  - Revenue breakdown
  - Attendance data
  - Department-wise analysis
  - Ticket sales analysis
  - Time-based trends
- Date range selector
- Event filter (all/specific events)
- Report preview before export
- Multiple export formats:
  - PDF (formatted, print-ready)
  - Excel (.xlsx with multiple sheets)
  - CSV (comma-separated)
  - JSON (for API consumption)
- Custom branding (logo, header, footer)
- Scheduled reports (daily/weekly/monthly via email)

**Report Sections:**

1. **Executive Summary**
   - Total events conducted
   - Total registrations
   - Total revenue
   - Average attendance rate
   - Key highlights

2. **Event-wise Breakdown**
   - Event name and dates
   - Registrations vs. attendance
   - Revenue generated
   - Ticket type distribution
   - Department participation

3. **Financial Analysis**
   - Revenue by event
   - Revenue by ticket type
   - Payment method breakdown
   - Refunds and cancellations
   - Outstanding payments

4. **Participant Analytics**
   - Registration trends
   - Department-wise participation
   - Geographic distribution
   - Demographics (if applicable)

5. **Performance Metrics**
   - Ticket selling rate
   - Peak registration periods
   - Conversion rates
   - Attendance rates

**UI Components:**
- Report builder interface with checkboxes for sections
- Date range picker
- Multi-select event dropdown
- Format selector (radio buttons)
- Preview pane
- Download/Email buttons
- Save report template functionality
- Scheduled report configuration

---

#### 5.2.2.2 Report Format Customization
**Priority:** P1 (High)

**Description:** Allow customization of report appearance and content.

**Acceptance Criteria:**
- Custom logo upload for reports
- Header/footer customization
- Color scheme selection
- Font selection
- Section reordering (drag and drop)
- Field selection (show/hide specific data points)
- Template saving (reusable configurations)
- Default template setting

**UI Components:**
- Visual template editor
- Drag-and-drop interface
- Live preview
- Template library
- Save/load template options

---

### 5.2.3 Reports Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Reports > Comprehensive Report Generator          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Report Configuration                              │
│  ┌─────────────────────────────────────────────┐  │
│  │ Date Range: [From] ──── [To]                │  │
│  │ Events: [Dropdown: All Events ▼]            │  │
│  │                                              │  │
│  │ Include Sections:                            │  │
│  │ ☑ Executive Summary                          │  │
│  │ ☑ Event-wise Breakdown                       │  │
│  │ ☑ Financial Analysis                         │  │
│  │ ☑ Participant Analytics                      │  │
│  │ ☑ Performance Metrics                        │  │
│  │                                              │  │
│  │ Export Format:                               │  │
│  │ ◉ PDF  ○ Excel  ○ CSV  ○ JSON               │  │
│  │                                              │  │
│  │ [Preview Report]  [Download]  [Email]       │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Saved Templates                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ [Monthly Revenue Report] [Use] [Edit]       │  │
│  │ [Quarterly Event Summary] [Use] [Edit]      │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Scheduled Reports                                 │
│  ┌─────────────────────────────────────────────┐  │
│  │ Weekly Summary - Every Monday 9 AM          │  │
│  │ Monthly Report - 1st of month               │  │
│  │ [+ Add Scheduled Report]                    │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 5.3 Module 3: Events

### 5.3.1 Overview
Event management with SuperAdmin-exclusive editing capabilities for critical event data.

### 5.3.2 Features

#### 5.3.2.1 Event Listing
**Priority:** P0 (Critical)

**Description:** Display all events with filtering and search capabilities.

**Acceptance Criteria:**
- List all events (past, present, future)
- Display key information:
  - Event name
  - Event dates (start and end)
  - Status (Draft, Pending Approval, Approved, Live, Completed, Cancelled)
  - Created by
  - Registration count
  - Revenue
- Search by event name
- Filter by:
  - Status
  - Date range
  - Created by
  - Event type/category
- Sort by:
  - Date (ascending/descending)
  - Name
  - Registration count
  - Revenue
- Pagination (25/50/100 per page)
- Bulk actions (Approve, Reject, Delete)

**UI Components:**
- Search bar
- Filter dropdowns
- Data table with sortable columns
- Status badges
- Action menu (three dots)
- Bulk selection checkboxes

---

#### 5.3.2.2 Event Date Editing (SuperAdmin Only)
**Priority:** P0 (Critical)

**Description:** Only SuperAdmin can modify event dates and critical information.

**Acceptance Criteria:**
- Edit functionality restricted to SuperAdmin role
- Editable fields:
  - Event start date
  - Event end date
  - Registration start date
  - Registration end date
  - Event status (override)
- Audit log for all date changes:
  - Who made the change
  - When it was changed
  - Old value vs. new value
- Confirmation modal before saving changes
- Notification to event creator when dates are modified
- Validation:
  - End date must be after start date
  - Registration deadline before event start
  - Cannot set dates in the past (warning only)

**UI Components:**
- "Edit Event" button (visible only to SuperAdmin)
- Date picker components
- Change confirmation modal
- Audit log viewer
- Success/error notifications

---

#### 5.3.2.3 Event Details View
**Priority:** P1 (High)

**Description:** Comprehensive view of all event information.

**Acceptance Criteria:**
- Display all event information:
  - Basic info (name, description, dates)
  - Organizer details
  - Venue information
  - Ticket types and pricing
  - Registration statistics
  - Revenue data
  - Attendee list
  - Event timeline/schedule
- Quick actions:
  - Edit dates (SuperAdmin)
  - View registrations
  - View analytics
  - Download attendee list
  - Send announcement
- Activity feed (recent actions on this event)

**UI Components:**
- Tabbed interface
- Information cards
- Quick action buttons
- Activity timeline
- Statistics widgets

---

#### 5.3.2.4 Event Approval Workflow
**Priority:** P0 (Critical)

**Description:** Approve or reject events submitted by team members.

**Acceptance Criteria:**
- Review pending events
- View all event details before approval
- Approval actions:
  - Approve (with optional modifications)
  - Reject (with mandatory reason)
  - Request changes (send back to creator)
- Email notification to creator on action
- Comment/feedback system
- Approval history tracking

**UI Components:**
- Approval queue interface
- Event preview modal
- Action buttons (Approve/Reject/Request Changes)
- Comment/feedback textarea
- Notification system

---

### 5.3.3 Events Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Events Management                                  │
├─────────────────────────────────────────────────────┤
│  [Search Events...]          [+ Create Event]       │
│  Filters: [Status ▼] [Date Range] [Created By ▼]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │☐│Name        │Dates     │Status  │Reg│Rev │⋮│ │
│  ├─────────────────────────────────────────────┤  │
│  │☐│Tech Summit │12-15 Dec │Live    │234│₹45k│⋮│ │
│  │☐│Workshop 1  │20 Dec    │Pending │ 0 │ -  │⋮│ │
│  │☐│Hackathon   │05-06 Jan │Approved│156│₹32k│⋮│ │
│  └─────────────────────────────────────────────┘  │
│  [Bulk Actions ▼]              Showing 1-25 of 48  │
│                                 [< 1 2 3 ... >]    │
└─────────────────────────────────────────────────────┘

Event Detail View (Modal/Page):
┌─────────────────────────────────────────────────────┐
│  ← Back to Events          Tech Summit 2024         │
├─────────────────────────────────────────────────────┤
│  [Details] [Registrations] [Analytics] [Timeline]  │
├─────────────────────────────────────────────────────┤
│  Event Information                                  │
│  Name: Tech Summit 2024                            │
│  Dates: 12-15 December 2024     [Edit - SA Only]  │
│  Reg. Deadline: 10 Dec 2024     [Edit - SA Only]  │
│  Status: Live                                      │
│  Created by: John Doe                              │
│                                                     │
│  Statistics                                        │
│  Registrations: 234 | Attended: 189 | Revenue: ₹45k│
│                                                     │
│  Quick Actions                                     │
│  [View Analytics] [Download Attendees] [Announce] │
│                                                     │
│  Recent Activity                                   │
│  • 2 hours ago: 5 new registrations               │
│  • 1 day ago: Event approved by SuperAdmin        │
│  • 2 days ago: Event submitted for approval       │
└─────────────────────────────────────────────────────┘
```

---

## 5.4 Module 4: Analytics

### 5.4.1 Overview
Comprehensive analytics dashboard providing aggregated and event-specific insights.

### 5.4.2 Features

#### 5.4.2.1 Aggregated Analytics
**Priority:** P0 (Critical)

**Description:** Platform-wide analytics across all events.

**Acceptance Criteria:**
- Total registrations (all time)
- Total attendance (all time)
- Overall attendance rate (%)
- Total revenue generated
- Average revenue per event
- Total events conducted
- Active events count
- Upcoming events count
- Month-over-month growth metrics
- Year-over-year comparison
- Visual representations:
  - Line chart: Registrations over time
  - Pie chart: Revenue by event category
  - Bar chart: Monthly event count
  - Area chart: Revenue trends

**UI Components:**
- Key metric cards
- Interactive charts
- Date range selector
- Comparison period selector
- Export analytics button

---

#### 5.4.2.2 Event-wise Analytics
**Priority:** P0 (Critical)

**Description:** Detailed analytics for individual events.

**Acceptance Criteria:**
- Event selector dropdown
- Analytics for selected event:

**A. Participants: Registered vs Attended**
- Total registered count
- Total attended count
- Attendance rate (%)
- No-show count and rate
- Visual comparison (bar chart)
- Trend over time (if multiple days)
- Download attendee list (CSV/Excel)
- Filters:
  - By registration date
  - By ticket type
  - By department

**B. Revenue Generated**
- Total revenue
- Revenue by ticket type
- Revenue by payment method
- Refunds processed
- Pending payments
- Net revenue
- Revenue timeline (daily breakdown)
- Comparison with target/budget (if set)
- Visual charts:
  - Pie chart: Revenue by ticket type
  - Line chart: Daily revenue

**C. Ticket Types & Sold**
- List of all ticket types
- For each ticket type:
  - Total available
  - Sold count
  - Remaining
  - Percentage sold
  - Revenue generated
- Visual representation:
  - Horizontal bar chart showing sold vs. available
  - Table with detailed breakdown
- Best-selling ticket type
- Least-selling ticket type

**D. Department Analysis**
- Participation by department/college/organization
- For each department:
  - Registration count
  - Attendance count
  - Attendance rate
  - Revenue contribution
- Visual charts:
  - Bar chart: Registrations by department
  - Pie chart: Department distribution
  - Table with sortable columns
- Top 5 departments by participation
- Export department-wise report

**E. Tickets Selling Graph**
- Timeline graph showing tickets sold over time
- X-axis: Date/time
- Y-axis: Cumulative tickets sold
- Filters:
  - By ticket type
  - By date range
- Markers for:
  - Registration opening
  - Early bird deadline
  - Peak selling periods
- Visual insights:
  - Selling velocity
  - Predicted sellout date (if trending)

**F. Tickets Selling Rate**
- Average tickets sold per day
- Average tickets sold per hour (during peak)
- Peak selling periods:
  - Best day
  - Best hour of day
  - Best day of week
- Slowest periods
- Real-time selling rate (for ongoing sales)
- Comparison with previous events
- Visual representation:
  - Heatmap: Day/hour selling pattern
  - Bar chart: Daily selling rate

**Acceptance Criteria (Continued):**
- All charts interactive (hover for details)
- Drill-down capability
- Export individual analytics sections
- Share analytics (generate shareable link)
- Print-friendly view

---

### 5.4.3 Analytics Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Analytics                                          │
├─────────────────────────────────────────────────────┤
│  [Aggregated] [Event-wise]                         │
├─────────────────────────────────────────────────────┤
│  AGGREGATED ANALYTICS                              │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │Total Reg │ │Attendance│ │ Revenue  │ │ Events ││
│  │  12,456  │ │  10,234  │ │  ₹12.5L  │ │   45   ││
│  │  +15% ↑  │ │   82.1%  │ │  +22% ↑  │ │   +5   ││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │     Registrations Trend (Last 6 Months)     │  │
│  │  [Line Chart]                               │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────┐ ┌──────────────────────┐│
│  │Revenue by Category  │ │  Monthly Events      ││
│  │  [Pie Chart]        │ │  [Bar Chart]         ││
│  └──────────────────────┘ └──────────────────────┘│
└─────────────────────────────────────────────────────┘

EVENT-WISE ANALYTICS:
┌─────────────────────────────────────────────────────┐
│  Select Event: [Tech Summit 2024 ▼]    [Export]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Participants Overview                             │
│  ┌─────────────────────────────────────────────┐  │
│  │ Registered: 234  │  Attended: 189  │ Rate: 81%││
│  │ [Bar Chart: Registered vs Attended]         │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Revenue Breakdown                                 │
│  ┌─────────────────────────────────────────────┐  │
│  │ Total: ₹45,000 | By Type: [Pie Chart]      │  │
│  │ Daily Revenue: [Line Chart]                 │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Ticket Analysis                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ Type      │ Sold/Total │   %   │  Revenue  │  │
│  │ Early Bird│  50/50     │ 100%  │  ₹10,000  │  │
│  │ Regular   │ 120/150    │  80%  │  ₹24,000  │  │
│  │ VIP       │  64/100    │  64%  │  ₹19,200  │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Department Analysis                               │
│  ┌─────────────────────────────────────────────┐  │
│  │ [Bar Chart: Participation by Department]    │  │
│  │ Top: Computer Science (45), MBA (38)...     │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Ticket Selling Trends                             │
│  ┌─────────────────────────────────────────────┐  │
│  │ [Line Chart: Cumulative Tickets Over Time]  │  │
│  │ Selling Rate: 12 tickets/day average        │  │
│  │ Peak: Dec 5 (34 tickets)                    │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Selling Rate Heatmap                              │
│  ┌─────────────────────────────────────────────┐  │
│  │      Mon Tue Wed Thu Fri Sat Sun           │  │
│  │ 9AM  [Heatmap showing hourly patterns]      │  │
│  │ 12PM                                        │  │
│  │ 3PM  Peak: Weekdays 2-4 PM                  │  │
│  │ 6PM                                         │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 5.5 Module 5: Registrations

### 5.5.1 Overview
Centralized registration management with approval workflows.

### 5.5.2 Features

#### 5.5.2.1 Pending Approvals
**Priority:** P0 (Critical)

**Description:** Manage registrations requiring manual approval.

**Acceptance Criteria:**
- List all pending approval registrations
- Display information:
  - Participant name
  - Email
  - Phone
  - Event name
  - Ticket type
  - Registration date
  - Payment status
  - Department/Organization
- Search by name/email
- Filter by:
  - Event
  - Date range
  - Department
- Sort by registration date
- Actions:
  - Approve (single)
  - Reject (with reason)
  - Bulk approve
  - Bulk reject
- Email notification on approval/rejection
- Comment/note adding capability
- View participant details (modal)

**UI Components:**
- Data table with selection checkboxes
- Search and filter bar
- Bulk action dropdown
- Quick action buttons
- Detail view modal
- Confirmation dialogs

---

#### 5.5.2.2 Allowed Registrations
**Priority:** P1 (High)

**Description:** View and manage approved registrations.

**Acceptance Criteria:**
- List all approved registrations
- Display information:
  - Participant name
  - Email
  - Phone
  - Event name
  - Ticket type
  - Registration date
  - Payment status
  - Attendance status (Attended/Not Attended)
- Search and filter capabilities (same as pending)
- Actions:
  - View details
  - Mark as attended
  - Cancel registration (with refund option)
  - Resend confirmation email
  - Download ticket/QR code
- Export to CSV/Excel
- Send bulk emails to this list

**UI Components:**
- Data table
- Status badges
- Action menu
- Export button
- Bulk email composer

---

#### 5.5.2.3 Total Registrations
**Priority:** P1 (High)

**Description:** Comprehensive view of all registrations regardless of status.

**Acceptance Criteria:**
- Unified view of all registrations:
  - Pending approval
  - Approved
  - Rejected
  - Cancelled
  - Attended
  - No-show
- All search and filter capabilities
- Additional filters:
  - Registration status
  - Payment status
  - Attendance status
- Summary statistics:
  - Total count
  - Count by status
  - Count by event
- Visual breakdown (pie chart of statuses)
- Export comprehensive report

**UI Components:**
- Unified data table
- Multi-select filters
- Statistics dashboard
- Export options

---

#### 5.5.2.4 Registration Details View
**Priority:** P1 (High)

**Description:** Detailed view of individual registration.

**Acceptance Criteria:**
- Display all registration information:
  - Personal details
  - Event details
  - Ticket information
  - Payment details
  - Registration timestamp
  - Approval/rejection history
  - Attendance record
- Activity log (all actions on this registration)
- Associated documents/uploads
- Communication history (emails sent)
- Actions available:
  - Edit details (SuperAdmin only)
  - Change status
  - Resend emails
  - Add notes
  - Download receipt

**UI Components:**
- Detailed information cards
- Timeline view for activity
- Action buttons
- Notes section

---

### 5.5.3 Registrations Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Registrations Management                          │
├─────────────────────────────────────────────────────┤
│  [Pending Approvals (12)] [Allowed] [Total]       │
├─────────────────────────────────────────────────────┤
│  PENDING APPROVALS                                 │
│                                                     │
│  [Search...]              [Event ▼] [Date ▼]      │
│  [Bulk Actions ▼]                     [Export]     │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │☐│Name    │Email      │Event  │Date  │Action│  │
│  ├─────────────────────────────────────────────┤  │
│  │☐│John Doe│john@..   │Summit │12/10│[A][R]│  │
│  │☐│Jane S. │jane@..   │Workshop│12/11│[A][R]│  │
│  │☐│Mike T. │mike@..   │Summit │12/11│[A][R]│  │
│  └─────────────────────────────────────────────┘  │
│  ☑ Select All    [Approve Selected] [Reject Selected]│
│                                                     │
│  Showing 1-20 of 12                [< 1 >]         │
└─────────────────────────────────────────────────────┘

ALLOWED REGISTRATIONS:
┌─────────────────────────────────────────────────────┐
│  Summary: Total Approved: 1,234 | Attended: 987    │
│                                                     │
│  [Search...]         [Event ▼] [Status ▼] [Export]│
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │Name    │Email  │Event  │Payment│Attended │⋮ │  │
│  ├─────────────────────────────────────────────┤  │
│  │John Doe│john@..│Summit │ Paid  │   ✓     │⋮ │  │
│  │Jane S. │jane@..│Work.. │ Paid  │   ✗     │⋮ │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

REGISTRATION DETAIL (Modal):
┌─────────────────────────────────────────────────────┐
│  Registration Details                        [✕]   │
├─────────────────────────────────────────────────────┤
│  Participant Information                           │
│  Name: John Doe                                    │
│  Email: john.doe@example.com                       │
│  Phone: +91 98765 43210                           │
│  Department: Computer Science                      │
│                                                     │
│  Event Information                                 │
│  Event: Tech Summit 2024                          │
│  Ticket Type: Early Bird (₹200)                   │
│  Registration Date: 10 Dec 2024, 3:45 PM          │
│                                                     │
│  Payment Information                               │
│  Status: Paid                                      │
│  Transaction ID: TXN123456789                      │
│  Amount: ₹200                                      │
│                                                     │
│  Status                                            │
│  Approval: Approved (by Admin, 10 Dec 2024)       │
│  Attendance: Attended (12 Dec 2024, 9:30 AM)      │
│                                                     │
│  Actions                                           │
│  [Resend Confirmation] [Download Ticket] [Cancel] │
│                                                     │
│  Activity Log                                      │
│  • Marked as attended - 12 Dec, 9:30 AM           │
│  • Approved by SuperAdmin - 10 Dec, 4:00 PM       │
│  • Payment confirmed - 10 Dec, 3:50 PM            │
│  • Registration submitted - 10 Dec, 3:45 PM       │
└─────────────────────────────────────────────────────┘
```

---

## 5.6 Module 6: Team

### 5.6.1 Overview
Manage team members with role-based access control.

### 5.6.2 Features

#### 5.6.2.1 Team Member Management
**Priority:** P1 (High)

**Description:** Add, edit, and remove team members.

**Acceptance Criteria:**
- List all team members
- Display information:
  - Name
  - Email
  - Role (Admin, Moderator, Event Manager, Viewer)
  - Status (Active/Inactive)
  - Date added
  - Last login
  - Events assigned (count)
- Add new team member:
  - Email invitation
  - Role assignment
  - Permission configuration
- Edit team member:
  - Change role
  - Update permissions
  - Activate/deactivate
- Remove team member (with confirmation)
- Search by name/email
- Filter by role/status

**UI Components:**
- Data table
- Add member button
- Role badges
- Action menu
- Invitation modal
- Edit modal

---

#### 5.6.2.2 Role-Based Access Control
**Priority:** P0 (Critical)

**Description:** Define and manage permissions for different roles.

**Acceptance Criteria:**
- Predefined roles:
  - **SuperAdmin**: Full access to everything
  - **Admin**: All access except critical settings
  - **Event Manager**: Can create/edit events, view registrations
  - **Moderator**: Can approve registrations, view analytics
  - **Viewer**: Read-only access to events and registrations
- Custom role creation capability
- Permission matrix:
  - Dashboard (View)
  - Reports (View, Generate)
  - Events (View, Create, Edit, Delete, Approve)
  - Analytics (View)
  - Registrations (View, Approve, Edit)
  - Team (View, Add, Edit, Remove)
  - Assets (View, Upload, Delete)
  - Announcements (View, Send)
  - Settings (View, Edit)
- Granular permissions per module
- Role assignment to team members

**UI Components:**
- Role management interface
- Permission matrix (checkboxes)
- Role assignment dropdown

---

#### 5.6.2.3 Activity Tracking
**Priority:** P2 (Medium)

**Description:** Track team member activities and audit trail.

**Acceptance Criteria:**
- Log all significant actions:
  - Event created/edited/deleted
  - Registrations approved/rejected
  - Reports generated
  - Settings changed
  - Announcements sent
- Display for each activity:
  - Team member name
  - Action performed
  - Timestamp
  - Affected entity (event, registration, etc.)
  - IP address (optional)
- Filter by:
  - Team member
  - Date range
  - Action type
- Search activities
- Export activity log

**UI Components:**
- Activity log table
- Filter sidebar
- Detail view modal
- Export button

---

### 5.6.3 Team Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Team Management                    [+ Add Member]  │
├─────────────────────────────────────────────────────┤
│  [Search team members...]    [Role ▼] [Status ▼]  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │Name      │Email      │Role    │Status│Login│⋮│ │
│  ├─────────────────────────────────────────────┤  │
│  │John Doe  │john@..   │Admin   │Active│2h  │⋮│ │
│  │Jane Smith│jane@..   │Event Mgr│Active│1d  │⋮│ │
│  │Mike T.   │mike@..   │Moderator│Inactive│7d│⋮│ │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Roles & Permissions                [Edit Roles]   │
│  ┌─────────────────────────────────────────────┐  │
│  │ SuperAdmin: Full access (1 member)          │  │
│  │ Admin: All except settings (3 members)      │  │
│  │ Event Manager: Event management (5 members) │  │
│  │ Moderator: Registration approval (2 members)│  │
│  │ Viewer: Read-only access (4 members)        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Recent Activity                       [View All]   │
│  • John Doe approved 5 registrations - 2h ago      │
│  • Jane Smith created "Workshop 2024" - 5h ago     │
│  • Mike T. generated revenue report - 1d ago       │
└─────────────────────────────────────────────────────┘

ADD MEMBER MODAL:
┌─────────────────────────────────────────────────────┐
│  Add Team Member                             [✕]   │
├─────────────────────────────────────────────────────┤
│  Name: [________________]                          │
│  Email: [________________]                         │
│  Role: [Select Role ▼]                            │
│                                                     │
│  Permissions:                                      │
│  ☑ View Dashboard                                  │
│  ☑ View Events        ☑ Create Events             │
│  ☐ Edit Events        ☐ Delete Events             │
│  ☑ View Registrations ☑ Approve Registrations     │
│  ☑ View Analytics                                  │
│  ☐ Manage Team                                     │
│  ☐ Access Settings                                 │
│                                                     │
│  [Cancel]                    [Send Invitation]     │
└─────────────────────────────────────────────────────┘

ROLE EDITOR:
┌─────────────────────────────────────────────────────┐
│  Edit Role: Event Manager                    [✕]   │
├─────────────────────────────────────────────────────┤
│  Module         │ View │Create│ Edit │Delete│Approve││
│  ─────────────────────────────────────────────────  │
│  Dashboard      │  ✓   │  -   │  -   │  -   │   -  ││
│  Events         │  ✓   │  ✓   │  ✓   │  ☐   │   ☐  ││
│  Registrations  │  ✓   │  -   │  ☐   │  ☐   │   ☐  ││
│  Analytics      │  ✓   │  -   │  -   │  -   │   -  ││
│  Reports        │  ✓   │  ✓   │  -   │  -   │   -  ││
│  Team           │  ☐   │  ☐   │  ☐   │  ☐   │   -  ││
│  Assets         │  ✓   │  ✓   │  ☐   │  ☐   │   -  ││
│  Announcements  │  ✓   │  ✓   │  -   │  -   │   -  ││
│  Settings       │  ☐   │  -   │  ☐   │  -   │   -  ││
│                                                     │
│  [Cancel]                           [Save Changes]  │
└─────────────────────────────────────────────────────┘
```

---

## 5.7 Module 7: Assets

### 5.7.1 Overview
Centralized media and branding asset management system.

### 5.7.2 Features

#### 5.7.2.1 Hero Sliders
**Priority:** P1 (High)

**Description:** Manage homepage hero slider images/videos.

**Acceptance Criteria:**
- Upload slider media (images/videos)
- Supported formats:
  - Images: JPG, PNG, WebP (max 5MB)
  - Videos: MP4, WebM (max 50MB)
- For each slider:
  - Upload media
  - Add title/heading
  - Add description/subtitle
  - Add CTA button (text + link)
  - Set display order
  - Enable/disable
  - Schedule (start/end date)
- Drag-and-drop reordering
- Preview slider
- Auto-optimization (compression)
- Responsive preview (mobile/tablet/desktop)
- Maximum 10 active sliders

**UI Components:**
- Upload area (drag-and-drop)
- Slider list with preview thumbnails
- Drag handles for reordering
- Edit modal
- Preview modal
- Toggle switches (active/inactive)

---

#### 5.7.2.2 Logos
**Priority:** P1 (High)

**Description:** Manage organizational and event logos.

**Acceptance Criteria:**
- Upload logos:
  - Organization logo (main)
  - Organization logo (white version)
  - Event-specific logos
  - Partner/sponsor logos
- Supported formats: PNG, SVG (max 2MB)
- For each logo:
  - Upload file
  - Add name/label
  - Add description
  - Set category (Org/Event/Partner)
  - Add link (optional)
- Display in organized categories
- Download logo (original + various sizes)
- Replace existing logo
- Delete logo (with confirmation)

**UI Components:**
- Category tabs
- Logo grid view
- Upload button
- Preview with download options
- Delete confirmation dialog

---

#### 5.7.2.3 Gallery
**Priority:** P2 (Medium)

**Description:** Photo and video gallery management.

**Acceptance Criteria:**
- Upload media to gallery
- Supported formats:
  - Images: JPG, PNG, WebP
  - Videos: MP4, WebM
- Bulk upload capability (up to 50 files)
- Organize by:
  - Albums/collections
  - Events
  - Tags
- For each media item:
  - Add title
  - Add description
  - Add tags
  - Set featured image
  - Enable/disable public display
- Search and filter
- Grid/list view toggle
- Lightbox preview
- Download media
- Delete media (bulk delete option)

**UI Components:**
- Bulk upload interface
- Album/collection organizer
- Tag manager
- Grid view with hover actions
- Lightbox gallery
- Filter sidebar

---

#### 5.7.2.4 Branding Assets
**Priority:** P1 (High)

**Description:** Manage color schemes, fonts, and brand guidelines.

**Acceptance Criteria:**
- Color palette manager:
  - Primary color
  - Secondary color
  - Accent colors
  - Text colors
  - Background colors
  - Color picker interface
  - Preview application
- Font management:
  - Upload custom fonts (TTF, WOFF, WOFF2)
  - Google Fonts integration
  - Set primary/secondary fonts
  - Preview text in fonts
- Brand assets:
  - Upload brand guidelines (PDF)
  - Style guide
  - Templates
  - Icons/graphics
- Apply changes globally
- Preview on sample pages
- Export brand kit

**UI Components:**
- Color palette editor
- Font selector/uploader
- Preview panes
- Asset library
- Apply/reset buttons

---

#### 5.7.2.5 Media Library
**Priority:** P1 (High)

**Description:** General media storage and management.

**Acceptance Criteria:**
- Upload any media files:
  - Images
  - Videos
  - Documents (PDF, DOC, etc.)
  - Other files
- Organize by folders
- File metadata:
  - Name
  - File type
  - Size
  - Upload date
  - Uploaded by
  - Used in (events/pages)
- Search by filename
- Filter by file type
- Sort by date/size/name
- Rename files
- Move to folder
- Copy file URL
- Delete files (with usage warning)
- Storage usage tracker

**UI Components:**
- Folder tree view
- File grid/list view
- Upload button
- Search bar
- Filter dropdowns
- Context menu (right-click)
- Storage usage indicator

---

### 5.7.3 Assets Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Assets Management                                  │
├─────────────────────────────────────────────────────┤
│  [Hero Sliders] [Logos] [Gallery] [Branding] [Media]│
├─────────────────────────────────────────────────────┤
│  HERO SLIDERS                          [+ Add Slider]│
│                                                     │
│  Active Sliders (Drag to reorder)                  │
│  ┌─────────────────────────────────────────────┐  │
│  │ ⋮⋮ [Thumbnail]  Tech Summit 2024            │  │
│  │    "Join us..."  [Edit] [Preview] [⚫Active] │  │
│  ├─────────────────────────────────────────────┤  │
│  │ ⋮⋮ [Thumbnail]  Workshop Series             │  │
│  │    "Learn..."    [Edit] [Preview] [⚫Active] │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Inactive Sliders                                  │
│  ┌─────────────────────────────────────────────┐  │
│  │ [Thumbnail]  Old Event  [Edit] [⚪Inactive]  │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

LOGOS TAB:
┌─────────────────────────────────────────────────────┐
│  [Organization] [Events] [Partners]    [+ Upload]   │
│                                                     │
│  Organization Logos                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ [Logo]   │ │ [Logo]   │ │          │           │
│  │ Main     │ │ White    │ │ Upload   │           │
│  │[Download]│ │[Download]│ │ New      │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘

GALLERY TAB:
┌─────────────────────────────────────────────────────┐
│  [All] [Tech Summit] [Workshop] [+ Upload]         │
│  [Grid View] [List View]         [Search...]       │
│                                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │
│  │ IMG │ │ IMG │ │ IMG │ │ VID │ │ IMG │         │
│  │  ⋮  │ │  ⋮  │ │  ⋮  │ │  ▶  │ │  ⋮  │         │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │
│  │ IMG │ │ IMG │ │ VID │ │ IMG │ │ IMG │         │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘         │
│                                                     │
│  Showing 1-10 of 156                 [< 1 2 3 >]   │
└─────────────────────────────────────────────────────┘

BRANDING TAB:
┌─────────────────────────────────────────────────────┐
│  Color Palette                                     │
│  Primary:   [#FF5733] 🎨  Secondary: [#3498DB] 🎨  │
│  Accent:    [#2ECC71] 🎨  Text:      [#2C3E50] 🎨  │
│  Background:[#FFFFFF] 🎨                           │
│                                                     │
│  Typography                                        │
│  Primary Font:   [Roboto ▼]      [Preview]        │
│  Secondary Font: [Open Sans ▼]   [Preview]        │
│  [+ Upload Custom Font]                            │
│                                                     │
│  Brand Guidelines                                  │
│  📄 Brand_Guidelines_2024.pdf      [Download]      │
│  📄 Style_Guide.pdf                [Download]      │
│  [+ Upload Document]                               │
│                                                     │
│  [Preview Changes]              [Apply Globally]   │
└─────────────────────────────────────────────────────┘

MEDIA LIBRARY TAB:
┌─────────────────────────────────────────────────────┐
│  Folders              │ Files                       │
│  ┌──────────────────┐ │ [Upload] [Grid] [List]     │
│  │ 📁 Events        │ │ [Search files...]          │
│  │   📁 Summit 2024 │ │                            │
│  │   📁 Workshop    │ │ Name      │Type│Size│Date │
│  │ 📁 Documents     │ │ image1.jpg│IMG │2MB │12/1│
│  │ 📁 Videos        │ │ video1.mp4│VID │15MB│12/2│
│  │ 📁 Misc          │ │ doc1.pdf  │DOC │1MB │12/3│
│  └──────────────────┘ │                            │
│                       │ Storage: 234 MB / 10 GB    │
│                       │ [████████░░] 23%           │
└─────────────────────────────────────────────────────┘
```

---

## 5.8 Module 8: Announcements

### 5.8.1 Overview
Email announcement system with mail merge capabilities (inspired by Ecelldypiu mailmerge).

### 5.8.2 Features

#### 5.8.2.1 Email Composer
**Priority:** P0 (Critical)

**Description:** Create and send bulk emails with personalization.

**Acceptance Criteria:**
- Rich text editor for email composition
- Email components:
  - Subject line (with variable support)
  - Email body (HTML editor)
  - Attachments (multiple files, max 10MB total)
  - CC/BCC
- Personalization variables:
  - {{name}} - Participant name
  - {{email}} - Participant email
  - {{event}} - Event name
  - {{ticket_type}} - Ticket type
  - {{registration_id}} - Registration ID
  - {{qr_code}} - QR code for ticket
  - Custom variables
- Template support:
  - Pre-built templates (Welcome, Reminder, Confirmation, etc.)
  - Save custom templates
  - Load template
- Preview email (with sample data)
- Test email (send to test addresses)
- HTML/Plain text toggle

**UI Components:**
- Rich text editor (TinyMCE/CKEditor)
- Variable inserter (dropdown)
- Template selector
- Attachment uploader
- Preview pane
- Send test button

---

#### 5.8.2.2 Recipient Selection
**Priority:** P0 (Critical)

**Description:** Select email recipients with advanced filtering.

**Acceptance Criteria:**
- Recipient selection methods:
  - All registered participants
  - All approved participants
  - All attended participants
  - Specific event participants
  - By ticket type
  - By department/organization
  - By registration date range
  - Custom CSV upload
  - Individual selection
- Multiple filter combination (AND/OR logic)
- Recipient count display (live update)
- Preview recipient list
- Exclude specific emails
- Validate email addresses
- Remove duplicates
- Import from CSV (name, email mapping)

**UI Components:**
- Filter builder interface
- Recipient counter
- Preview list modal
- CSV upload area
- Email validation indicator

---

#### 5.8.2.3 Sending & Scheduling
**Priority:** P0 (Critical)

**Description:** Send emails immediately or schedule for later.

**Acceptance Criteria:**
- Send options:
  - Send immediately
  - Schedule for specific date/time
  - Send in batches (rate limiting)
- Batch sending configuration:
  - Emails per hour (to avoid spam filters)
  - Delay between batches
- Confirmation before sending
- Progress tracking during send
- Pause/resume sending
- Cancel scheduled send
- Queue management

**UI Components:**
- Send/schedule toggle
- Date/time picker
- Batch size configurator
- Progress bar during sending
- Confirmation dialog
- Queue viewer

---

#### 5.8.2.4 Email History & Analytics
**Priority:** P1 (High)

**Description:** Track sent emails and their performance.

**Acceptance Criteria:**
- List all sent announcements:
  - Subject
  - Recipients count
  - Sent date/time
  - Sent by (team member)
  - Status (Sent, Scheduled, Failed, In Progress)
- Email analytics:
  - Delivered count
  - Bounced emails
  - Open rate (if tracking enabled)
  - Click rate (if tracking enabled)
  - Failed/error count
- View sent email content
- Resend to failed recipients
- Download recipient list
- Export email logs
- Search/filter history

**UI Components:**
- Email history table
- Analytics dashboard
- Detail view modal
- Resend button
- Export button

---

#### 5.8.2.5 Email Templates Library
**Priority:** P1 (High)

**Description:** Pre-built and custom email templates.

**Acceptance Criteria:**
- Pre-built templates:
  - Registration Confirmation
  - Payment Receipt
  - Event Reminder (1 week, 1 day before)
  - Thank You (post-event)
  - Approval Notification
  - Rejection Notification
  - General Announcement
- Template management:
  - Create new template
  - Edit template
  - Duplicate template
  - Delete template
  - Set default template
- Template variables support
- Template preview
- Template categories
- Search templates

**UI Components:**
- Template gallery (grid view)
- Template editor
- Category filter
- Preview modal
- Save/delete buttons

---

### 5.8.3 Announcements Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Announcements                                      │
├─────────────────────────────────────────────────────┤
│  [Compose] [Templates] [History]                   │
├─────────────────────────────────────────────────────┤
│  COMPOSE EMAIL                                     │
│                                                     │
│  Template: [Select Template ▼] [Load]             │
│                                                     │
│  Recipients                                        │
│  ┌─────────────────────────────────────────────┐  │
│  │ Select Recipients:                           │  │
│  │ ○ All Registered (1,234)                     │  │
│  │ ○ Specific Event: [Tech Summit ▼] (234)     │  │
│  │ ○ By Ticket Type: [Early Bird ▼]            │  │
│  │ ○ By Department: [CS ▼]                     │  │
│  │ ● Custom Filters                             │  │
│  │   Event: [All ▼]                             │  │
│  │   Status: [Approved ▼]                       │  │
│  │   + Add Filter                               │  │
│  │                                              │  │
│  │ Selected Recipients: 234  [Preview List]     │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Email Details                                     │
│  Subject: [________________________________]        │
│            Variables: {{name}} {{event}} ▼         │
│                                                     │
│  Body:                                             │
│  ┌─────────────────────────────────────────────┐  │
│  │ [B][I][U] [🔗][📷] {{variable}} ▼           │  │
│  ├─────────────────────────────────────────────┤  │
│  │ Dear {{name}},                               │  │
│  │                                              │  │
│  │ We are excited to inform you...             │  │
│  │                                              │  │
│  │                                              │  │
│  │                                              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Attachments: [Choose Files]                       │
│  📎 event_brochure.pdf (2.3 MB) [✕]               │
│                                                     │
│  [Preview] [Send Test Email]                       │
│                                                     │
│  Send Options:                                     │
│  ● Send Immediately                                │
│  ○ Schedule: [Date] [Time]                        │
│                                                     │
│  [Save as Draft]           [Send Announcement]     │
└─────────────────────────────────────────────────────┘

TEMPLATES TAB:
┌─────────────────────────────────────────────────────┐
│  Email Templates                    [+ New Template]│
│  [Search templates...]              [Category ▼]   │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Confirm  │ │ Reminder │ │ Receipt  │           │
│  │ [Preview]│ │ [Preview]│ │ [Preview]│           │
│  │ [Use]    │ │ [Use]    │ │ [Use]    │           │
│  │ [Edit]   │ │ [Edit]   │ │ [Edit]   │           │
│  └──────────┘ └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Thank You│ │ Approval │ │ Custom 1 │           │
│  │ [Preview]│ │ [Preview]│ │ [Preview]│           │
│  │ [Use]    │ │ [Use]    │ │ [Use]    │           │
│  │ [Edit]   │ │ [Edit]   │ │ [Edit]   │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘

HISTORY TAB:
┌─────────────────────────────────────────────────────┐
│  Email History                                      │
│  [Search...]         [Status ▼] [Date Range]       │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │Subject          │Recipients│Sent   │Status │⋮│ │
│  ├─────────────────────────────────────────────┤  │
│  │Event Reminder   │   234    │12/10  │✓ Sent │⋮│ │
│  │  Delivered: 230 | Bounced: 4 | Opened: 156  │  │
│  ├─────────────────────────────────────────────┤  │
│  │Welcome Email    │  1,234   │12/08  │✓ Sent │⋮│ │
│  │  Delivered: 1,230 | Bounced: 4 | Opened: 890│  │
│  ├─────────────────────────────────────────────┤  │
│  │Monthly Update   │   500    │12/15  │⏰ Sched│⋮│ │
│  │  Scheduled for: Dec 15, 2024 at 9:00 AM     │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

EMAIL DETAIL VIEW:
┌─────────────────────────────────────────────────────┐
│  Email Details: Event Reminder               [✕]   │
├─────────────────────────────────────────────────────┤
│  Subject: Don't forget! Tech Summit starts tomorrow│
│  Sent: 12 Dec 2024, 10:00 AM                       │
│  Sent by: John Doe (SuperAdmin)                    │
│                                                     │
│  Recipients: 234                                   │
│  ✓ Delivered: 230                                  │
│  ✗ Bounced: 4 [View Failed]                        │
│  📧 Opened: 156 (67%)                              │
│  🔗 Clicked: 89 (38%)                              │
│                                                     │
│  Email Content Preview:                            │
│  ┌─────────────────────────────────────────────┐  │
│  │ Dear [Name],                                 │  │
│  │ This is a reminder that Tech Summit 2024... │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  [View Full Email] [Download Recipients]           │
│  [Resend to Failed]                                │
└─────────────────────────────────────────────────────┘
```

---

## 5.9 Module 9: Settings

### 5.9.1 Overview
System configuration and personal settings.

### 5.9.2 Features

#### 5.9.2.1 Password Reset
**Priority:** P0 (Critical)

**Description:** Allow SuperAdmin to reset their password.

**Acceptance Criteria:**
- Change own password:
  - Current password verification
  - New password (min 8 characters)
  - Confirm new password
  - Password strength indicator
  - Password requirements display:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
- Email confirmation after password change
- Logout all sessions option
- Password history (prevent reuse of last 5 passwords)

**UI Components:**
- Password input fields (with show/hide toggle)
- Strength meter
- Requirements checklist
- Save button
- Confirmation dialog

---

#### 5.9.2.2 Profile Settings
**Priority:** P1 (High)

**Description:** Manage personal profile information.

**Acceptance Criteria:**
- Editable fields:
  - Name
  - Email (with verification)
  - Phone number
  - Profile picture upload
  - Bio/description
- Email change requires verification
- Profile picture:
  - Upload new (JPG, PNG, max 2MB)
  - Crop/resize interface
  - Remove picture
- Preview changes before saving
- Activity log (login history, actions)

**UI Components:**
- Form fields
- Image uploader with crop tool
- Save/cancel buttons
- Verification email prompt

---

#### 5.9.2.3 Notification Preferences
**Priority:** P2 (Medium)

**Description:** Configure notification settings.

**Acceptance Criteria:**
- Email notifications toggle for:
  - New event submission
  - New registration
  - Pending approvals
  - System alerts
  - Weekly summary
  - Monthly report
- In-app notifications toggle
- Notification frequency:
  - Real-time
  - Hourly digest
  - Daily digest
- Quiet hours configuration

**UI Components:**
- Toggle switches
- Dropdown selectors
- Time pickers
- Save button

---

#### 5.9.2.4 System Settings (SuperAdmin Only)
**Priority:** P1 (High)

**Description:** Global system configuration.

**Acceptance Criteria:**
- Platform settings:
  - Platform name
  - Organization name
  - Contact email
  - Support email
  - Timezone
  - Currency
  - Date format
  - Language
- Feature toggles:
  - Enable/disable registration approvals
  - Enable/disable payment gateway
  - Enable/disable email tracking
  - Maintenance mode
- Email configuration:
  - SMTP settings
  - Email templates default
  - Sender name/email
- Payment gateway settings:
  - Gateway selection
  - API credentials (encrypted)
  - Test/live mode toggle
- Advanced settings:
  - Session timeout
  - File upload limits
  - Rate limiting
  - API access

**UI Components:**
- Tabbed settings interface
- Form fields
- Toggle switches
- Secure input fields (for credentials)
- Test connection buttons
- Save/reset buttons

---

#### 5.9.2.5 Backup & Data Export
**Priority:** P2 (Medium)

**Description:** Database backup and data export functionality.

**Acceptance Criteria:**
- Manual backup trigger
- Automatic backup schedule configuration
- Backup includes:
  - Database
  - Uploaded files
  - Configuration
- Download backup file
- Restore from backup (with confirmation)
- Data export:
  - All events (CSV/JSON)
  - All registrations (CSV/Excel)
  - All analytics (CSV/PDF)
- Export history (last 10 exports)
- Storage usage display

**UI Components:**
- Backup button
- Schedule configurator
- Backup history list
- Download buttons
- Restore confirmation dialog
- Export section with format selector

---

### 5.9.3 Settings Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Settings                                           │
├─────────────────────────────────────────────────────┤
│  [Profile] [Password] [Notifications] [System]     │
│  [Backup & Export]                                  │
├─────────────────────────────────────────────────────┤
│  PASSWORD RESET                                    │
│                                                     │
│  Change Password                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ Current Password:                            │  │
│  │ [________________________] [👁]              │  │
│  │                                              │  │
│  │ New Password:                                │  │
│  │ [________________________] [👁]              │  │
│  │ Strength: [██████████░░] Strong              │  │
│  │                                              │  │
│  │ Confirm Password:                            │  │
│  │ [________________________] [👁]              │  │
│  │                                              │  │
│  │ Password Requirements:                       │  │
│  │ ✓ At least 8 characters                     │  │
│  │ ✓ One uppercase letter                      │  │
│  │ ✓ One lowercase letter                      │  │
│  │ ✓ One number                                │  │
│  │ ✗ One special character                     │  │
│  │                                              │  │
│  │ ☐ Logout all other sessions                 │  │
│  │                                              │  │
│  │ [Cancel]                  [Change Password]  │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

PROFILE TAB:
┌─────────────────────────────────────────────────────┐
│  Profile Information                               │
│                                                     │
│  ┌────────┐                                        │
│  │ [IMG]  │  [Upload Photo] [Remove]              │
│  │        │                                        │
│  └────────┘                                        │
│                                                     │
│  Name: [________________________]                  │
│  Email: [________________________]                 │
│         (Change email requires verification)       │
│  Phone: [________________________]                 │
│                                                     │
│  Bio:                                              │
│  [________________________________________]        │
│  [________________________________________]        │
│                                                     │
│  [Cancel]                         [Save Changes]   │
└─────────────────────────────────────────────────────┘

NOTIFICATIONS TAB:
┌─────────────────────────────────────────────────────┐
│  Notification Preferences                          │
│                                                     │
│  Email Notifications:                              │
│  New event submission          [⚫ On]             │
│  New registration              [⚫ On]             │
│  Pending approvals             [⚫ On]             │
│  System alerts                 [⚫ On]             │
│  Weekly summary                [⚪ Off]            │
│  Monthly report                [⚫ On]             │
│                                                     │
│  In-app Notifications:         [⚫ On]             │
│                                                     │
│  Notification Frequency:                           │
│  ● Real-time                                       │
│  ○ Hourly digest                                   │
│  ○ Daily digest                                    │
│                                                     │
│  Quiet Hours:                                      │
│  From: [22:00] To: [08:00]                        │
│                                                     │
│  [Save Preferences]                                │
└─────────────────────────────────────────────────────┘

SYSTEM SETTINGS TAB (SuperAdmin Only):
┌─────────────────────────────────────────────────────┐
│  System Configuration                              │
│  [General] [Email] [Payment] [Advanced]           │
│                                                     │
│  GENERAL SETTINGS                                  │
│  Platform Name: [________________________]         │
│  Organization: [________________________]          │
│  Contact Email: [________________________]         │
│  Timezone: [Asia/Kolkata ▼]                       │
│  Currency: [INR ▼]                                │
│  Date Format: [DD/MM/YYYY ▼]                      │
│                                                     │
│  Feature Toggles:                                  │
│  Registration approvals    [⚫ On]                 │
│  Payment gateway           [⚫ On]                 │
│  Email tracking            [⚫ On]                 │
│  Maintenance mode          [⚪ Off]                │
│                                                     │
│  [Save Settings]                                   │
└─────────────────────────────────────────────────────┘

BACKUP & EXPORT TAB:
┌─────────────────────────────────────────────────────┐
│  Backup & Data Export                              │
│                                                     │
│  Database Backup                                   │
│  Last backup: 12 Dec 2024, 2:00 AM (Auto)         │
│  [Create Backup Now]                               │
│                                                     │
│  Automatic Backup Schedule:                        │
│  Frequency: [Daily ▼] at [02:00]                  │
│  [Update Schedule]                                 │
│                                                     │
│  Recent Backups:                                   │
│  📦 backup_2024-12-12.zip (45 MB) [Download]      │
│  📦 backup_2024-12-11.zip (44 MB) [Download]      │
│  📦 backup_2024-12-10.zip (43 MB) [Download]      │
│                                                     │
│  Data Export                                       │
│  ┌─────────────────────────────────────────────┐  │
│  │ Export Type: [All Events ▼]                 │  │
│  │ Format: ○ CSV  ● Excel  ○ JSON             │  │
│  │ Date Range: [From] [To]                     │  │
│  │ [Generate Export]                            │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Storage Usage: 2.3 GB / 10 GB [███████░░░] 23%   │
└─────────────────────────────────────────────────────┘
```

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load time < 2 seconds
- Dashboard real-time updates with minimal latency
- Support concurrent users: 500+ simultaneous
- API response time < 500ms
- Image optimization and lazy loading
- Efficient database queries (indexed)
- Caching strategy for frequently accessed data

### 6.2 Security
- Role-based access control (RBAC)
- Data encryption at rest and in transit (HTTPS)
- Secure password storage (bcrypt/argon2)
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting on API endpoints
- Secure file upload validation
- Session management with timeout
- Audit logging for sensitive actions
- Regular security audits

### 6.3 Scalability
- Horizontal scaling capability
- Database optimization for large datasets
- CDN for static assets
- Load balancing support
- Microservices architecture consideration
- Queue system for email sending

### 6.4 Reliability
- 99.9% uptime target
- Automated backups (daily)
- Error logging and monitoring
- Graceful error handling
- Fallback mechanisms
- Database replication

### 6.5 Usability
- Responsive design (mobile, tablet, desktop)
- Intuitive navigation
- Consistent UI/UX across modules
- Accessibility compliance (WCAG 2.1 Level AA)
- Keyboard navigation support
- Screen reader compatibility
- Clear error messages
- Loading states and feedback
- Help documentation/tooltips

### 6.6 Compatibility
- Browser support:
  - Chrome (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)
  - Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Screen resolutions: 1920x1080 to 360x640

### 6.7 Maintainability
- Clean, documented code
- Modular architecture
- Version control (Git)
- Code review process
- Unit testing (>80% coverage)
- Integration testing
- Automated deployment (CI/CD)

---

## 7. Database Schema (High-Level)

### 7.1 Core Tables

```sql
-- Users
users
  - id (PK)
  - name
  - email (unique)
  - password_hash
  - role_id (FK)
  - status
  - created_at
  - updated_at

-- Roles
roles
  - id (PK)
  - name
  - permissions (JSON)
  - created_at

-- Events
events
  - id (PK)
  - name
  - description
  - start_date
  - end_date
  - registration_start
  - registration_end
  - status
  - created_by (FK)
  - venue
  - created_at
  - updated_at

-- Registrations
registrations
  - id (PK)
  - event_id (FK)
  - participant_name
  - email
  - phone
  - department
  - ticket_type_id (FK)
  - status (pending/approved/rejected/cancelled)
  - payment_status
  - payment_id
  - attended
  - registered_at
  - approved_at
  - approved_by (FK)

-- Ticket Types
ticket_types
  - id (PK)
  - event_id (FK)
  - name
  - price
  - quantity
  - sold
  - description
  - created_at

-- Assets
assets
  - id (PK)
  - type (slider/logo/gallery/media)
  - file_url
  - file_name
  - file_size
  - title
  - description
  - category
  - metadata (JSON)
  - uploaded_by (FK)
  - created_at

-- Announcements
announcements
  - id (PK)
  - subject
  - body
  - recipients (JSON)
  - status (draft/scheduled/sent)
  - sent_at
  - sent_by (FK)
  - created_at

-- Email Logs
email_logs
  - id (PK)
  - announcement_id (FK)
  - recipient_email
  - status (delivered/bounced/opened/clicked)
  - sent_at
  - opened_at
  - clicked_at

-- Audit Logs
audit_logs
  - id (PK)
  - user_id (FK)
  - action
  - entity_type
  - entity_id
  - old_value (JSON)
  - new_value (JSON)
  - ip_address
  - created_at

-- Settings
settings
  - id (PK)
  - key (unique)
  - value (JSON)
  - updated_by (FK)
  - updated_at
```

---

## 8. API Endpoints (Summary)

### 8.1 Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- POST `/api/auth/refresh` - Refresh token

### 8.2 Dashboard
- GET `/api/dashboard/metrics` - Dashboard metrics
- GET `/api/dashboard/live-events` - Live events
- GET `/api/dashboard/pending-approvals` - Pending events
- GET `/api/dashboard/revenue` - Revenue data
- GET `/api/dashboard/server-health` - Server metrics

### 8.3 Events
- GET `/api/events` - List events
- GET `/api/events/:id` - Event details
- POST `/api/events` - Create event
- PUT `/api/events/:id` - Update event (dates - SuperAdmin)
- DELETE `/api/events/:id` - Delete event
- POST `/api/events/:id/approve` - Approve event
- POST `/api/events/:id/reject` - Reject event

### 8.4 Analytics
- GET `/api/analytics/aggregated` - Aggregated analytics
- GET `/api/analytics/event/:id` - Event-wise analytics
- GET `/api/analytics/event/:id/participants` - Participant stats
- GET `/api/analytics/event/:id/revenue` - Revenue breakdown
- GET `/api/analytics/event/:id/tickets` - Ticket analysis
- GET `/api/analytics/event/:id/departments` - Department stats

### 8.5 Registrations
- GET `/api/registrations` - List registrations
- GET `/api/registrations/:id` - Registration details
- POST `/api/registrations/:id/approve` - Approve registration
- POST `/api/registrations/:id/reject` - Reject registration
- PUT `/api/registrations/:id` - Update registration
- DELETE `/api/registrations/:id` - Cancel registration

### 8.6 Reports
- POST `/api/reports/generate` - Generate report
- GET `/api/reports/templates` - List templates
- POST `/api/reports/templates` - Save template
- GET `/api/reports/scheduled` - Scheduled reports
- POST `/api/reports/schedule` - Schedule report

### 8.7 Team
- GET `/api/team` - List team members
- POST `/api/team` - Add team member
- PUT `/api/team/:id` - Update team member
- DELETE `/api/team/:id` - Remove team member
- GET `/api/roles` - List roles
- PUT `/api/roles/:id` - Update role permissions

### 8.8 Assets
- GET `/api/assets` - List assets
- POST `/api/assets/upload` - Upload asset
- PUT `/api/assets/:id` - Update asset
- DELETE `/api/assets/:id` - Delete asset
- GET `/api/assets/sliders` - Hero sliders
- GET `/api/assets/logos` - Logos
- GET `/api/assets/gallery` - Gallery

### 8.9 Announcements
- GET `/api/announcements` - List announcements
- POST `/api/announcements` - Create announcement
- POST `/api/announcements/send` - Send email
- GET `/api/announcements/:id/analytics` - Email analytics
- GET `/api/templates` - Email templates
- POST `/api/templates` - Save template

### 8.10 Settings
- GET `/api/settings` - Get all settings
- PUT `/api/settings` - Update settings
- PUT `/api/settings/password` - Change password
- POST `/api/settings/backup` - Create backup
- POST `/api/settings/export` - Export data

---

## 9. User Flows

### 9.1 Event Approval Flow

```
1. Team member creates event → Event status: "Pending Approval"
2. Notification sent to SuperAdmin
3. SuperAdmin views pending event in Dashboard or Events module
4. SuperAdmin reviews event details
5. Decision:
   a. Approve → Event status: "Approved" → Creator notified
   b. Reject → Event status: "Rejected" → Creator notified with reason
   c. Request Changes → Event status: "Changes Requested" → Creator notified
6. If approved, event becomes visible to public
```

### 9.2 Registration Approval Flow

```
1. User registers for event
2. If auto-approval disabled → Registration status: "Pending"
3. SuperAdmin receives notification
4. SuperAdmin views registration in Registrations module
5. Decision:
   a. Approve → Registration status: "Approved" → Confirmation email sent
   b. Reject → Registration status: "Rejected" → Notification email sent
6. If approved and payment pending → Payment reminder sent
```

### 9.3 Announcement Flow

```
1. SuperAdmin navigates to Announcements
2. Selects/creates email template
3. Configures recipients (filters/manual selection)
4. Composes email with personalization
5. Previews email
6. Sends test email (optional)
7. Schedules or sends immediately
8. Email queue processes batch sending
9. Analytics tracked (delivery, opens, clicks)
10. History updated with results
```

### 9.4 Report Generation Flow

```
1. SuperAdmin navigates to Reports
2. Selects report parameters:
   - Date range
   - Events
   - Sections to include
3. Previews report
4. Selects export format (PDF/Excel/CSV)
5. Downloads or emails report
6. (Optional) Saves as template for future use
7. (Optional) Schedules recurring report
```

---

## 10. Wireframes & Design Guidelines

### 10.1 Design System

**Color Palette:**
- Primary: #2563EB (Blue)
- Secondary: #10B981 (Green)
- Accent: #F59E0B (Amber)
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #3B82F6
- Neutral: #6B7280
- Background: #F9FAFB
- Surface: #FFFFFF

**Typography:**
- Primary Font: Inter / Roboto
- Headings: Bold, larger sizes
- Body: Regular, 14-16px
- Monospace (for codes): Fira Code / Source Code Pro

**Spacing:**
- Base unit: 4px
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

**Shadows:**
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)

### 10.2 Component Library
- Buttons: Primary, Secondary, Outline, Text, Danger
- Input fields: Text, Number, Email, Password, Textarea, Select
- Cards: Standard, Interactive, Statistic
- Tables: Sortable, Filterable, Paginated
- Modals: Confirmation, Detail view, Form
- Notifications: Toast, Banner, Alert
- Navigation: Sidebar, Topbar, Breadcrumbs
- Charts: Line, Bar, Pie, Area, Heatmap
- Forms: Validation, Error states, Success states

### 10.3 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

---

## 11. Testing Requirements

### 11.1 Unit Testing
- Test all API endpoints
- Test utility functions
- Test data validations
- Target: >80% code coverage

### 11.2 Integration Testing
- End-to-end user flows
- Module interactions
- API integrations
- Email sending functionality
- Payment gateway integration

### 11.3 User Acceptance Testing (UAT)
- SuperAdmin performs all workflows
- Verify all features against acceptance criteria
- Performance testing under load
- Cross-browser testing

### 11.4 Security Testing
- Penetration testing
- Vulnerability scanning
- Authentication/authorization testing
- Input validation testing
- File upload security testing

---

## 12. Deployment Plan

### 12.1 Environment Setup
- Development environment
- Staging environment
- Production environment

### 12.2 Deployment Strategy
- Continuous Integration/Continuous Deployment (CI/CD)
- Automated testing before deployment
- Blue-green deployment for zero downtime
- Rollback plan

### 12.3 Pre-Deployment Checklist
- [ ] All features implemented and tested
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Email service configured
- [ ] Payment gateway configured (if applicable)
- [ ] Backup system in place
- [ ] Monitoring and logging set up
- [ ] Documentation complete

### 12.4 Post-Deployment
- Monitor error logs
- Track performance metrics
- Gather user feedback
- Address critical bugs immediately
- Plan iterative improvements

---

## 13. Success Metrics

### 13.1 Performance Metrics
- Average page load time
- API response times
- Uptime percentage
- Error rate

### 13.2 Usage Metrics
- Daily active users (SuperAdmin/team)
- Events created per month
- Registrations processed
- Emails sent
- Reports generated

### 13.3 User Satisfaction
- User feedback scores
- Support ticket volume
- Feature adoption rates

---

## 14. Future Enhancements (Post-MVP)

### 14.1 Phase 2 Features
- Mobile app (iOS/Android)
- Advanced analytics with AI insights
- Automated event recommendations
- Integration with social media platforms
- Multi-language support
- Advanced CRM capabilities
- Custom forms builder
- Survey/feedback module
- Certificate generation
- Live streaming integration

### 14.2 Advanced Analytics
- Predictive analytics for ticket sales
- Participant behavior analysis
- Churn prediction
- Revenue forecasting

### 14.3 Automation
- Auto-approval based on criteria
- Smart email scheduling
- Automated follow-ups
- Dynamic pricing

---

## 15. Glossary

| Term | Definition |
|------|------------|
| SuperAdmin | Highest privilege user with full system access |
| Event | An organized occasion (conference, workshop, etc.) |
| Registration | Application/sign-up for event participation |
| Ticket Type | Category of admission (Early Bird, VIP, etc.) |
| Approval Workflow | Process requiring admin authorization |
| Mail Merge | Personalized bulk email sending |
| Analytics | Data analysis and visualization |
| Asset | Media files (images, videos, documents) |
| Announcement | Email communication to participants |
| Audit Log | Record of system activities |

---

## 16. Appendices

### 16.1 Reference Materials
- Original platform: https://joinspott.vercel.app/
- Ecelldypiu mailmerge: [Link if available]
- Design inspiration: [Links to references]

### 16.2 Contact Information
- Product Owner: [Email]
- Tech Lead: [Email]
- Design Lead: [Email]
- Project Manager: [Email]

### 16.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial draft |

---

## 17. Approval

This PRD requires approval from:

- [ ] Product Owner
- [ ] Tech Lead
- [ ] Design Lead
- [ ] Stakeholder(s)

**Approval Date:** _______________

**Signatures:**

___________________________  
Product Owner

___________________________  
Tech Lead

---

**End of PRD**

---

## Quick Reference: Module Summary

1. **Dashboard**: Live events, pending approvals, revenue, server health
2. **Reports**: Comprehensive report generator with custom formats
3. **Events**: Event management with SuperAdmin date editing
4. **Analytics**: Aggregated and event-wise detailed analytics
5. **Registrations**: Pending approvals, allowed, total with management
6. **Team**: Member management with RBAC
7. **Assets**: Hero sliders, logos, gallery, branding, media library
8. **Announcements**: Mail merge system with templates
9. **Settings**: Password reset, profile, notifications, system config

---

This PRD provides a comprehensive blueprint for rebuilding the Spott platform with all specified requirements. Each module is detailed with features, acceptance criteria, UI layouts, and technical considerations. The document serves as a single source of truth for the development team and stakeholders.