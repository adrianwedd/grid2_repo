# Project: The Grid 2.0 - MVP (Deterministic AI Website Builder)

## Project Overview

This project is a deterministic AI website builder. It uses a beam search algorithm to assemble a webpage from a library of React components. The goal is to provide a tool that can generate websites from user intent without the "hallucinations" that can occur with purely generative AI models. The project is built with Next.js, TypeScript, and Tailwind CSS.

The core of the project is the `generatePage` function, which takes a content graph, brand tokens, a tone, and a list of required sections as input, and returns a primary page and a list of alternate pages. The page generation process involves a beam search to find the optimal combination of sections, followed by a series of audits to check for accessibility, SEO, and performance issues.

## Directory Structure

- **`/app`**: Contains the main application code, including the layout, pages, and API routes.
- **`/components`**: Contains the React components used to build the pages.
- **`/docs`**: Contains the project documentation.
- **`/e2e`**: Contains the end-to-end tests.
- **`/lib`**: Contains the core logic of the application, including the page generation code.
- **`/scripts`**: Contains scripts for running demos and testing.
- **`/tests`**: Contains the unit tests.
- **`/types`**: Contains the TypeScript type definitions.

## Building and Running

### Prerequisites

- Node.js and pnpm

### Installation

```bash
pnpm i
```

### Development

To run the development server:

```bash
pnpm dev
```

This will start the development server on `http://localhost:3000`.

- The main page is at `http://localhost:3000/`
- A demo of a generated page is at `http://localhost:3000/demo`
- The real-time editor is at `http://localhost:3000/editor`

### Building

To build the project for production:

```bash
pnpm build
```

### Testing

The project has three types of tests:

1.  **Unit tests:** `pnpm test`
2.  **E2E tests:** `pnpm test:e2e`
3.  **CI checks:** `pnpm ci` (runs `tsc` and `vitest`)

## Development Conventions

- **Components:** The project uses a component-based architecture, with components located in the `components` directory.
- **Styling:** The project uses Tailwind CSS for styling.
- **State Management:** The project does not appear to have a dedicated state management library, but uses React's built-in state management.
- **Linting:** The project uses the default Next.js linter.
- **Testing:** The project uses Vitest for unit tests and Playwright for end-to-end tests.
- **Code Generation:** The core logic for page generation is in `lib/generate-page.ts`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the project's GitHub repository.