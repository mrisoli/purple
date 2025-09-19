# End-to-End Tests

This directory contains Playwright end-to-end tests for the Purple accountability buddy application.

## Running Tests

```bash
# Run all e2e tests
bun run test:e2e

# Run tests with UI mode
bun run test:e2e:ui

# Run tests in debug mode
bun run test:e2e:debug

# Run specific test file
bunx playwright test auth-mock.spec.ts

# Run specific test by name
bunx playwright test --grep "should show sign-in prompt"
```

## Test Files

- `auth-mock.spec.ts` - Authentication flow tests that work without real credentials
- `login.spec.ts` - More comprehensive login tests (requires real auth setup)

## Test Scenarios Covered

1. **Unauthenticated Users**:
   - Can view home page with correct content
   - See sign-in/sign-up buttons
   - Get redirected to sign-in when accessing protected routes

2. **Authentication Flow**:
   - Sign-in modal appears when clicking sign-in button
   - Dashboard access requires authentication

3. **Dashboard Functionality**:
   - Project creation form
   - Navigation between pages
   - Basic UI interactions

## Configuration

Tests are configured in `playwright.config.ts` with:
- Automatic dev server startup
- Multiple browser support (Chrome, Firefox, Safari)
- HTML reporting
- Retry on CI environments

## Notes

- Tests use mocked authentication state where possible
- Real authentication tests require proper Clerk test setup
- Tests automatically start the development server on port 3001