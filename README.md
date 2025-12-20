# Multi-Tenant SaaS Platform with Project & Task Management

A production-ready, multi-tenant SaaS application where multiple organizations (tenants) can independently register, manage their teams, create projects, and track tasks. Built with Node.js, React, PostgreSQL, and Docker.

## Features

- **Multi-Tenancy Architecture**: Complete data isolation between tenants using shared database with separate schemas
- **User Authentication**: JWT-based authentication with 24-hour token expiry
- **Role-Based Access Control (RBAC)**: Three roles - Super Admin, Tenant Admin, and User
- **Tenant Management**: Self-service tenant registration with unique subdomains
- **User Management**: Add, update, delete users within tenants
- **Project Management**: Create, update, and manage projects
- **Task Management**: Create and track tasks with assignment and status tracking
- **Subscription Plans**: Free, Pro, and Enterprise plans with usage limits
- **Audit Logging**: Track all important actions for security
- **Docker Deployment**: Fully containerized with docker-compose
- **Responsive Design**: Mobile-friendly frontend interface

## Technology Stack

### Frontend
- React 18
- Axios for API calls
- React Router for navigation
- CSS3 for styling
- Context API for state management

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

### DevOps
- Docker & Docker Compose
- PostgreSQL 15
- Nginx (optional reverse proxy)

## Project Structure

```
multi-tenant-saas-platform/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & CORS
│   │   ├── utils/        # Utility functions
│   │   └── config/       # Configuration
│   ├── migrations/       # Database migrations
│   ├── seeds/            # Seed data
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── context/      # Context/state
│   │   ├── styles/       # CSS files
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── docs/                 # Documentation
│   ├── research.md       # Multi-tenancy research
│   ├── PRD.md            # Product requirements
│   ├── architecture.md   # System architecture
│   ├── technical-spec.md # Technical details
│   └── API.md            # API documentation
├── docker-compose.yml    # Docker configuration
├── submission.json       # Submission metadata
└── README.md
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+ (for local development)

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/MadhavaKandala/multi-tenant-saas-platform.git
cd multi-tenant-saas-platform

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
```

### Default Test Credentials

**Super Admin:**
- Email: `superadmin@system.com`
- Password: `Admin@123`

**Demo Tenant:**
- Subdomain: `demo`
- Admin Email: `admin@demo.com`
- Admin Password: `Demo@123`

## API Documentation

See `docs/API.md` for detailed API endpoint documentation including:
- Authentication endpoints
- Tenant management
- User management
- Project management
- Task management

## Database Schema

The application uses PostgreSQL with the following core tables:
- `tenants` - Organization information
- `users` - User accounts with RBAC
- `projects` - Projects within tenants
- `tasks` - Tasks within projects
- `audit_logs` - Action audit trail
- `sessions` (optional) - User sessions

## Key Features Explained

### Multi-Tenancy
Data isolation is enforced at the database query level. Every table (except super_admin users) includes a `tenant_id` foreign key. Queries automatically filter by the authenticated user's tenant to prevent cross-tenant data access.

### Authentication & Authorization
JWT tokens contain userId, tenantId, and role. Role-based middleware checks permissions before allowing access to endpoints. Subscription limits are enforced at the API level.

### Subscription Plans
- **Free**: 5 users, 3 projects
- **Pro**: 25 users, 15 projects
- **Enterprise**: 100 users, 50 projects

## Health Check

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected"
}
```

## Development Setup (Local)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Deployment

The application is designed to be deployed using Docker:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Node.js backend API
- React frontend

All services are configured with health checks and automatic restarts.

## Testing

Test the application with the seed data:

1. Login as Super Admin to manage all tenants
2. Login as Tenant Admin to manage a single organization
3. Login as User to manage assigned tasks

## Documentation Files

- `docs/research.md` - In-depth analysis of multi-tenancy approaches
- `docs/PRD.md` - Product requirements and user personas
- `docs/architecture.md` - System design and ERD
- `docs/technical-spec.md` - Implementation details
- `docs/API.md` - Complete API reference

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
