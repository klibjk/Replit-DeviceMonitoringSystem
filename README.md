# Device Inventory Alert Tracker

A full-stack CRUD application for managing device inventory and alerts with audit logging functionality.

## Features

- **Device Management**: Create, read, update, and delete device inventory records
- **Alert Tracking**: Monitor device alerts with different severity levels
- **Audit Logging**: Track all system operations for accountability
- **Dashboard**: View key metrics and recent activities at a glance
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

This application uses an in-memory database for demo purposes. All data will be reset when the server restarts.

1. Click the "Run" button in Replit to start the application
2. Navigate to the different sections using the sidebar:
   - **Dashboard**: Overview of system metrics
   - **Devices**: Manage your device inventory
   - **Alerts**: Create and manage device alerts
   - **Audit Logs**: View history of system operations

## Development

### Technology Stack

- **Frontend**: React, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Drizzle ORM
- **Storage**: In-memory (Maps) with plans for PostgreSQL migration

### Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express API
- `/shared`: Shared schemas and types
- `/docs`: Project documentation

### Running Locally

The application is configured to run with the following workflow:

```
npm run dev
```

This starts the Express server and the Vite development server.

## Future Enhancements

- PostgreSQL database integration
- User authentication and authorization
- Advanced filtering and searching
- Real-time device metrics
- Alert automation based on thresholds
- Dark/light theme toggle

## Documentation

Additional documentation can be found in the `/docs` directory:

- [Feature Progress](./docs/FEATURES.md)
- [Changelog](./docs/CHANGELOG.md)
- [Manual Test Reports](./docs/manual_test_reports.md)