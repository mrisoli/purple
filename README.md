# Purple - Accountability Buddy Network 🎯

Transform your goals into achievements with accountability partners. Purple connects you with buddies who will support, motivate, and celebrate your progress every step of the way.

## ✨ Features

### Core Functionality
- **🎯 Goal Setting & Projects**: Create accountability projects with detailed descriptions
- **👥 Buddy System**: Invite friends, family, or colleagues as accountability partners
- **📈 Progress Tracking**: Log updates, milestones, and challenges with a detailed timeline
- **🔔 Real-time Updates**: Live synchronization across all users using Convex
- **📊 Statistics & Analytics**: Track your accountability journey with comprehensive metrics

### Subscription Tiers
- **Free Tier**: 1 project with full buddy functionality
- **Premium Tier**: Unlimited projects with advanced features
- **Team Tier**: Organizational accountability with team dashboards

### Technical Features
- **🔐 Secure Authentication**: Clerk-powered user management
- **⚡ Real-time Database**: Convex serverless backend
- **🎨 Modern UI**: shadcn/ui components with Tailwind CSS
- **📱 Responsive Design**: Works perfectly on all devices
- **🌙 Dark Mode**: Built-in theme switching
- **♿ Accessibility**: ARIA-compliant and screen reader friendly
- **💳 Payment Integration**: Stripe-powered premium subscriptions
- **📧 Email Notifications**: Beautiful HTML emails via Resend
- **🛡️ Error Handling**: Comprehensive error boundaries and user feedback
- **⏳ Loading States**: Smooth UX with loading indicators

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/bun
- Clerk account for authentication
- Convex account for backend/database

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd purple
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up Clerk Authentication**
- Create a Clerk application at [clerk.com](https://clerk.com)
- Copy your API keys to `.env.local` in `apps/web/`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

4. **Set up Convex Backend**
- Create a Convex project at [convex.dev](https://convex.dev)
- Run setup in the backend directory:
```bash
cd packages/backend
npx convex init
npx convex dev --configure
```
- Add Convex URL to `apps/web/.env.local`:
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
```

6. **Optional: Configure Stripe (Premium Features)**
```bash
# Add to apps/web/.env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

7. **Optional: Configure Resend (Email Notifications)**
```bash
# Add to apps/web/.env.local
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

5. **Configure Clerk + Convex Integration**
- In your Convex dashboard, add your Clerk JWT issuer domain
- Set the environment variable in Convex:
```bash
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
```

### Running the Application

1. **Start the backend (Convex)**
```bash
npm run dev:server
```

2. **Start the frontend (Next.js)**
```bash
npm run dev:web
```

3. **Visit the application**
Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🏗️ Project Structure

```
purple/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities
│       └── package.json
├── packages/
│   └── backend/             # Convex backend
│       ├── convex/          # Database schema & functions
│       │   ├── schema.ts    # Database schema definition
│       │   ├── users.ts     # User management functions
│       │   ├── projects.ts  # Project management functions
│       │   └── actions.ts   # Action logging functions
│       └── package.json
├── SPEC.md                  # Detailed implementation specification
└── README.md               # This file
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run backend tests
npm run test --workspace=@purple/backend

# Run frontend tests  
npm run test --workspace=web

# Run with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Individual function testing
- **Integration Tests**: Clerk + Convex authentication flow
- **Component Tests**: React component testing
- **E2E Tests**: Full user journey testing (planned)

## 📚 Database Schema

### Users Table
```typescript
{
  clerkId: string,        // Clerk user ID
  email: string,          // User email
  name: string,           // Display name
  premium: boolean,       // Subscription status
  createdAt: number       // Timestamp
}
```

### Projects Table
```typescript
{
  ownerId: Id<"users">,          // Project owner
  name: string,                  // Project name
  description: string,           // Project description
  buddyId?: Id<"users">,        // Optional accountability buddy
  createdAt: number             // Timestamp
}
```

### Actions Table
```typescript
{
  projectId: Id<"projects">,     // Associated project
  userId: Id<"users">,          // User who created action
  type: string,                 // Action type (progress_update, milestone_reached, etc.)
  message: string,              // Action description
  createdAt: number            // Timestamp
}
```

## 🔧 Development Commands

```bash
# Start all development servers
npm run dev

# Start specific services
npm run dev:web          # Frontend only
npm run dev:server       # Backend only

# Build for production
npm run build

# Type checking
npm run check-types

# Code formatting
npm run check            # Format and lint with Biome
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Convex)
1. Run `npx convex deploy` in packages/backend
2. Convex handles deployment and scaling automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the coding standards in `CLAUDE.md`
4. Run tests: `npm test`
5. Format code: `npm run check`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📋 Roadmap

### ✅ Completed
- **Premium Subscription Integration**: Stripe integration for Premium upgrades
- **Email Notifications**: Buddy invitations and welcome emails
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Testing Suite**: Unit and integration tests with Vitest

### 🚧 In Progress
- **Project Management**: Edit and delete functionality for projects
- **User Profile**: Settings and profile management page

### 📅 Planned
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Goal completion insights and trends
- **Team Features**: Organizational dashboards and admin tools
- **Push Notifications**: Real-time mobile and web notifications
- **Goal Templates**: Pre-built goal categories and templates
- **Social Features**: Public goals and community features
- **Integrations**: Calendar, Slack, and other productivity tools

## 🛡️ Security

- All user data is encrypted in transit and at rest
- Authentication handled by Clerk with industry-standard security
- Database queries secured with Convex's built-in authorization
- No sensitive data stored in local storage or cookies

## 📄 License

This project is proprietary. All rights reserved.

## 🆘 Support

- 📧 Email: support@purple.app
- 📚 Documentation: [docs.purple.app](https://docs.purple.app)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/your-org/purple/issues)

---

Built with ❤️ by the Purple team.
