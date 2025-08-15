
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


# SurgeOps: Port Operations Dashboard

SurgeOps is a modern port operations dashboard for real-time monitoring, surge simulation, and AI-powered action planning.

## Getting Started

1. Clone the repository:
	```sh
	git clone <YOUR_GIT_URL>
	cd <YOUR_PROJECT_NAME>
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Start the development server:
	```sh
	npm run dev
	```

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

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

