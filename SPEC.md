# Accountability Buddy App – Implementation Plan

## Overview

The **Accountability Buddy App** helps users set and achieve goals by pairing them with an accountability partner. Users can create projects, track progress, and invite a buddy to keep them accountable.

The app will have:
- A **landing page** with a call-to-action to sign up.
- An **authenticated dashboard** with statistics and a timeline of actions.
- A **project management area** where users can create projects and invite accountability buddies.
- A **premium upgrade path** to allow multiple projects.

---

## Tech Stack

- **Frontend:** React + TanStack (React Query, Router, Table, etc.)
- **Backend:** Convex (serverless functions + database)
- **Database:** Convex (document-based schema)
- **Authentication:** Clerk (user management, login, signup, sessions)

---

## Database Schema (Convex)

File: `convex/schema.ts`

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    premium: v.boolean(), // free or premium account
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  projects: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    description: v.string(),
    buddyId: v.optional(v.id("users")), // accountability buddy
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  actions: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    type: v.string(), // e.g. "progress_update", "milestone_reached"
    message: v.string(),
    createdAt: v.number(),
  }).index("by_project", ["projectId"]),
});
```

---

## Implementation Steps

### ✅ Project Setup

- [ ] **1. Setup Clerk in React app**
  - Install Clerk: `npm install @clerk/clerk-react`
  - Wrap app with `<ClerkProvider>`
  - Add `<SignIn />`, `<SignUp />`, and `<UserButton />` components.
  - Configure Clerk frontend API key in `.env`.

- [ ] **2. Setup Convex project**
  - Run `npx convex init`
  - Install Convex client: `npm install convex`
  - Add Convex provider in React app.

- [ ] **3. Create schema in `schema.ts`**
  - Define `users`, `projects`, and `actions` tables (see schema above).
  - Run `npx convex dev` to push schema.

---

### ✅ Authentication & User Sync

- [ ] **4. Implement Clerk token verification in Convex**
  - Use `auth.getUserIdentity()` in Convex functions.
  - Verify Clerk JWT tokens.

- [ ] **5. Implement user sync on first login**
  - On login, check if Clerk user exists in `users` table.
  - If not, create a new user record with `clerkId`, `email`, `name`, and `premium: false`.

---

### ✅ Core Features

- [ ] **6. Implement account creation flow**
  - Ensure new users are added to Convex DB.
  - Redirect to dashboard after signup.

- [ ] **7. Implement project creation**
  - Free users: allow only **1 project**.
  - Premium users: allow multiple projects.
  - Store `ownerId`, `name`, `description`, and optional `buddyId`.

- [ ] **8. Implement buddy invitation**
  - User enters buddy’s email.
  - Check if email exists in `users` table.
  - If found, set `buddyId` in project.
  - If not found, show error or invite flow.

- [ ] **9. Implement actions & timeline**
  - Users can log progress updates.
  - Store in `actions` table.
  - Display timeline in dashboard.

- [ ] **10. Implement dashboard statistics**
  - Show number of projects, completed milestones, and buddy activity.
  - Use TanStack Query to fetch data from Convex.

---

### ✅ Premium Features

- [ ] **11. Implement premium upgrade flow**
  - Add `premium` flag in `users` table.
  - Integrate with Stripe (future step).
  - Unlock multiple projects.

---

### ✅ Frontend Pages

- [ ] **12. Landing Page**
  - Marketing copy about accountability and goal setting.
  - Large CTA button → Clerk signup.

- [ ] **13. Dashboard Page**
  - Show statistics and timeline.

- [ ] **14. Project Page**
  - Show project details, buddy info, and actions.

---

## Testing Strategy

- [ ] **15. Unit Tests**
  - Test Convex functions (user creation, project creation, buddy linking).
  - Use bun test and react-testing-library

- [ ] **16. Integration Tests**
  - Test Clerk + Convex auth flow.
  - Ensure user sync works correctly.

- [ ] **17. E2E Tests**
  - Use Playwright or Cypress.
  - Test signup → project creation → buddy invite → action logging.

- [ ] **18. Manual QA**
  - Verify free vs premium project limits.
  - Verify buddy invitation flow.

---

## Summary of Steps

1. **Setup Clerk** in React app
2. **Setup Convex project** (`npx convex init`)
3. **Create schema** in `schema.ts`
4. **Implement Clerk token verification** in Convex
5. **Implement user sync** on first login
6. **Implement account creation**
7. **Implement project creation**
8. **Implement buddy invitation**
9. **Implement actions & timeline**
10. **Implement dashboard statistics**
11. **Implement premium upgrade flow**
12. **Landing Page**
13. **Dashboard Page**
14. **Project Page**
15. **Unit Tests**
16. **Integration Tests**
17. **E2E Tests**
18. **Manual QA**

---

✅ This file can now be used by a coding assistant to **track progress** and **implement features step by step**.
