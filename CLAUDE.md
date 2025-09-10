# Project Overview
This is a an accountability buddy network application designed to help users stay on track with their goals by publishing updates and nudging friends, family, or groups. The main users of this application are individuals who have set goals and need someone to keep them accountable, all detailed specs should be in a file called SPEC.md.

## Architecture
The application uses tanstack start in the frontend, components should use shadcn, tailwind and radix-ui
The backend is using convex, which is a serverless backend that allows for real-time data updates and easy integration with the frontend.
The authentication is handled using Clerk, which provides a simple way to manage user accounts and sessions.

## Coding Standards
- **Linting and Formatting**: This project uses Biome for linting and code formatting, along with Ultracite for additional formatting capabilities. All code should be formatted with 2-space indentation.
- Components should be written in TypeScript, minimal logic should be done in actual components, most logic should be moved into hooks and functions and values should be used from custom hooks into components, props should only have primitives like strings, numbers, or typed values, no objects and preferably no arrays.
- Translation strings should be used from the `i18n` module, which is a custom module that provides a simple way to manage translations.
- Imports should use alias paths and not relative paths, for example, `import { Button } from '@/components/ui/button'` instead of `import { Button } from '../../components/ui/button'`.
