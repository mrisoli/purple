# Accountability Buddy App - Implementation Plan

## Current Status
Starting development of accountability buddy network application based on SPEC.md requirements.

## Project Overview
The application helps users set and achieve goals by pairing them with accountability partners. Users can create projects, track progress, and invite buddies to keep them accountable.

## Current Codebase Analysis
- ✅ Next.js app with TailwindCSS and shadcn/ui components
- ✅ Clerk authentication already integrated  
- ✅ Convex backend setup with basic schema (only todos table currently)
- ✅ Basic landing page with generic content
- ✅ Basic dashboard page with Clerk user info
- ❌ No accountability buddy specific functionality yet
- ❌ Schema doesn't match SPEC requirements

## Implementation Priority

### Phase 1: Core Backend (High Priority)
1. **Update Convex Schema** - Replace current todos schema with users, projects, actions tables
2. **User Sync** - Implement automatic user creation in Convex when user signs up via Clerk
3. **Project Management** - CRUD operations for projects with ownership and buddy assignment
4. **Action Tracking** - System for logging progress updates and milestones

### Phase 2: Frontend Features (High Priority)  
5. **Dashboard Redesign** - Show projects, statistics, timeline
6. **Project Creation** - Form to create new projects with free/premium limits
7. **Buddy Invitation** - Email-based buddy invitation system
8. **Timeline View** - Display action history and updates

### Phase 3: Premium & Polish (Medium Priority)
9. **Premium Upgrade** - Payment integration and feature gating
10. **Landing Page** - Update with accountability buddy messaging
11. **Tests** - Unit and integration tests for core flows

## Technical Decisions
- Keep existing tech stack: Next.js + Convex + Clerk + shadcn/ui
- Follow project coding standards: TypeScript, 2-space indentation, alias imports
- Use custom hooks for business logic, keep components minimal
- Implement real-time updates with Convex subscriptions

## Next Steps
Starting with updating the Convex schema to match SPEC requirements, then implementing user sync functionality.