# Changelog

All notable changes to the Device Inventory Alert Tracker project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup with React, TypeScript, and Express
- Comprehensive data models for devices, alerts, and audit logs
- Backend API endpoints with in-memory storage
- Dashboard page with key metrics
- Device management page with CRUD operations
- Alert management page with CRUD operations
- Audit logs page for tracking system activities
- Integration of shadcn UI components for consistent design

### Fixed
- Device editing functionality not retaining values when navigating between pages (commit: 7a9e4b2c0f)
- Alerts and Audit Logs pages failing to load due to empty SelectItem values (commit: d8f3e5a1b7)
- Type issues in alert modal's device_id field (commit: d8f3e5a1b7)
- Badge component extended to support custom variants (info, warning, success) (commit: d8f3e5a1b7)

### Changed
- Updated filter logic to use "all" instead of empty strings for better UX
- Enhanced audit logging to capture all user activities

## [Future Plans]
- Real-time metric ingestion from devices
- Alert automation via configurable thresholds
- Advanced filtering and searching capabilities
- Enhanced data visualization for device metrics
- More detailed audit logging that captures before/after states
- Contextual information and action details in audit logs