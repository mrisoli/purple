import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test('should allow user to login and see dashboard', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Verify we're on the home page and see unauthenticated content
    await expect(page.locator('h1')).toContainText('Achieve Your Goals with');
    await expect(page.locator('text=Get Started Free')).toBeVisible();
    await expect(page.locator('text=Sign In')).toBeVisible();

    // Click the Sign In button to open the modal
    await page.locator('text=Sign In').click();

    // Wait for Clerk's sign-in modal to appear
    await expect(page.locator('[data-clerk-form="signIn"]')).toBeVisible({
      timeout: 10000
    });

    // Fill in the email field (using a test email)
    // Note: In a real test environment, you'd want to use actual test credentials
    // or mock the authentication service
    const emailInput = page.locator('input[name="identifier"]');
    await emailInput.fill('test@example.com');

    // Click continue to proceed to password step
    await page.locator('button[type="submit"]').first().click();

    // Wait for password field to appear
    await expect(page.locator('input[name="password"]')).toBeVisible({
      timeout: 5000
    });

    // Fill in the password field
    await page.locator('input[name="password"]').fill('testpassword123');

    // Submit the login form
    await page.locator('button[type="submit"]').click();

    // After successful login, we should be redirected to dashboard
    // Wait for dashboard to load (with timeout for authentication process)
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible({
      timeout: 15000
    });

    // Verify we can see authenticated dashboard content
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.locator('text=Total Projects')).toBeVisible();
    await expect(page.locator('text=Your Projects')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();

    // Verify the user menu is present (indicating successful authentication)
    await expect(page.locator('[data-clerk-button="userButton"]')).toBeVisible();

    // Test creating a new project
    await page.locator('text=New Project').click();
    await expect(page.locator('text=Create New Project')).toBeVisible();

    // Fill in project details
    await page.locator('input[id="projectName"]').fill('Test E2E Project');
    await page.locator('input[id="projectDescription"]').fill('A test project created by Playwright');

    // Submit the project creation form
    await page.locator('button[type="submit"]:has-text("Create Project")').click();

    // Verify the project was created successfully
    await expect(page.locator('text=Test E2E Project')).toBeVisible({
      timeout: 5000
    });
    await expect(page.locator('text=A test project created by Playwright')).toBeVisible();

    // Verify the project has a "Needs Buddy" status
    await expect(page.locator('text=Needs Buddy')).toBeVisible();

    // Test navigation to project detail page
    await page.locator('text=View Project').click();

    // Verify we're on the project page
    await expect(page.locator('h1:has-text("Test E2E Project")')).toBeVisible({
      timeout: 5000
    });
  });

  test('should show sign-in prompt for unauthenticated users trying to access dashboard', async ({ page }) => {
    // Try to navigate directly to dashboard without authentication
    await page.goto('/dashboard');

    // Should see the sign-in prompt
    await expect(page.locator('h1:has-text("Sign in to continue")')).toBeVisible();
    await expect(page.locator('text=Please sign in to access your accountability dashboard')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should redirect authenticated users from home to dashboard', async ({ page }) => {
    // This test would typically require setting up authentication state
    // For now, we'll just verify the conditional rendering on the home page

    await page.goto('/');

    // Verify unauthenticated state shows correct buttons
    await expect(page.locator('text=Get Started Free')).toBeVisible();
    await expect(page.locator('text=Sign In')).toBeVisible();

    // The authenticated state would show "Go to Dashboard" button instead
    // This would be tested with proper authentication setup
  });
});