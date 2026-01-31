# Temporal Multi-Server Orchestration POC



A Temporal.io proof-of-concept demonstrating workflow orchestration across multiple Node.js servers.A comprehensive Proof of Concept demonstrating **Temporal.io workflow orchestration** across multiple Node.js backend servers. This project showcases both **single-server** and **multi-server activity orchestration** patterns using Temporal's powerful workflow engine.



## Installation## 🎯 Project Overview



```bashThis POC demonstrates:

npm install

```- ✅ **Temporal.io SDK** integration with Node.js

- ✅ **Multi-server orchestration** with two independent Express services

## Setup- ✅ **Local activities** (single-server operations)

- ✅ **Remote activities** (cross-server API calls)

1. **Start Temporal server:**- ✅ **Workflow composition** with error handling and retries

```bash- ✅ **Docker Compose** setup for running Temporal server locally

npm run temporal

```## 📁 Project Structure



2. **Start Server A (in new terminal):**```

```bashtemporal-poc/

npm run server-a├── temporal/                   # Temporal workflow components

```│   ├── activities.js          # Activity definitions (local & remote)

│   ├── workflow.js            # Workflow orchestration logic

3. **Start Server B (in new terminal):**│   ├── worker.js              # Temporal worker implementation

```bash│   └── client.js              # Workflow client (starts workflows)

npm run server-b│

```├── server-a/                   # Backend Service A

│   └── index.js               # Express server with local APIs

4. **Start Worker (in new terminal):**│

```bash├── server-b/                   # Backend Service B

npm run worker│   └── index.js               # Express server with external APIs

```│

├── docker-compose.yml         # Temporal server setup

5. **Execute workflow (in new terminal):**├── package.json               # Dependencies and scripts

```bash└── README.md                  # This file

npm run client```

```

## 🏗️ Architecture

## Architecture

```

- **Server A (port 3001)**: Local data processing┌─────────────────────────────────────────────────────────────┐

- **Server B (port 3002)**: External data processing│                     Temporal Server                          │

- **Temporal Server (port 7233)**: Workflow orchestration│                  (Docker Compose)                            │

- **Temporal UI (port 7070)**: http://localhost:7070└──────────────────────┬──────────────────────────────────────┘

                       │

## Workflow Flow                       │ gRPC

                       │

1. Validate data (Server A)┌──────────────────────▼──────────────────────────────────────┐

2. Process data locally (Server A)│                  Temporal Worker                             │

3. Process data remotely (Server B)│            (Executes Workflows & Activities)                 │

4. Enrich data (Server B)└─────────┬──────────────────────────┬────────────────────────┘

5. Combine results          │                          │

          │ HTTP                     │ HTTP

## Custom Input          │                          │

┌─────────▼─────────┐      ┌────────▼──────────┐

```bash│    Server A       │      │    Server B        │

node temporal/client.js "your custom data"│  (Port 3001)      │      │  (Port 3002)       │

```│                   │      │                    │
│  Local Activities │      │  Remote Activities │
│  - Validation     │      │  - Enrichment      │
│  - Processing     │      │  - External API    │
└───────────────────┘      └────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ installed
- **Docker** and **Docker Compose** installed
- **npm** or **yarn** package manager

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Temporal Server

```bash
# Start Temporal server with Docker Compose
npm run temporal:start

# Wait for all services to be healthy (30-60 seconds)
# Check status with:
docker compose ps
```

The following services will start:
- **Temporal Server** (port 7233)
- **Temporal Web UI** (http://localhost:7070)
- **PostgreSQL** (port 5432)

### Step 3: Start Backend Servers

Open **3 separate terminal windows**:

**Terminal 1 - Server A:**
```bash
npm run dev:server-a
```

**Terminal 2 - Server B:**
```bash
npm run dev:server-b
```

**Terminal 3 - Temporal Worker:**
```bash
npm run dev:worker
```

Alternatively, run all services in one command (in a single terminal):
```bash
npm run dev:all
```

### Step 4: Execute Workflows

Open a **4th terminal window** and run:

```bash
# Run the multi-server orchestration workflow
npm run dev:client

