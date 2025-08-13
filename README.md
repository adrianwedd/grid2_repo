# The Grid 2.0: AI Site Builder That Actually Works

**AI for understanding, algorithms for execution.**

This project is a deterministic AI website builder that uses a beam search algorithm to assemble a webpage from a library of React components. The goal is to provide a tool that can generate websites from user intent without the "hallucinations" that can occur with purely generative AI models. The project is built with Next.js, TypeScript, and Tailwind CSS.

## Highlights

- **Deterministic Page Generation:** Uses a beam search algorithm to find the optimal combination of sections for a page, ensuring consistent and predictable results.
- **Tone-Aware Components:** A library of React components that can be rendered in different tones (e.g., minimal, bold, playful, corporate) to match the desired brand identity.
- **Pure Transform System:** A system of pure functions that can be used to modify the generated page in a predictable and reproducible way.
- **Real-time Preview:** A real-time editor that allows users to see the changes they make to the page as they make them.
- **Export to Code:** The ability to export the generated page to static HTML or a Next.js application.

## Quickstart

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/adrianwedd/grid2_repo.git
    cd grid2_repo
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**

    ```bash
    cp .env.example .env.local
    # Edit .env.local with your API keys (optional)
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    pnpm dev
    ```

    This will start the development server on `http://localhost:3000`.

### Available Pages

-   **Home:** `http://localhost:3000` - Landing page
-   **Editor:** `http://localhost:3000/editor` - Real-time page builder
-   **Demo:** `http://localhost:3000/demo` - Static generated example
-   **Feeling Lucky:** `http://localhost:3000/lucky` - Random design generator

### Development Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm test                # Run unit tests
npm run test:e2e        # Run Playwright e2e tests
npm run demo:node       # CLI beam search demo
npm run demo:transforms # Test transform system
npm run demo:export     # Test export functionality
```

## Documentation

-   [**MANIFESTO.md**](./docs/MANIFESTO.md): The vision and philosophy behind the project.
-   [**ARCHITECTURE.md**](./docs/ARCHITECTURE.md): A high-level overview of the project's architecture.
-   [**API.md**](./docs/API.md): The documentation for the real-time preview API.
-   [**QUICKSTART-5MIN.md**](./docs/QUICKSTART-5MIN.md): A 5-minute guide to deploying the project.

## Architecture

The project follows the principle of **AI for understanding, algorithms for execution**. This means that AI is used for tasks like content extraction and understanding user intent, while the core page generation and modification logic is handled by deterministic algorithms.

### Modules

-   **`lib/beam-search.ts`**: The beam search assembler, which is responsible for selecting the best combination of sections for a page.
-   **`lib/transforms.ts`**: The transform system, which contains a set of pure functions for modifying the page.
-   **`lib/preview-session.ts`**: The preview session manager, which handles in-memory sessions and undo/redo functionality.
-   **`components/sections/*`**: The library of tone-aware React components.
-   **`lib/generate-page.ts`**: The page generation pipeline, which runs the beam search, audits the page, and returns a `PageNode` for rendering.
-   **`/editor`**: The real-time editor, which uses the `/api/preview` API, the `useRealtimePreview` hook, and the `PageRenderer` component.

### Data Flow

```
User → Chat (command) → /api/preview → interpretChat → [transforms] → apply → analyze → sections → UI
                       ↑                                               ↓
                    init (sections)                                History (undo/redo)
```

## Real-time Preview API

The real-time preview API is available at `POST /api/preview`. It accepts a JSON body with the following actions:

-   `init`: Initializes a new preview session.
-   `preview`: Previews the result of a command without committing it to the history.
-   `command`: Executes a command and commits it to the history.
-   `undo`: Undoes the last command.
-   `redo`: Redoes the last undone command.
-   `get`: Gets the current state of the page.

## Where to add LLMs

-   **`lib/content-extractor.ts`**: Map messy text to a `ContentGraph` (swap heuristics for an LLM where available).
-   **Chat command parsing**: The current regex-based parser works well, but you can layer an LLM classifier on top to produce transform plans.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the project's GitHub repository.

## License

MIT © 2025 Grid 2.0
