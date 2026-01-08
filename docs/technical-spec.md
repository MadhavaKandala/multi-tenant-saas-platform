# Technical Specification

## Project Structure

### Backend
backend/
- src/controllers: Business logic
- src/routes: API routing
- src/models: Database models
- src/middleware: Authentication and RBAC
- src/utils: Utility functions
- src/config: Configuration files
- migrations: Database migrations
- tests: Backend tests

### Frontend
frontend/
- src/pages: Application pages
- src/components: Reusable UI components
- src/services: API services
- src/utils: Helper functions

---

## Development Setup Guide

### Prerequisites
- Node.js v18+
- Docker & Docker Compose

### Environment Variables
- DATABASE_URL
- JWT_SECRET

### Installation
- Clone the repository
- Run docker-compose up -d

### Running Locally
- Backend runs on port 5000
- Frontend runs on port 3000
- Database runs on port 5432