# Or with custom input data
node temporal/client.js "my custom data"

# Or run the simple workflow
node temporal/client.js "test data" simple
```

### Step 5: View Workflow Execution

Open the **Temporal Web UI** in your browser:
```
http://localhost:7070
```

You can view:
- Workflow execution history
- Activity results
- Retry attempts
- Workflow state and timeline

## 📊 Workflow Flow

The **Multi-Server Orchestration Workflow** executes the following steps:

```
1. Health Check (Both Servers)
   ├─ Ping Server A
   └─ Ping Server B

2. Validate Data (Server A - Local Activity)
   └─ POST /validate

3. Process Local Data (Server A - Local Activity)
   └─ POST /process-internal

4. Process Remote Data (Server B - Remote Activity)
   └─ POST /process-external
   └─ Demonstrates inter-server communication

5. Enrich Data (Server B - Remote Activity)
   └─ POST /enrich

6. Combine Results (Pure Computation)
   └─ Merge all activity results

✅ Return Final Result
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:server-a` | Start Server A (port 3001) |
| `npm run dev:server-b` | Start Server B (port 3002) |
| `npm run dev:worker` | Start Temporal worker |
| `npm run dev:client` | Execute workflow |
| `npm run dev:all` | Start all services concurrently |
| `npm run temporal:start` | Start Temporal server (Docker) |
| `npm run temporal:stop` | Stop Temporal server |
| `npm run temporal:logs` | View Temporal logs |

## 🔌 API Endpoints

### Server A (http://localhost:3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ping` | Health check |
| POST | `/process-internal` | Internal data processing |
| POST | `/validate` | Data validation |
| GET | `/status` | Server status and metrics |

### Server B (http://localhost:3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ping` | Health check |
| POST | `/process-external` | External data processing |
| POST | `/enrich` | Data enrichment |
| POST | `/third-party-api` | Third-party API simulation |
| GET | `/status` | Server status and metrics |

## 📝 Key Concepts

### Activities

**Activities** contain the business logic that interacts with external systems:

- **Local Activities**: Run on a single server (e.g., data validation on Server A)
- **Remote Activities**: Call APIs on different servers (e.g., Server A → Server B)
- Activities are **retryable** and can handle failures gracefully
- Defined in `temporal/activities.js`

### Workflows

**Workflows** orchestrate the execution of activities:

- Define the **sequence and logic** of activity execution
- Are **deterministic** and can be replayed
- Handle **errors, retries, and compensation** logic
- Cannot directly perform I/O operations
- Defined in `temporal/workflow.js`

### Workers

**Workers** execute workflows and activities:

- Poll the Temporal server for tasks
- Execute workflow and activity code
- Report results back to the server
- Can be **scaled horizontally** for high throughput
- Defined in `temporal/worker.js`

### Clients

**Clients** start and interact with workflows:

- Start new workflow executions
- Query workflow state
- Send signals to workflows
- Retrieve workflow results
- Defined in `temporal/client.js`

## 🧪 Testing Different Scenarios

### Test Local Activity Only

```bash
node temporal/client.js "test data" simple
```

### Test with Different Input

```bash
node temporal/client.js "my-custom-data" multi
```

### Test Server Failure Handling

1. Start workflow execution
2. Stop Server B during execution:
   ```bash
   # In Server B terminal, press Ctrl+C
   ```
3. Observe Temporal's automatic retry mechanism
4. Restart Server B - workflow will complete successfully

### View Workflow History

1. Go to http://localhost:8080
2. Click on your workflow execution
3. View the complete history of events
4. Inspect activity inputs/outputs
5. See retry attempts and timing

## 🔍 Troubleshooting

### Temporal Server Not Starting

