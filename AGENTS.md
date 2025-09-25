# Agent Guidelines for Purple Project

## Build/Lint/Test Commands
- **Lint & Format**: `bun run check` (Biome + Ultracite)
- **Build**: `bun run build` (Turbo)
- **Type Check**: `bun run check-types` (Turbo)
- **Test All**: `bun run test` (Vitest)
- **Test Single**: `bun run test -- <pattern>` (e.g., `bun run test -- dashboard.test.tsx`)
- **Test Coverage**: `bun run test:coverage`
- **Test UI**: `bun run test:ui`

## Code Style Guidelines
- **Formatting**: Biome with Ultracite (2-space indentation, strict rules)
- **TypeScript**: Strict null checks enabled, no `any` types, use `as const`
- **Imports**: Use alias paths (`@/components/ui/button`), no relative imports
- **Components**: Minimal logic, use hooks for business logic, props as primitives only
- **UI**: shadcn/ui + Tailwind + Radix UI components
- **Accessibility**: Follow Ultracite a11y rules (semantic elements, ARIA validation)
- **Error Handling**: Comprehensive try/catch, return error objects, no console in prod
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Comments**: None unless explicitly requested
- **Testing**: Vitest + React Testing Library, jsdom environment

## Cursor Rules
Follow all Ultracite rules in `.cursor/rules/ultracite.mdc` including:
- Accessibility standards (no accessKey, proper ARIA, semantic elements)
- TypeScript best practices (no enums, no any, import type)
- React/JSX rules (no Array index keys, proper hooks usage)
- Code quality (no unused vars, consistent formatting, no eval)