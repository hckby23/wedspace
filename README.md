# WedSpace - Coming Soon Page

This is the "Coming Soon" welcome page for WedSpace, built with React, TypeScript, Vite, and Tailwind CSS.

## Project Structure

- `public/`: Static assets.
- `src/`:
  - `assets/`: Images, fonts, etc.
  - `components/`: Reusable UI components (e.g., buttons, cards - if using shadcn/ui, this might be auto-generated).
  - `pages/`: Top-level page components (e.g., `App.tsx`).
  - `sections/`: Components for different sections of the landing page (Hero, Features, etc.).
  - `styles/`: Global styles, Tailwind base, etc. (`index.css`).
  - `lib/`: Utility functions, shadcn `cn` helper.
  - `main.tsx`: Main application entry point.
- `index.html`: HTML entry point.
- `vite.config.ts`: Vite configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.

## Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

3.  **Build for production:**
    ```bash
    npm run build
    ```
    This will create a `dist` folder with the optimized production build.

4.  **Preview the production build:**
    ```bash
    npm run preview
    ```

## Key Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- (Potentially shadcn/ui for UI components - to be decided)

## UI Inspiration

Colors and fonts are inspired by the `ws2` project:
- **Fonts:** Playfair Display (display), Inter (body)
- **Primary Color:** `#F59E0B` (Orange/Amber)
- **Secondary Color:** `#DC2626` (Strong Red)
- **Accent Color:** `#FFDEE2` (Soft Pink)
- **Background Color:** `#FDE1D3` (Soft Peach)