```bash
# Check Docker is running
docker --version

# Stop and clean up
npm run temporal:stop
docker compose down -v

# Restart
npm run temporal:start
```

### Worker Cannot Connect

```bash
# Check Temporal server is running
docker-compose ps

# Check logs
npm run temporal:logs

# Verify port 7233 is accessible
telnet localhost 7233
```

### Activity Failures

Check that both servers are running:
```bash
curl http://localhost:3001/ping
curl http://localhost:3002/ping
```

### Port Already in Use

If ports 3001, 3002, or 7233 are in use:

1. Find and stop the conflicting process:
   ```bash
   lsof -i :3001
   lsof -i :3002
   lsof -i :7233
   ```

2. Or change ports in the respective files:
   - Server A: `server-a/index.js`
   - Server B: `server-b/index.js`
   - Temporal: `docker-compose.yml`

## 📚 Learn More

- [Temporal.io Documentation](https://docs.temporal.io/)
- [Temporal Node.js SDK](https://github.com/temporalio/sdk-typescript)
- [Temporal Samples](https://github.com/temporalio/samples-typescript)
- [Temporal Web UI](https://github.com/temporalio/ui)

## 🎓 Advanced Features to Explore

1. **Signals**: Send data to running workflows
2. **Queries**: Get workflow state without side effects
3. **Child Workflows**: Compose workflows
4. **Timers**: Schedule delayed activities
5. **Cancellation**: Cancel running workflows
6. **Saga Pattern**: Compensate for failures
7. **Search Attributes**: Query workflow executions
8. **Versioning**: Handle workflow code changes

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `@temporalio/worker` | Execute workflows and activities |
| `@temporalio/client` | Start and interact with workflows |
| `@temporalio/workflow` | Workflow authoring APIs |
| `@temporalio/activity` | Activity authoring APIs |
| `express` | HTTP server framework |
| `axios` | HTTP client for API calls |
| `nanoid` | Generate unique IDs |
| `concurrently` | Run multiple commands |

## 🔒 Production Considerations

Before deploying to production:

1. **Security**
   - Add authentication to API endpoints
   - Use TLS for Temporal connections
   - Secure inter-service communication

2. **Monitoring**
   - Add application logging (Winston, Pino)
   - Set up metrics collection (Prometheus)
   - Configure alerting

3. **Scaling**
   - Run multiple worker instances
   - Use load balancers for servers
   - Configure Temporal for high availability

4. **Error Handling**
   - Define retry policies per activity
   - Implement circuit breakers
   - Add fallback mechanisms

5. **Testing**
   - Unit tests for activities
   - Integration tests for workflows
   - End-to-end tests for complete flows

## 🔐 Environment Variables

This project uses environment variables for configuration. See [.env.example](.env.example) for all available options:

- **SERVER_A_PORT**: Port for Server A (default: 3001)
- **SERVER_B_PORT**: Port for Server B (default: 3002)
- **SERVER_A_URL**: URL for Server A APIs (default: http://localhost:3001)
- **SERVER_B_URL**: URL for Server B APIs (default: http://localhost:3002)
- **TEMPORAL_ADDRESS**: Temporal server address (default: localhost:7233)
- **TEMPORAL_NAMESPACE**: Temporal namespace (default: default)
- **TEMPORAL_TASK_QUEUE**: Task queue name (default: multi-server-queue)
- **POSTGRES_USER**: PostgreSQL username (default: temporal)
- **POSTGRES_PASSWORD**: PostgreSQL password (default: temporal)
- **POSTGRES_DB**: PostgreSQL database name (default: temporal)

**Important**: Never commit the `.env` file to version control. Always use `.env.example` as a template.

## 🤝 Contributing

Feel free to extend this POC with:
- Additional activities
- More complex workflows
- Different orchestration patterns
- Enhanced error handling
- Monitoring and observability

## 📄 License

ISC

---

**Happy Orchestrating! 🎉**

For questions or issues, check the Temporal documentation or open an issue.
