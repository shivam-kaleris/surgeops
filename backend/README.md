# SurgeOps Backend

This backend implements the complete set of services required by the SurgeOps frontend.  It is built with Java 17 and Spring Boot 3 and uses PostgreSQL 16 with the pgvector extension for vector search.  All configuration is driven via environment variables loaded from a `.env` file at the project root.

## Running Locally

1. Ensure Docker and Docker Compose are installed.
2. Copy the provided `.env` file to the project root.  Adjust any values if necessary (for example, supply your own Azure OpenAI endpoint and API key if you wish to enable LLM features).
3. From the repository root, start the services:

```bash
docker compose up -d --build
```

This command builds the backend image, starts a PostgreSQL instance with the `pgvector` extension enabled, and applies Flyway migrations to initialise the schema and seed demo data.  Once the backend container reports as healthy, it will be available at <http://localhost:8080>.

## Smoke Tests

After the containers are running you can exercise the API using the following `curl` commands.  All timestamps are ISO‐8601 in UTC.

### Dashboard

```bash
# Get dashboard KPIs
curl http://localhost:8080/dashboard
```

### Alerts

```bash
# List alerts
curl http://localhost:8080/alerts

# Acknowledge a specific alert (replace <ALERT_ID> with a real UUID from the previous call)
curl -X POST http://localhost:8080/alerts/<ALERT_ID>/ack
```

### Events and LLM Summary

```bash
# List events
curl http://localhost:8080/events

# Request an LLM summary of recent events (requires Azure OpenAI configuration)
curl -X POST http://localhost:8080/events/llm-summary
```

### Yard Blocks

```bash
# List all yard blocks
curl http://localhost:8080/yard-blocks

# Retrieve utilisation history (~36 hours)
curl http://localhost:8080/yard-blocks/utilization

# Move containers between blocks
curl -X POST http://localhost:8080/yard-blocks/B1/move \
     -H "Content-Type: application/json" \
     -d '{"from":"B1","to":"B5","teu":100}'
```

### Berths

```bash
# Get all berths and current assignments
curl http://localhost:8080/berths
```

### Weather

```bash
# Fetch the latest weather observation for a named port.  If no recent observation exists,
# the service queries the Open‑Meteo API, persists the result, and returns it.
curl "http://localhost:8080/weather?location=Port%20Alpha"
```

### Vessel Upsert and Surge Detection

```bash
# Upsert a vessel.  Providing a new ETA or TEU will trigger surge detection after the write commits.
curl -X POST http://localhost:8080/vessels \
     -H "Content-Type: application/json" \
     -d '{"name":"MV Test Surge","imo":"IMO000X","expectedTeu":1200,"eta":"2025-08-17T10:30:00Z","status":"Waiting"}'
```

### Graph Data

```bash
# Retrieve hourly arrivals and projected TEU between two timestamps
curl "http://localhost:8080/vessels/updates?from=2025-08-17T00:00:00Z&to=2025-08-18T00:00:00Z"
```

### Surges and Action Plans

```bash
# List recent surges
curl http://localhost:8080/surges/recent

# Fetch a specific surge (replace <SURGE_ID> with a UUID)
curl http://localhost:8080/surges/<SURGE_ID>

# Retrieve the action plan associated with a surge
curl http://localhost:8080/surges/<SURGE_ID>/action-plan

# Accept an action plan (nice-to-have endpoint)
curl -X POST http://localhost:8080/surges/<SURGE_ID>/action-plan/accept
```

### Vector Ingest

```bash
# Rebuild the knowledge base by embedding current DB facts and upserting them into kb_chunks
curl -X POST http://localhost:8080/ingest/rebuild
```

### Hybrid Chat

```bash
# Ask a question using the hybrid chat service.  The system grounds its answer on the
# database facts and relevant vector chunks.  Requires Azure OpenAI configuration.
curl -X POST http://localhost:8080/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Which vessels are arriving soon and which blocks are critical?"}'
```

### Sandbox End‑to‑End

```bash
# Execute a full sandbox run that simulates a surge, raises alerts, generates an action plan,
# returns graph data and a chat sample.  Useful for demonstration purposes.
curl -X POST http://localhost:8080/sandbox/run
```

## Notes

* All endpoints accept and return JSON.
* When Azure OpenAI configuration variables (`AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY`) are left empty, chat and summarisation endpoints return deterministic, database‑derived answers.
* Vector search functionality relies on the `pgvector` extension.  Flyway migrations enable this extension automatically.

This README serves as a quick reference for testing the backend.  For full API documentation, browse the automatically generated OpenAPI/Swagger UI at <http://localhost:8080/swagger-ui.html> once the backend is running.