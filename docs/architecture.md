# System Architecture

## System Architecture Diagram
The system follows a three-tier architecture:
- Client (Browser)
- Frontend (React)
- Backend (Node.js)
- Database (PostgreSQL)

Diagram file: docs/images/system-architecture.png

---

## Database Schema Design
The database includes the following tables:
- tenants
- users
- projects
- tasks
- audit_logs

Each table includes a tenant_id column for isolation.
Diagram file: docs/images/database-erd.png

---

## API Architecture

| Module | Endpoint | Method | Auth | Role |
|------|---------|--------|------|------|
| Auth | /login | POST | No | All |
| Auth | /register | POST | No | All |
| User | /users | GET | Yes | Admin |
| User | /users | POST | Yes | Admin |
| Project | /projects | GET | Yes | User |
| Project | /projects | POST | Yes | Admin |
| Task | /tasks | GET | Yes | User |
| Task | /tasks | POST | Yes | User |
| Task | /tasks/:id | PUT | Yes | User |
| Admin | /tenants | GET | Yes | Super Admin |
| Health | /api/health | GET | No | All |