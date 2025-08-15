
# SurgeOps: Port Operations Dashboard

SurgeOps is a modern port operations dashboard for real-time monitoring, surge simulation, and AI-powered action planning.

## Features

- Real-time dashboard with KPIs, yard utilization, berth status, weather, and alerts
- Surge simulation and LLM-generated action plans
- RAG-powered SurgeOps AI Assistant for operational queries
- Modular, schema-driven frontend (React, Vite, shadcn-ui, Tailwind CSS)

## API & Backend Expectations

- The frontend expects a RESTful backend with endpoints such as:
	- `GET /dashboard` — all dashboard data (KPIs, chart, blocks, berths, weather, alerts, events)
	- `POST /simulate/surge` — trigger a surge event and LLM action plan generation
	- `GET /action-plan` — fetch the latest LLM-generated action plan
	- `POST /chat` — chat with the SurgeOps AI Assistant (LLM-powered)
	- `GET /alerts`, `GET /events`, `GET /yard-blocks`, `GET /berths`, `GET /weather?location=...`
- All endpoints should return JSON matching the schemas in `src/lib/mockData.ts` (see also the modular JSON schemas in this repo's documentation)

## UI Customizations

- SurgeOps AI Assistant header uses a solid blue color for clarity
- Action Plan buttons (Accept, Update, Reject) are at the top for better UX
- "Implementation Steps" renamed to "Action Plan" throughout the UI


## Project info

**URL**: https://lovable.dev/projects/aa571abc-9a16-4f78-a762-d608e04b2c87

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/aa571abc-9a16-4f78-a762-d608e04b2c87) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

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

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/aa571abc-9a16-4f78-a762-d608e04b2c87) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
