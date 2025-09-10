# Accountability Buddy App - Development TODO

## Current Status
The project has a solid foundation with:
- ✅ Convex backend with proper schema (users, projects, actions) - MATCHES SPEC!
- ✅ Backend functions for users, projects, and actions - FULLY IMPLEMENTED!
- ✅ Basic frontend structure with Next.js and Clerk auth
- ✅ Shadcn UI components setup
- ❌ Landing page is generic, needs accountability buddy branding
- ❌ Dashboard needs implementation for accountability features
- ❌ No project management UI yet
- ❌ No action/timeline UI yet

## Implementation Plan (From SPEC.md)

### Backend (Mostly Complete ✅)
- ✅ Schema defined correctly (users, projects, actions)
- ✅ User authentication and sync with Clerk
- ✅ Project CRUD operations with premium limits (free users = 1 project)
- ✅ Buddy invitation system (by email)
- ✅ Actions/timeline system with user details
- ✅ Recent actions query for dashboard
- ✅ Premium upgrade functionality

### Frontend (Needs Work ❌)
1. **Landing Page** - Update to reflect accountability buddy app
   - Change hero content to focus on accountability and goal setting
   - Update features to be relevant to accountability partnerships
   - Keep Clerk auth integration

2. **Dashboard Page** - Implement accountability dashboard
   - Show user statistics (projects, buddies, recent actions)
   - Display timeline of recent actions across all projects
   - Show project cards with quick access

3. **Project Management** - Create project pages
   - Project creation form with validation
   - Project detail page with buddy info and actions
   - Action logging interface
   - Buddy invitation interface

4. **Premium Features** - Implement upgrade flow
   - Show upgrade prompts for free users trying to create 2nd project
   - Pricing page with premium benefits

### Testing ⏳
- Unit tests for Convex functions
- Integration tests for auth flow
- E2E tests for core user journey

## Immediate Next Steps
1. Update landing page with accountability buddy branding
2. Implement comprehensive dashboard with stats and timeline
3. Create project management UI (creation, detail, actions)
4. Add user-friendly error handling and loading states
5. Test the complete user flow