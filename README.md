# Wedspace - Wedding Planning Platform

Wedspace is a comprehensive wedding planning platform built with React, TypeScript, and Vite. It provides tools for couples to plan their weddings, find venues and vendors, and manage their wedding details.

## Features

- User authentication and account management
- Venue and vendor discovery and booking
- Wedding planning tools (checklists, budgets, guest lists, timelines)
- User dashboard for tracking wedding planning progress
- Responsive design for all devices

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Local Development

To run the project locally, you need to have Node.js and npm installed.

```bash
npm install
npm run dev
```

This will start a development server at http://localhost:8080.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn UI (based on Radix UI)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Query
- **Backend Integration**: Supabase
- **Deployment**: Optimized for Vercel

## Deployment

This project is optimized for deployment on Vercel. For detailed deployment instructions, see the [VERCEL.md](./VERCEL.md) file.

To build the project locally, run:

```bash
npm run build
```

This will create a `dist` folder with the built project that can be deployed to any static hosting service.

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Application pages
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and configuration
  - `/data`: Data models and mock data
- `/public`: Static assets
- `/supabase`: Supabase configuration
