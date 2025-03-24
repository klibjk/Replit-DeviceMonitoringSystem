# Device Inventory Alert Tracker

A full-stack CRUD application for managing device inventory and alerts with comprehensive monitoring and audit logging capabilities.

## Features

- **Device Management**: Create, read, update, and delete device inventory records
- **Alert Tracking**: Monitor device alerts with different severity levels
- **Audit Logging**: Track all system operations for accountability
- **Dashboard**: View key metrics and recent activities at a glance
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Repository Versions

This repository maintains two versions of the application with different storage implementations:

- **Main Branch (PostgreSQL)**: Uses PostgreSQL database for persistent storage
- **In-Memory Branch**: Uses in-memory data structures for demo and testing purposes

### Quick Start (PostgreSQL Version)

The main branch uses a PostgreSQL database for persistent storage.

1. Ensure PostgreSQL is installed and running
2. Set up environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - (Alternative: Individual `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` variables)
3. Run `npm run db:push` to set up the database schema
4. Start the application with `npm run dev`

### Quick Start (In-Memory Version)

The in-memory branch uses JavaScript Maps for storage (data will be reset when the server restarts).

1. Switch to the in-memory branch: `git checkout in-memory-demo`
2. Start the application with `npm run dev`
3. Navigate to the different sections using the sidebar:
   - **Dashboard**: Overview of system metrics
   - **Devices**: Manage your device inventory
   - **Alerts**: Create and manage device alerts
   - **Audit Logs**: View history of system operations

## Technology Stack

- **Frontend**: React, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Drizzle ORM
- **Storage**: 
  - PostgreSQL with Drizzle ORM (main branch)
  - In-memory JavaScript Maps (in-memory-demo branch)

## Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express API
- `/shared`: Shared schemas and types
- `/docs`: Project documentation

## Development

### Git Branching Strategy

- **main**: Production-ready code with PostgreSQL integration
- **in-memory-demo**: Simplified version using in-memory storage for demos and testing

### Running Locally

The application is configured to run with the following workflow:

```
npm run dev
```

This starts the Express server and the Vite development server.

## Future Enhancements

- User authentication and authorization
- Advanced filtering and searching
- Real-time device metrics
- Alert automation based on thresholds
- Dark/light theme toggle
- Data visualization enhancements

## Documentation

Additional documentation can be found in the `/docs` directory:

- [Feature Progress](./docs/FEATURES.md)
- [Changelog](./docs/CHANGELOG.md)
- [Manual Test Reports](./docs/manual_test_reports.md)