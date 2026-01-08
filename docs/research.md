# Research Document

## 1. Multi-Tenancy Analysis

Multi-tenancy is a software architecture where a single application instance serves multiple independent organizations called tenants. Each tenant’s data must remain isolated and secure from others while sharing the same application infrastructure. This approach is widely used in Software-as-a-Service (SaaS) platforms to reduce cost and simplify maintenance.

### Approach 1: Shared Database + Shared Schema (Tenant ID Based)

In this approach, all tenants share the same database and the same set of tables. Each table contains a `tenant_id` column to distinguish which data belongs to which tenant. Every database query includes a tenant_id condition to ensure data isolation.

**Advantages:**
- Lowest infrastructure cost
- Easy to scale for new tenants
- Simple database management
- Commonly used in early-stage SaaS products

**Disadvantages:**
- Risk of data leakage if tenant_id filtering is missed
- Requires strict query discipline
- More responsibility on developers

### Approach 2: Shared Database + Separate Schema per Tenant

In this approach, a single database is used, but each tenant has its own schema. For example, tenant1.users and tenant2.users exist separately.

**Advantages:**
- Better data isolation than shared schema
- Reduced risk of accidental data leakage
- Moderate cost

**Disadvantages:**
- Complex schema migrations
- Harder to manage many tenants
- Increased operational complexity

### Approach 3: Separate Database per Tenant

In this model, each tenant has its own completely separate database.

**Advantages:**
- Strongest data isolation
- High security
- Easy to meet compliance requirements

**Disadvantages:**
- Very expensive
- Difficult to scale
- Complex maintenance and backups

### Comparison Table

| Approach | Pros | Cons | Suitable Use Case |
|--------|------|------|------------------|
| Shared DB + Shared Schema | Low cost, scalable | Risky if misused | Startups, small SaaS |
| Shared DB + Separate Schema | Better isolation | Complex migrations | Medium SaaS |
| Separate DB per Tenant | Maximum security | Very expensive | Banks, enterprises |

### Chosen Approach Justification

This project uses the **Shared Database + Shared Schema with tenant_id** approach. This method was chosen because it is cost-effective, scalable, and commonly used in real-world SaaS platforms. With proper authentication, authorization, and strict tenant_id filtering at the backend, data isolation can be effectively enforced while keeping the system simple and maintainable.

---

## 2. Technology Stack Justification

### Backend Framework
The backend is built using **Node.js with Express.js**. Node.js is lightweight, fast, and well-suited for building REST APIs. Express provides a simple and flexible framework for routing and middleware handling.

**Alternatives considered:** Django, Spring Boot  
**Reason for rejection:** Heavier setup and steeper learning curve.

### Frontend Framework
The frontend uses **React.js**. React provides component-based architecture, making the UI reusable and maintainable. It also has a large ecosystem and community support.

**Alternatives considered:** Angular, Vue.js

### Database
**PostgreSQL** is used as the database. It provides strong relational integrity, ACID compliance, indexing, and supports complex queries required for multi-tenant systems.

**Alternatives considered:** MySQL, MongoDB  
MongoDB was avoided due to weaker relational constraints.

### Authentication Method
**JWT (JSON Web Tokens)** are used for authentication. JWTs are stateless, scalable, and ideal for REST APIs. Tokens are set with a 24-hour expiration for security.

### Deployment Platform
**Docker and Docker Compose** are used to containerize the frontend, backend, and database. This ensures consistent environments and simplifies deployment and evaluation.

---

## 3. Security Considerations

1. **Tenant Data Isolation**  
All database queries include tenant_id filtering to prevent cross-tenant data access.

2. **Authentication**  
JWT-based authentication ensures only valid users can access the system.

3. **Authorization (RBAC)**  
Role-based access control ensures users can only perform actions permitted by their role.

4. **Password Hashing**  
Passwords are hashed using bcrypt before storing in the database.

5. **API Security**  
All APIs are protected using authentication middleware, and sensitive endpoints are restricted by role.